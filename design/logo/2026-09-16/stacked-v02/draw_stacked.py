"""Two-line custom wordmark and revised fluid h; all lettering is paths."""
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
# Bent ascender, asymmetric shoulder, an S-shaped descending stroke, and a
# short returning terminal. This is a new contour, not a skewed font glyph.
glyphs['h'] = 'M30 0 H66 C66 49 61 97 48 143 C79 106 107 84 137 84 C181 84 206 111 202 156 C199 188 185 220 175 249 C166 275 164 290 178 298 C186 303 197 302 206 298 L218 326 C198 337 176 335 158 322 C132 304 138 274 147 247 L165 194 C174 168 179 145 168 131 C159 118 146 116 132 120 C89 132 74 169 47 207 C38 234 35 268 36 318 H0 C0 259 7 213 18 173 C28 132 36 72 30 0 Z'

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
bottom = [('h',0),('o',245),('u',474),('s',688),('e',895)]
wordmark = [shape(glyphs[l],tx=x+10,ty=8) for l,x in top]
wordmark += [shape(glyphs[l],tx=x+10,ty=388) for l,x in bottom]
monogram = [shape(ligature_e,tx=15,ty=35),shape(glyphs['h'],tx=183,ty=35)]

for name,color in [('ivory',IVORY),('gold',GOLD),('ink',INK)]:
    (OUT/f'eleven-house-stacked-{name}.svg').write_text(svg(place(wordmark,0,0,1,color),1131,735,'Eleven House — двухстрочный векторный логотип'))
    (OUT/f'eh-fluid-{name}.svg').write_text(svg(place(monogram,0,0,1,color),421,405,'ElevenHouse — монограмма eh с пластичной h'))

board=[rect(0,0,1600,1080,INK),rect(1020,0,580,1080,IVORY)]
board+=place(wordmark,88,85,.735,IVORY)
board+=place(monogram,1134,103,.86,INK)
board+=place(wordmark,1103,650,.36,INK)
board+=place(wordmark,95,795,.285,GOLD)
board+=place(monogram,617,790,.50,GOLD)
board+=place(monogram,875,920,.10,IVORY)
(OUT/'preview.svg').write_text(svg(board,1600,1080,'ElevenHouse — две строки и обновлённая h'))
(OUT/'preview.json').write_text(json.dumps(dict(width=1600,height=1080,shapes=board)))

# Large isolated letter comparison for internal visual review.
old_h = read_assignment(OUT.parent / 'draw_logo.py', 'GLYPHS')['h']
comparison=[rect(0,0,1000,640,INK),shape(old_h,IVORY,140,100,1.2),shape(glyphs['h'],GOLD,595,100,1.2)]
(OUT/'h-comparison.svg').write_text(svg(comparison,1000,640,'h — прежняя форма слева, новая справа'))
(OUT/'h-comparison.json').write_text(json.dumps(dict(width=1000,height=640,shapes=comparison)))

for file in OUT.glob('*.svg'):
    root=ET.parse(file).getroot()
    assert all(el.tag.rsplit('}',1)[-1] in ('svg','title','path') for el in root.iter())
    assert all(el.attrib.get('d','Z').strip().endswith('Z') for el in root.iter())
print('Validated 6 standalone SVG exports and 2 presentation sheets; closed paths, no fonts.')
