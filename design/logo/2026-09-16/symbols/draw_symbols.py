"""Three original vector symbol studies; no fonts, tracing, or raster assets."""
from pathlib import Path
import ast
import json
from html import escape
from xml.etree import ElementTree as ET

OUT = Path(__file__).parent
INK, IVORY, GOLD = '#010308', '#F2F1EB', '#E2CA79'
source = ast.parse((OUT.parent / 'draw_logo.py').read_text())
glyphs = next(ast.literal_eval(n.value) for n in source.body if isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id == 'GLYPHS' for t in n.targets))

def shape(d, fill=GOLD, tx=0, ty=0, scale=1):
    return dict(d=d, fill=fill, tx=tx, ty=ty, scale=scale)

# A shared stem joins the e ribbon and the h arch. Their overlapping fills
# deliberately unite: this is a ligature, not two typeset initials.
ligature_e = 'M204 218 C201 281 158 322 94 322 C33 322 -3 291 3 249 C9 208 39 147 69 110 C83 92 101 84 122 84 C165 84 191 111 191 150 C191 201 148 216 90 235 C54 247 38 251 38 268 C38 287 60 292 92 292 C129 292 151 273 166 241 L204 218 Z M39 224 C61 202 115 204 145 178 C155 169 157 160 157 149 C157 127 143 116 118 116 C72 116 39 161 39 205 Z'
MONOGRAM = [shape(ligature_e, tx=22, ty=39), shape(glyphs['h'], tx=190, ty=39)]

# Two unmistakable numeral flags, joined by a rising bridge. No zodiac glyph.
BRIDGE = [
    shape('M78 132 L130 64 H163 V340 H125 V130 L105 156 Z'),
    shape('M212 132 L264 64 H297 V340 H259 V130 L239 156 Z'),
    shape('M158 219 C186 183 236 183 264 219 V263 C236 227 186 227 158 263 Z'),
]

# An open collecting contour surrounds two uprights: the eleven stays legible
# and the field is open to new relationships instead of becoming a closed badge.
COMMON = [
    shape('M52 126 H86 V222 C86 287 128 326 200 326 C272 326 314 287 314 222 V126 H348 V223 C348 311 288 360 200 360 C112 360 52 311 52 223 Z'),
    shape('M116 113 L154 68 H181 V254 H147 V126 L140 135 Z'),
    shape('M198 113 L236 68 H263 V254 H229 V126 L222 135 Z'),
]
CONCEPTS = [('01-eh-ligature', 'EH — связь', MONOGRAM), ('02-eleven-bridge', '11 — точка встречи', BRIDGE), ('03-common-house', '11 — общий дом', COMMON)]

def svg(shapes, width, height, title):
    paths = '\n'.join(f'<path fill="{p["fill"]}" fill-rule="evenodd" transform="translate({p["tx"]} {p["ty"]}) scale({p["scale"]})" d="{p["d"]}"/>' for p in shapes)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-label="{escape(title)}">\n<title>{escape(title)}</title>\n{paths}\n</svg>\n'

def place(symbol, x, y, scale, color):
    return [shape(p['d'], color, x+p['tx']*scale, y+p['ty']*scale, p['scale']*scale) for p in symbol]

def rect(x,y,w,h,color):
    return shape(f'M{x} {y} H{x+w} V{y+h} H{x} Z', color)

for slug,title,symbol in CONCEPTS:
    for color_name,color in [('gold',GOLD),('ivory',IVORY),('ink',INK)]:
        (OUT / f'{slug}-{color_name}.svg').write_text(svg(place(symbol,0,0,1,color),400,400,title))

NUMBERS = {
    '0':'M12 0 C20 0 24 6 24 16 C24 26 20 32 12 32 C4 32 0 26 0 16 C0 6 4 0 12 0 Z M12 4 C7 4 4 8 4 16 C4 24 7 28 12 28 C17 28 20 24 20 16 C20 8 17 4 12 4 Z',
    '1':'M3 8 L11 0 H16 V32 H12 V5 L6 11 Z',
    '2':'M0 9 C0 3 5 0 12 0 C19 0 24 3 24 9 C24 15 18 19 6 28 H24 V32 H0 V28 C16 15 20 13 20 9 C20 6 17 4 12 4 C7 4 4 6 4 9 Z',
    '3':'M0 8 C1 3 5 0 12 0 C19 0 24 3 24 9 C24 12 22 15 19 16 C23 17 25 20 25 24 C25 29 20 33 12 33 C4 33 0 30 0 24 H4 C4 27 7 29 12 29 C17 29 21 27 21 24 C21 20 18 18 12 18 H8 V14 H12 C17 14 20 12 20 9 C20 6 17 4 12 4 C7 4 4 6 4 8 Z',
}

board = [rect(0,0,1600,1060,INK), rect(0,748,1600,312,IVORY)]
for i,(_,_,symbol) in enumerate(CONCEPTS):
    center = [280,800,1320][i]
    board += [shape(NUMBERS['0'],GOLD,center-23,62,.6), shape(NUMBERS[str(i+1)],GOLD,center-3,62,.6)]
    board += place(symbol, center-180,140,.9,GOLD)
    board += place(symbol, center-28,587,.14,IVORY)
    # The inverse and the scale samples expose closed counters and joins.
    board += place(symbol, center-73,785,.365,INK)
    board += place(symbol, center-44,977,.06,INK)
    board += place(symbol, center+12,973,.08,INK)

(OUT/'comparison.svg').write_text(svg(board,1600,1060,'ElevenHouse — три направления символа'))
(OUT/'comparison.json').write_text(json.dumps(dict(width=1600,height=1060,shapes=board)))

# A second sheet shows the leading ligature both as an independent emblem
# and paired with the previously drawn wordmark.
detail = [rect(0,0,1600,1000,INK), rect(1030,0,570,1000,IVORY)]
detail += place(MONOGRAM,272,85,1.18,GOLD)
detail += place(MONOGRAM,1200,100,.56,INK)
detail += place(MONOGRAM,1219,445,.46,INK)
detail += place(MONOGRAM,1288,819,.12,INK)
detail += place(MONOGRAM,112,760,.33,IVORY)
placement = [('e',0),('l',221),('e',284),('v',493),('e',707),('n',923),('h',1180),('o',1397),('u',1627),('s',1841),('e',2046)]
detail += [shape(glyphs[l],IVORY,284+x*.282,785,.282) for l,x in placement]
(OUT/'eh-detail.svg').write_text(svg(detail,1600,1000,'ElevenHouse — монограмма EH и словесный знак'))
(OUT/'eh-detail.json').write_text(json.dumps(dict(width=1600,height=1000,shapes=detail)))

for file in OUT.glob('*.svg'):
    root = ET.parse(file).getroot()
    assert all(el.tag.rsplit('}',1)[-1] in ('svg','title','path') for el in root.iter())
print('Validated 9 standalone SVGs and 2 presentation SVGs: vector outlines only.')
