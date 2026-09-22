"""Two-line custom wordmark with lower-right diagonal contours in o and u; all lettering is paths."""
from pathlib import Path
from html import escape
import ast
import json
from xml.etree import ElementTree as ET

OUT = Path(__file__).parent
INK, IVORY, GOLD = '#010308', '#F2F1EB', '#E2CA79'

def read_assignment(file, name):
    tree = ast.parse(file.read_text())
    return next(ast.literal_eval(n.value) for n in tree.body if isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id == name for t in n.targets))

glyphs = read_assignment(OUT.parent / 'draw_logo.py', 'GLYPHS')
ligature_e = read_assignment(OUT.parent / 'symbols/draw_symbols.py', 'ligature_e')
# Straight ascender, exact right-hand Bezier segment of n after x=36.
# The rest of the outer shoulder and the whole inner shoulder are shared with n.
glyphs['h'] = 'M0 0 H36 V150.8281 C49.1508 134.9866 65.0049 119.3515 82 105 C101 89 114 84 127 84 C169 84 188 118 188 168 V318 H152 V174 C152 137 139 119 113 119 C74 119 36 157 36 204 V318 H0 Z'

# Reference principle: the lower-right bowl flows down a diagonal, like the
# supplied a. Only the local contours change; there is no skew transform.
original_o, original_u = glyphs['o'], glyphs['u']
glyphs['o'] = 'M102 84 C162 84 197 117 199 169 C199 187 194 202 188 219 L159 288 C150 311 128 322 96 322 C33 322 1 277 1 207 C1 133 35 84 102 84 Z M101 118 C60 118 38 150 38 205 C38 258 60 288 89 288 C125 288 145 259 153 224 C159 200 162 182 162 167 C162 135 141 118 101 118 Z'
glyphs['u'] = 'M0 88 H36 V233 C36 271 52 288 79 288 C117 288 147 254 151 209 C154 176 153 126 153 88 H189 V149 C189 178 181 198 172 220 L150 280 C139 309 111 322 76 322 C27 322 0 291 0 239 Z'

def shape(d,fill=IVORY,tx=0,ty=0,scale=1):
    return dict(d=d,fill=fill,tx=tx,ty=ty,scale=scale)

def place(paths,x,y,s,color):
    return [shape(p['d'],color,x+p['tx']*s,y+p['ty']*s,p['scale']*s) for p in paths]

def rect(x,y,w,h,color):
    return shape(f'M{x} {y} H{x+w} V{y+h} H{x} Z',color)

def svg(paths,w,h,title):
    body='\n'.join(f'<path fill="{p["fill"]}" fill-rule="evenodd" transform="translate({p["tx"]} {p["ty"]}) scale({p["scale"]})" d="{p["d"]}"/>' for p in paths)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-label="{escape(title)}"><title>{escape(title)}</title>\n{body}\n</svg>\n'

top = [('e',0),('l',221),('e',284),('v',493),('e',707),('n',923)]
bottom = [('h',0),('o',220),('u',449),('s',663),('e',870)]
wordmark = [shape(glyphs[l],tx=x+10,ty=8) for l,x in top]
wordmark += [shape(glyphs[l],tx=x+10,ty=388) for l,x in bottom]
monogram = [shape(ligature_e,tx=15,ty=35),shape(glyphs['h'],tx=183,ty=35)]

for name,color in [('ivory',IVORY),('gold',GOLD),('ink',INK)]:
    (OUT/f'eleven-house-stacked-{name}.svg').write_text(svg(place(wordmark,0,0,1,color),1131,735,'Eleven House — двухстрочный векторный логотип'))
    pair=[shape(glyphs['o'],color,15,-62),shape(glyphs['u'],color,250,-62)]
    (OUT/f'ou-detail-{name}.svg').write_text(svg(pair,465,285,'o и u — диагональные правые контуры'))

board=[rect(0,0,1600,1080,INK),rect(1020,0,580,1080,IVORY)]
board+=place(wordmark,88,85,.735,IVORY)
board+=[shape(glyphs['o'],INK,1090,125,1.03),shape(glyphs['u'],INK,1350,125,1.03)]
board+=place(wordmark,1103,650,.36,INK)
board+=place(wordmark,95,795,.285,GOLD)
board+=place(monogram,617,790,.50,GOLD)
board+=place(monogram,875,920,.10,IVORY)
(OUT/'preview.svg').write_text(svg(board,1600,1080,'ElevenHouse — диагональные контуры o и u'))
(OUT/'preview.json').write_text(json.dumps(dict(width=1600,height=1080,shapes=board)))

# Left: original o/u. Right: revised o/u, at exactly the same scale.
comparison=[rect(0,0,1500,650,INK),shape(original_o,IVORY,100,80,1.20),shape(original_u,IVORY,385,80,1.20),shape(glyphs['o'],GOLD,855,80,1.20),shape(glyphs['u'],GOLD,1140,80,1.20)]
(OUT/'ou-comparison.svg').write_text(svg(comparison,1500,650,'o/u — прежние слева, новые справа'))
(OUT/'ou-comparison.json').write_text(json.dumps(dict(width=1500,height=650,shapes=comparison)))

for file in OUT.glob('*.svg'):
    root=ET.parse(file).getroot()
    assert all(el.tag.rsplit('}',1)[-1] in ('svg','title','path') for el in root.iter())
    assert all(el.attrib.get('d','Z').strip().endswith('Z') for el in root.iter())
print('Validated 6 standalone SVG exports and 2 presentation sheets; closed paths, no fonts.')
