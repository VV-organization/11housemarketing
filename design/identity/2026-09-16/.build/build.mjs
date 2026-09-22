import fs from 'node:fs/promises';
import path from 'node:path';
import { Presentation, PresentationFile } from '@oai/artifact-tool';
import { finalizePresentation } from '/Users/anastasiavolkova/.codex/plugins/cache/openai-primary-runtime/presentations/26.905.11957/skills/presentations/container_tools/artifact_tool_utils.mjs';
const root=path.resolve(import.meta.dirname,'..');
process.env.RUNTIME_NODE_MODULES='/Users/anastasiavolkova/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const assets=path.join(root,'assets'), out=path.join(root,'output');
const skill='/Users/anastasiavolkova/.codex/plugins/cache/openai-primary-runtime/presentations/26.905.11957/skills/presentations';
const python='/Users/anastasiavolkova/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3';
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={navy:'#152037',ink:'#010308',ivory:'#F2F1EB',gold:'#E2CA79',muted:'#ABB0BA'};
const FONT='Arial', slides=[];
function slide(bg,notes){const s=p.slides.add();s.background.fill=bg;s.speakerNotes.textFrame.setText(notes);slides.push(s);return s;}
function text(s,str,x,y,w,h,size=28,color=C.ivory,bold=false){
 const t=s.shapes.add({geometry:'textbox',name:str.slice(0,35),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 t.text=str;t.text.style={typeface:FONT,fontSize:size,color,bold,autoFit:'none',wrap:'word',verticalAlignment:'top',insets:{left:0,right:0,top:0,bottom:0}};return t;
}
function rect(s,x,y,w,h,color){return s.shapes.add({geometry:'rect',position:{left:x,top:y,width:w,height:h},fill:color,line:{fill:'none',width:0}});}
async function img(s,file,x=0,y=0,w=1600,h=900,fit='cover'){
 return s.images.add({blob:new Uint8Array(await fs.readFile(path.join(assets,file))),contentType:file.endsWith('.svg')?'image/svg+xml':'image/png',alt:file,fit,position:{left:x,top:y,width:w,height:h}});
}
function foot(s,num,color=C.muted){text(s,'ELEVENHOUSE  /  АЙДЕНТИКА',64,846,780,25,15,color);text(s,String(num).padStart(2,'0'),1494,846,50,25,15,color);}
function eyebrow(s,str,color=C.ivory){text(s,str,64,52,1350,30,18,color);}
const source='Логотип: предоставленный пользователем Frame 1.png; векторная геометрия из существующих исходников design/logo/2026-09-16. Цвета: navy #152037, gold #E2CA79, ivory #F2F1EB. ';
const generated='Фотореалистичный концептуальный мокап, создан встроенным image generation, не фотография изготовленной продукции. Промпт и исходник: assets/image-prompts.md. ';
{
 const s=slide(C.ink,source+generated+'Космическая композиция связана с пространством, глубиной и орбитой лендинга ElevenHouse. https://elevenhouse.ai');
 await img(s,'cosmic.png');eyebrow(s,'ПРОСТРАНСТВО ДЛЯ ПРАКТИКИ',C.gold);
 await img(s,'wordmark-ivory.svg',80,208,750,446,'contain');
 text(s,'Люди. Связи. Своя орбита.',86,711,850,50,31,C.ivory);
 text(s,'КОНЦЕПЦИЯ АЙДЕНТИКИ  /  2026',64,847,850,26,15,C.muted);
 text(s,'elevenhouse.ai',1304,847,230,26,16,C.ivory);
}
{
 const s=slide(C.ivory,'Смысл 11-го дома — сообщества, единомышленники и коллективное — из тематической справки пользователя. Продуктовая идея единого кабинета: https://elevenhouse.ai. Слоганы являются предложением для айдентики.');
 eyebrow(s,'ОДИННАДЦАТЫЙ ДОМ',C.navy);
 text(s,'11',52,169,555,444,410,C.navy);
 text(s,'Свой круг.',680,188,810,128,96,C.navy);
 text(s,'Своя практика.',680,295,860,128,96,C.navy);
 text(s,'В астрологии 11-й дом — это сообщества,\nединомышленники и общее будущее.',687,476,800,105,31,C.navy);
 text(s,'ElevenHouse объединяет работу астролога\nв одном пространстве — чтобы больше\nвремени оставалось на людей.',687,617,805,145,31,C.navy);
 text(s,'ДОМ СВЯЗЕЙ И ВОЗМОЖНОСТЕЙ',65,738,575,30,17,C.navy);
 foot(s,2,C.navy);
}
{
 const s=slide('#FFFFFF',source+'Непосредственно показан исходный файл пользователя, без перерисовки.');
 eyebrow(s,'ПОДПИСЬ БРЕНДА',C.navy);
 await img(s,'approved-logo-reference.png',42,138,1516,590,'contain');
 text(s,'Монограмма',123,750,500,38,25,C.navy);
 text(s,'Основной логотип',692,750,680,38,25,C.navy);
 foot(s,3,C.navy);
}
{
 const s=slide(C.navy,source+'Ночной синий как основа, молочный для воздуха, матовое золото как акцент.');
 rect(s,800,0,800,490,C.ivory);rect(s,800,490,800,410,C.gold);
 text(s,'ЦВЕТ И ХАРАКТЕР',64,52,650,30,18,C.ivory);
 await img(s,'monogram-gold.svg',170,231,460,396,'contain');
 await img(s,'monogram-navy.svg',1090,96,220,190,'contain');
 await img(s,'monogram-navy.svg',1120,554,160,138,'contain');
 text(s,'Ночной синий',64,732,650,55,38,C.ivory);text(s,'#152037',65,801,630,40,24,C.muted);
 text(s,'Молочный',850,368,430,45,32,C.navy);text(s,'#F2F1EB',1355,378,200,35,21,C.navy);
 text(s,'Матовое золото',850,780,500,50,32,C.navy);text(s,'#E2CA79',1355,791,210,35,21,C.navy);
}
{
 const s=slide(C.ivory,source+generated+'Применение: папка консультации, визитная карточка, астрологическая карта на кальке.');
 await img(s,'stationery.png',0,0,1600,790);
 text(s,'От первого знакомства — к доверию.',64,819,1170,60,38,C.navy);
 text(s,'ПОЛИГРАФИЯ',1360,838,210,25,14,C.navy);
}
{
 const s=slide(C.ink,source+generated+'Применение: ежедневник астролога, тканевый переплёт, золотое тиснение и блинтовая орбитальная линия.');
 await img(s,'journal.png',0,0,1600,790);
 text(s,'Знак, который хочется почувствовать.',64,819,1210,60,38,C.ivory);
 text(s,'ТКАНЬ / ТИСНЕНИЕ',1315,838,270,25,14,C.gold);
}
{
 const s=slide(C.ivory,source+generated+'Концептуальный экран запуска с монограммой, не заявленная новая функциональность приложения.');
 await img(s,'phone.png',0,0,1600,790);
 text(s,'Один знак. Любой масштаб.',64,819,1170,60,38,C.navy);
 text(s,'ЦИФРОВАЯ СРЕДА',1330,838,240,25,14,C.navy);
}
{
 const s=slide(C.navy,source+generated+'Интерфейс в мокапе интерпретирован по реальному скриншоту календаря public/assets/product-screenshots/eh-p01-calendar.png. Обобщённые данные, не точная демонстрация функциональности. https://elevenhouse.ai');
 await img(s,'workspace.png',0,0,1600,790);
 text(s,'Вся практика — в одном пространстве.',64,819,1210,60,38,C.ivory);
 text(s,'РАБОЧИЙ ДЕНЬ',1352,838,240,25,14,C.gold);
}
{
 const s=slide(C.ivory,source+generated+'Концепция носителей для встречи сообщества астрологов. Не анонс существующего события.');
 await img(s,'event.png',0,0,1600,790);
 text(s,'Место встречи единомышленников.',64,819,1170,60,38,C.navy);
 text(s,'СООБЩЕСТВО',1360,838,230,25,14,C.navy);
}
{
 const s=slide(C.ink,source+generated+'Финальный брендовый кадр. Предложение коммуникации: Больше времени на людей.');
 await img(s,'cosmic.png');eyebrow(s,'ELEVENHOUSE',C.gold);
 await img(s,'monogram-gold.svg',92,184,280,242,'contain');
 text(s,'Больше времени',82,490,1300,125,96,C.ivory);
 text(s,'на людей.',82,599,1120,126,96,C.ivory);
 text(s,'elevenhouse.ai',86,762,900,50,29,C.gold);
 text(s,'КОНЦЕПЦИЯ АЙДЕНТИКИ / 2026',1150,851,410,25,13,C.muted);
}
await fs.mkdir(path.join(root,'.codex-finalizer'),{recursive:true});
await fs.mkdir(path.join(root,'.build/renders'),{recursive:true});
const candidate=path.join(root,'.codex-finalizer/candidate.pptx');
await(await PresentationFile.exportPptx(p)).save(candidate);
console.log('Exported candidate',candidate);
for(let i=0;i<slides.length;i++){
 const blob=await p.export({slide:slides[i],format:'png',scale:1});
 await fs.writeFile(path.join(root,'.build/renders',`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await blob.arrayBuffer()));
 console.log('Rendered',i+1);
}
const finalPath=path.join(out,'ElevenHouse-Brand-Presentation.pptx');
const result=await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath,pythonExecutable:python,integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit'],requiredNativeTableOwnerSlides:[],requiredNativeChartOwnerSlides:[],fontPolicy:{basis:'design',families:[FONT]},verifyArtifactToolImport:true,receiptPath:path.join(root,'.codex-finalizer/validation-final.json')});
console.log('FINAL',JSON.stringify(result));
