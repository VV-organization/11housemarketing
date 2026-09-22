"""Rotate only e through 180 degrees; join it to the unchanged v08 h."""
from pathlib import Path
import json
import re
import hashlib
import xml.etree.ElementTree as ET

OUT=Path(__file__).parent
BASE=OUT.parent
INK,IVORY,GOLD='#010308','#F2F1EB','#E2CA79'
NS='{http://www.w3.org/2000/svg}'
source=BASE/'monogram-v08/eh-contour-gold.svg'
original_bytes=source.read_bytes()
elements=ET.fromstring(original_bytes).findall(NS+'path')
assert len(elements)==2

def shape(d,fill=GOLD,tx=0,ty=0,scale=1):
    return dict(d=d,fill=fill,tx=tx,ty=ty,scale=scale)

def place(paths,x,y,s,color):
    return [shape(p['d'],color,x+p['tx']*s,y+p['ty']*s,p['scale']*s) for p in paths]

def rect(x,y,w,h,color):
    return shape(f'M{x} {y} H{x+w} V{y+h} H{x} Z',color)

def svg(paths,w,h,title):
    body='\n'.join(f'<path fill="{p["fill"]}" fill-rule="evenodd" transform="translate({p["tx"]} {p["ty"]}) scale({p["scale"]})" d="{p["d"]}"/>' for p in paths)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-label="{title}"><title>{title}</title>\n{body}\n</svg>\n'

# 180-degree rotation about the centre of the e box: x -> 204-x,
# y -> 406-y, followed by the original (15,35) placement. No reshaping.
monogram=[shape(elements[0].attrib['d'],tx=219,ty=441,scale=-1),shape(elements[1].attrib['d'],tx=183,ty=35)]
for name,color in [('gold',GOLD),('ivory',IVORY),('ink',INK)]:
    (OUT/f'eh-rotated-e-{name}.svg').write_text(svg(place(monogram,0,0,1,color),421,405,'ElevenHouse — e перевёрнута на 180 градусов и соединена с h'))

board=[rect(0,0,1440,940,INK),rect(920,0,520,940,IVORY)]
board+=place(monogram,174,104,1.38,GOLD)
board+=place(monogram,1003,137,.87,INK)
board+=place(monogram,245,724,.35,IVORY)
board+=place(monogram,584,752,.23,GOLD)
board+=place(monogram,1050,664,.27,INK)
board+=place(monogram,1256,720,.11,INK)
(OUT/'preview.svg').write_text(svg(board,1440,940,'ElevenHouse — монограмма с перевёрнутой e'))
(OUT/'preview.json').write_text(json.dumps(dict(width=1440,height=940,shapes=board)))

for f in OUT.glob('*.svg'):
    root=ET.parse(f).getroot()
    assert all(el.tag in (NS+'svg',NS+'title',NS+'path') for el in root.iter())
assert source.read_bytes()==original_bytes
assert monogram[1]['d']==elements[1].attrib['d']
assert monogram[0]['d']==elements[0].attrib['d'] and monogram[0]['scale']==-1
print('Verified: exact 180-degree e rotation; unchanged h; 3 transparent path-only SVGs.')
