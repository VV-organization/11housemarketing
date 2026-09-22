from pathlib import Path
import ast, json, shutil
import xml.etree.ElementTree as ET

root=Path(__file__).resolve().parents[1]
logos=root.parents[1]/'logo/2026-09-16'
assets=root/'assets'
def assigned(file,name):
    tree=ast.parse(file.read_text())
    return next(ast.literal_eval(n.value) for n in tree.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id==name for t in n.targets))
glyphs=assigned(logos/'draw_logo.py','GLYPHS')
mono=ET.parse(logos/'monogram-v08/eh-contour-gold.svg').getroot()
glyphs['h']=list(mono)[-1].attrib['d']
top=[('e',0),('l',221),('e',284),('v',493),('e',707),('n',923)]
bottom=[('h',0),('o',220),('u',449),('s',663),('e',870)]
for name,color in [('navy','#152037'),('ivory','#F2F1EB')]:
    paths=[]
    for row,y in [(top,0),(bottom,339)]:
        for letter,x in row:
            fill='#E2CA79' if letter=='h' else color
            paths.append(f'<path fill="{fill}" fill-rule="evenodd" transform="translate({x} {y})" d="{glyphs[letter]}"/>')
    (assets/f'wordmark-{name}.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 0 1113 662">'+''.join(paths)+'</svg>')
for name,color in [('gold','#E2CA79'),('navy','#152037'),('ivory','#F2F1EB')]:
    svg=(logos/'monogram-v08/eh-contour-gold.svg').read_text().replace('#E2CA79',color)
    svg=svg.replace('viewBox="0 0 421 405"','viewBox="15 35 376 324"')
    (assets/f'monogram-{name}.svg').write_text(svg)
manifest=json.loads((root/'.build/assets.json').read_text())
manifest.append(json.loads((root/'.build/phone.json').read_text()))
for item in manifest:
    shutil.copy2(item['path'],assets/f"{item['key']}.png")
shutil.copy2('/Users/anastasiavolkova/Downloads/Frame 1.png',assets/'approved-logo-reference.png')
(assets/'image-prompts.md').write_text('# ElevenHouse — image generation prompts\n\nBuilt-in image generation. Conceptual mockups, not photographed production goods.\n\n'+ '\n\n'.join('## '+a['key']+'\n\n'+a['prompt']+'\n\nSource output: '+a['path'] for a in manifest))
print('Prepared five photographic assets, five SVG assets, source reference and prompt record.')
