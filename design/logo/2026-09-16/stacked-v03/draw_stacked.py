"""Two-line custom wordmark with h derived from the exact n shoulder; all lettering is paths."""
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
    (OUT/f'eh-unified-{name}.svg').write_text(svg(place(monogram,0,0,1,color),421,405,'ElevenHouse — монограмма eh с h на основе n'))

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
comparison=[rect(0,0,1000,640,INK),shape(glyphs['n'],IVORY,140,100,1.2),shape(glyphs['h'],GOLD,595,100,1.2)]
(OUT/'h-comparison.svg').write_text(svg(comparison,1000,640,'n и h — одинаковая геометрия плеча'))
(OUT/'h-comparison.json').write_text(json.dumps(dict(width=1000,height=640,shapes=comparison)))

for file in OUT.glob('*.svg'):
    root=ET.parse(file).getroot()
    assert all(el.tag.rsplit('}',1)[-1] in ('svg','title','path') for el in root.iter())
    assert all(el.attrib.get('d','Z').strip().endswith('Z') for el in root.iter())
print('Validated 6 standalone SVG exports and 2 presentation sheets; closed paths, no fonts.')
