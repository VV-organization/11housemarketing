"""Local lower-right contour change to the abbreviated eh mark only."""
from pathlib import Path
import json
import re
import hashlib
import xml.etree.ElementTree as ET

OUT = Path(__file__).parent
BASE = OUT.parent
INK, IVORY, GOLD = '#010308', '#F2F1EB', '#E2CA79'
NS = '{http://www.w3.org/2000/svg}'

def load_svg(path):
    root = ET.parse(path).getroot()
    result = []
    for p in root.findall(NS+'path'):
        x,y,s = map(float,re.fullmatch(r'translate\(([-\d.]+) ([-\d.]+)\) scale\(([-\d.]+)\)',p.attrib['transform']).groups())
        result.append(dict(d=p.attrib['d'],fill=p.attrib['fill'],tx=x,ty=y,scale=s))
    return result

def place(paths,x,y,s,color):
    return [dict(d=p['d'],fill=color,tx=x+p['tx']*s,ty=y+p['ty']*s,scale=p['scale']*s) for p in paths]

def rect(x,y,w,h,color):
    return dict(d=f'M{x} {y} H{x+w} V{y+h} H{x} Z',fill=color,tx=0,ty=0,scale=1)

def svg(paths,w,h,title):
    body='\n'.join(f'<path fill="{p["fill"]}" fill-rule="evenodd" transform="translate({p["tx"]} {p["ty"]}) scale({p["scale"]})" d="{p["d"]}"/>' for p in paths)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-label="{title}"><title>{title}</title>\n{body}\n</svg>\n'

wordmark_files=list((BASE/'stacked-v04').glob('eleven-house-stacked-*.svg'))
before={p:hashlib.sha256(p.read_bytes()).hexdigest() for p in wordmark_files}
wordmark=load_svg(BASE/'stacked-v04/eleven-house-stacked-ivory.svg')
monogram=load_svg(BASE/'stacked-v03/eh-unified-ivory.svg')
original_h=monogram[1]['d']
# The shoulder and ascender remain identical. The lower-right stroke moves
# inward along a diagonal, retaining a flat terminal and no swash.
old_segment='C169 84 188 118 188 168 V318 H152 V174'
new_segment='C169 84 188 118 188 168 V196 C188 215 183 236 176 254 L153 318 H115 L141 247 C148 226 152 209 152 192 V174'
assert original_h.count(old_segment)==1
monogram[1]['d']=original_h.replace(old_segment,new_segment)

for name,color in [('ivory',IVORY),('gold',GOLD),('ink',INK)]:
    (OUT/f'eh-diagonal-{name}.svg').write_text(svg(place(monogram,0,0,1,color),421,405,'ElevenHouse — eh со скосом нижней правой части h'))

board=[rect(0,0,1500,1000,INK),rect(980,0,520,1000,IVORY)]
board+=place(monogram,220,65,1.28,GOLD)
board+=place(monogram,1070,90,.80,INK)
board+=place(monogram,1100,532,.20,INK)
board+=place(monogram,1260,567,.10,INK)
board+=place(wordmark,100,683,.32,IVORY)
board+=place(monogram,680,768,.32,IVORY)
(OUT/'preview.svg').write_text(svg(board,1500,1000,'ElevenHouse — изменена только h в монограмме eh'))
(OUT/'preview.json').write_text(json.dumps(dict(width=1500,height=1000,shapes=board)))

for path in OUT.glob('*.svg'):
    root=ET.parse(path).getroot()
    assert all(el.tag in (NS+'svg',NS+'title',NS+'path') for el in root.iter())
assert all(hashlib.sha256(p.read_bytes()).hexdigest()==digest for p,digest in before.items())
assert monogram[0]==load_svg(BASE/'stacked-v03/eh-unified-ivory.svg')[0]
print('Verified: 3 transparent SVGs; only the monogram h changed; full wordmark and e unchanged.')
