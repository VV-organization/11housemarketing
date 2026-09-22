"""Original hand-drawn Bezier lettering. No font input or text conversion."""
from pathlib import Path
from xml.etree import ElementTree as ET

OUT = Path(__file__).parent
INK, IVORY, GOLD = '#010308', '#F2F1EB', '#E2CA79'
GLYPHS = {
    'e': 'M186 244 C184 291 150 322 94 322 C33 322 -3 291 3 249 C9 208 39 147 69 110 C83 92 101 84 122 84 C165 84 191 111 191 150 C191 201 148 216 90 235 C54 247 38 251 38 268 C38 287 60 292 92 292 C128 292 149 275 151 244 Z M39 224 C61 202 115 204 145 178 C155 169 157 160 157 149 C157 127 143 116 118 116 C72 116 39 161 39 205 Z',
    'l': 'M0 0 H36 V318 H0 Z',
    'v': 'M0 88 H38 L99 278 L161 88 H199 L117 318 H80 Z',
    'n': 'M0 318 V226 C0 190 37 143 82 105 C101 89 114 84 127 84 C169 84 188 118 188 168 V318 H152 V174 C152 137 139 119 113 119 C74 119 36 157 36 204 V318 Z',
    'h': 'M0 0 H36 V153 C56 115 87 84 120 84 C165 84 187 117 187 168 V318 H151 V174 C151 137 137 119 112 119 C74 119 36 157 36 204 V318 H0 Z',
    'o': 'M101 84 C164 84 199 132 199 203 C199 275 164 322 100 322 C36 322 1 275 1 203 C1 132 37 84 101 84 Z M101 118 C59 118 38 152 38 203 C38 255 59 288 100 288 C142 288 162 255 162 203 C162 152 142 118 101 118 Z',
    'u': 'M0 88 H36 V232 C36 270 50 288 76 288 C113 288 150 246 150 199 V88 H186 V318 H151 V273 C128 305 102 322 73 322 C24 322 0 291 0 239 Z',
    's': 'M174 150 H139 C136 128 121 116 92 116 C62 116 45 128 45 147 C45 166 63 174 99 184 C145 197 181 211 181 254 C181 296 148 322 92 322 C37 322 3 295 0 250 H36 C39 277 58 290 92 290 C127 290 145 277 145 258 C145 238 126 230 88 219 C43 207 9 193 9 151 C9 110 42 84 93 84 C144 84 172 109 174 150 Z',
}
PLACEMENT = [('e',0),('l',221),('e',284),('v',493),('e',707),('n',923),('h',1180),('o',1397),('u',1627),('s',1841),('e',2046)]
WIDTH = 2237

def lettering(color, transform=''):
    paths = '\n'.join(f'<path id="letter-{i+1}-{letter}" transform="translate({x} 0)" d="{GLYPHS[letter]}"/>' for i,(letter,x) in enumerate(PLACEMENT))
    return f'<g fill="{color}" fill-rule="evenodd" transform="{transform}">{paths}</g>'

def svg(body, viewbox, title):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" role="img" aria-label="{title}">\n<title>{title}</title>\n{body}\n</svg>\n'

for name,color in [('ivory',IVORY),('gold',GOLD),('ink',INK)]:
    (OUT / f'elevenhouse-{name}.svg').write_text(svg(lettering(color), '-8 -8 2253 338', 'ElevenHouse — custom vector wordmark'), encoding='utf-8')

board = f'<rect width="1600" height="1020" fill="{INK}"/>'
board += lettering(IVORY, 'translate(100 140) scale(.626)')
board += lettering(GOLD, 'translate(100 480) scale(.626)')
board += f'<rect y="800" width="1600" height="220" fill="{IVORY}"/>'
board += lettering(INK, 'translate(100 866) scale(.28)')
board += f'<path fill="{GOLD}" d="M1400 875 H1460 V935 H1400 Z"/>'
# Repeated paths are self-contained; omit repeated IDs on the presentation board.
import re
board = re.sub(r' id="[^"]+"', '', board)
(OUT / 'preview.svg').write_text(svg(board, '0 0 1600 1020', 'ElevenHouse — ivory and gold lettering study'), encoding='utf-8')
(OUT / 'preview.html').write_text('<!doctype html><html lang="ru"><meta charset="utf-8"><title>ElevenHouse — логотип 01</title><style>html,body{margin:0;background:#010308}img{display:block;width:100%;height:auto}</style><img src="preview.svg" alt="ElevenHouse: векторный логотип, светлый и золотой варианты"></html>', encoding='utf-8')
for file in OUT.glob('*.svg'):
    root = ET.parse(file).getroot()
    assert not any(el.tag.rsplit('}',1)[-1] in ('text','image','foreignObject') for el in root.iter())
    print(f'{file.name}: valid SVG, vector paths only, {file.stat().st_size} bytes')
