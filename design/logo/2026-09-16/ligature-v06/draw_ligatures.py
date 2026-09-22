"""Compact hand-drawn eh ligatures; standalone exploration only."""
from pathlib import Path
import ast
import json
import xml.etree.ElementTree as ET

OUT=Path(__file__).parent
BASE=OUT.parent
INK,IVORY,GOLD='#010308','#F2F1EB','#E2CA79'

def assignment(file,name):
    tree=ast.parse(file.read_text())
    return next(ast.literal_eval(n.value) for n in tree.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id==name for t in n.targets))

def shape(d,fill=GOLD,tx=0,ty=0,scale=1):
    return dict(d=d,fill=fill,tx=tx,ty=ty,scale=scale)

def place(paths,x,y,s,color):
    return [shape(p['d'],color,x+p['tx']*s,y+p['ty']*s,p['scale']*s) for p in paths]

def rect(x,y,w,h,color):
    return shape(f'M{x} {y} H{x+w} V{y+h} H{x} Z',color)

def svg(paths,w,h,title):
    body='\n'.join(f'<path fill="{p["fill"]}" fill-rule="evenodd" transform="translate({p["tx"]} {p["ty"]}) scale({p["scale"]})" d="{p["d"]}"/>' for p in paths)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-label="{title}"><title>{title}</title>\n{body}\n</svg>\n'

e='M147 318 C131 321 112 322 94 322 C33 322 -3 291 3 249 C9 208 39 147 69 110 C83 92 101 84 122 84 C165 84 191 111 191 150 C191 201 148 216 90 235 C54 247 38 251 38 268 C38 287 60 292 92 292 C113 292 126 286 137 274 L157 224 L181 214 L147 318 Z M39 224 C61 202 115 204 145 178 C155 169 157 160 157 149 C157 127 143 116 118 116 C72 116 39 161 39 205 Z'
# Short diagonal ascender merges with the ribbon of e. The shared axis ends
# in the e bowl, eliminating the tall upright divider of the earlier mark.
h_a='M185 40 H222 L195 151 C220 120 248 102 275 102 C319 102 341 129 338 174 C336 201 327 229 315 258 L293 318 H253 L281 244 C291 217 300 193 300 174 C300 149 286 135 264 137 C229 139 193 174 181 214 L147 318 H108 L164 164 C177 129 185 83 185 40 Z'
a=[shape(e,tx=23,ty=0),shape(h_a,tx=23,ty=0)]

# A tighter counterpoint: a lower shared stem and a narrower arch. The e
# retains an open terminal, so the two letters share a junction, not a block.
e_b=assignment(BASE/'symbols/draw_symbols.py','ligature_e')
h_b='M167 54 H203 V147 C231 111 254 94 280 94 C319 94 340 125 337 167 C335 197 322 226 310 258 L290 318 H252 L278 244 C289 215 300 190 300 168 C300 141 286 126 264 130 C231 136 203 169 203 203 V318 H167 V54 Z'
b=[shape(e_b,tx=25,ty=0),shape(h_b,tx=25,ty=0)]
concepts=[('01-diagonal',a),('02-close',b)]
for slug,paths in concepts:
    for name,color in [('gold',GOLD),('ivory',IVORY),('ink',INK)]:
        (OUT/f'eh-{slug}-{name}.svg').write_text(svg(place(paths,0,-24,1,color),390,316,'ElevenHouse — компактная лигатура eh'))

numbers=assignment(BASE/'symbols/draw_symbols.py','NUMBERS')
board=[rect(0,0,1600,1050,INK),rect(0,760,1600,290,IVORY)]
for i,(_,paths) in enumerate(concepts):
    cx=400+i*800
    board += [shape(numbers['0'],GOLD,cx-22,60,.6),shape(numbers[str(i+1)],GOLD,cx-3,60,.6)]
    board += place(paths,cx-240,140,1.25,GOLD if i==0 else IVORY)
    board += place(paths,cx-39,623,.20,IVORY)
    board += place(paths,cx-98,775,.5,INK)
    board += place(paths,cx+192,915,.11,INK)
(OUT/'comparison.svg').write_text(svg(board,1600,1050,'ElevenHouse — два варианта компактной лигатуры eh'))
(OUT/'comparison.json').write_text(json.dumps(dict(width=1600,height=1050,shapes=board)))

for file in OUT.glob('*.svg'):
    root=ET.parse(file).getroot()
    assert all(el.tag.rsplit('}',1)[-1] in ('svg','title','path') for el in root.iter())
print('6 transparent SVG ligatures and comparison sheet validated: paths only.')
