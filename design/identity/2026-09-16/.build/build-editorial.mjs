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

// Reference 16.15.32: off-centre paper imagery and generous white space.
{
 const s=slide(C.ivory,source+'Редакционная композиция: референс пользователя 16.15.32. Фото — новый концептуальный мокап.');
 text(s,'ELEVENHOUSE',64,53,630,25,16,C.navy);
 text(s,'АЙДЕНТИКА / 2026',1265,53,280,25,16,C.navy);
 await img(s,'wordmark-navy.svg',66,180,740,441,'contain');
 await img(s,'editorial-seal.png',934,157,606,608);
 text(s,'Для астрологов.\nДля тех, кто рядом.',71,675,780,115,42,C.navy);
 text(s,'ПРАКТИКА / ЛЮДИ / СВЯЗИ',69,845,780,30,16,C.navy);
 text(s,'elevenhouse.ai',1297,845,250,30,16,C.navy);
}
{
 const s=slide('#FFFFFF','Смысл 11-го дома — сообщества, единомышленники и коллективное — из справки пользователя. Продуктовая идея: https://elevenhouse.ai.');
 text(s,'СВОЙ КРУГ',64,54,500,30,17,C.navy);
 text(s,'Астролог рядом.\nПрактика в порядке.',64,204,1160,240,96,C.navy);
 text(s,'11-й дом — про связи и единомышленников.\nElevenHouse — пространство, где астролог\nобъединяет работу и отношения с клиентами.',70,554,1030,150,30,C.navy);
 await img(s,'monogram-gold.svg',1240,589,265,228,'contain');
 foot(s,2,C.navy);
}
// Reference 16.14.58: an actual outline and an enlarged detail, no invented angles.
{
 const s=slide(C.ivory,source+'Разбор формы: исходные векторные кривые, контур и увеличенный фрагмент; референс 16.14.58. Линии показывают уровень строчных букв и базовую линию, не утверждают алгоритм построения.');
 rect(s,800,0,800,900,'#E9E7E1');
 text(s,'ПЛАСТИКА ЗНАКА',64,52,620,32,18,C.navy);
 text(s,'ДЕТАЛЬ СОЕДИНЕНИЯ',852,52,680,32,18,C.navy);
 await img(s,'monogram-outline.svg',154,252,455,392,'contain');
 rect(s,80,354,635,1,'#C8C7BF');rect(s,80,637,635,1,'#C8C7BF');
 text(s,'Уровень строчных',84,320,380,25,15,'#72766F');
 text(s,'Базовая линия',84,651,380,25,15,'#72766F');
 await img(s,'monogram-detail.svg',821,129,757,690,'contain');
 text(s,'Две буквы — один непрерывный ритм.',80,779,650,50,26,C.navy);
}
// Reference 16.14.51: app signature next to a material application.
{
 const s=slide('#FFFFFF',source+'Референс 16.14.51: контраст цифровой и физической поверхности. Носители — концепты для сообщества астрологов.');
 text(s,'ЗНАК В СИСТЕМЕ',64,54,620,30,17,C.navy);
 rect(s,64,142,588,478,C.navy);
 s.shapes.add({geometry:'roundRect',borderRadius:50,position:{left:240,top:249,width:236,height:236},fill:C.ivory,line:{fill:'none',width:0}});
 await img(s,'monogram-navy.svg',279,292,158,136,'contain');
 text(s,'Иконка приложения',66,649,640,45,25,C.navy);
 const colors=[C.navy,C.ivory,C.gold];
 for(let i=0;i<3;i++){rect(s,64+i*199,741,184,63,colors[i]);text(s,colors[i],64+i*199,820,180,28,16,C.navy);}
 await img(s,'editorial-sign.png',757,141,779,646);
 text(s,'Пространство сообщества',760,816,775,40,25,C.navy);
}
// Reference 16.15.26: unboxing becomes a professional consultation kit.
{
 const s=slide(C.ivory,source+generated+'Новый мокап: набор астролога — папка, натальная карта, ежедневник. Референс 16.15.26 используется для масштаба и взаимодействия рук с предметом.');
 await img(s,'editorial-unboxing.png');
}
// Reference 16.15.32: an asymmetric collage of detail, not an equal card grid.
{
 const s=slide('#FFFFFF',source+generated+'Свободный коллаж фактур: референс 16.15.32; материалы консультации, печать и ежедневник.');
 text(s,'В деталях.',65,57,725,90,70,C.navy);
 await img(s,'editorial-seal.png',74,235,830,564);
 await img(s,'journal.png',962,83,574,373);
 await img(s,'stationery.png',866,479,670,376);
 text(s,'БУМАГА / КАЛЬКА / ТИСНЕНИЕ',77,835,760,30,15,C.navy);
}
// Reference 16.15.43: wearable + native UI fragment, astrology-specific content.
{
 const s=slide(C.navy,source+generated+'Референс 16.15.43: предметный кадр часов рядом с интерфейсными деталями. Экран часов и интерфейсные карточки — концепция применения айдентики, не заявление о текущем функционале продукта.');
 await img(s,'editorial-watch.png',0,0,800,900);
 text(s,'РИТМ ПРАКТИКИ',865,59,650,30,17,C.gold);
 const box=(x,y,w,h)=>s.shapes.add({geometry:'roundRect',borderRadius:30,position:{left:x,top:y,width:w,height:h},fill:C.ivory,line:{fill:'none',width:0}});
 box(862,188,676,120);
 text(s,'14:30',899,216,185,75,47,C.navy);
 text(s,'Консультация\nНатальная карта',1100,218,385,67,24,C.navy);
 box(862,362,676,318);
 text(s,'ПОДГОТОВКА К ВСТРЕЧЕ',899,396,570,29,15,C.navy);
 rect(s,902,476,194,4,C.navy);rect(s,1110,476,194,4,C.navy);rect(s,1318,476,180,4,C.gold);
 text(s,'Запись',899,506,195,40,24,C.navy);
 text(s,'Карта',1110,506,194,40,24,C.navy);
 text(s,'Встреча',1318,506,195,40,24,C.navy);
 text(s,'Всё готово к разговору.',899,590,580,45,30,C.navy);
 text(s,'Забота начинается\nдо консультации.',865,745,655,102,42,C.ivory);
 text(s,'КОНЦЕПЦИЯ ИНТЕРФЕЙСА',866,868,650,22,12,C.muted);
}
{
 const s=slide(C.ivory,'Продуктовая идея единого кабинета: https://elevenhouse.ai. Изображение рабочего места — концептуальный мокап по реальному интерфейсу календаря, с обобщёнными данными.');
 text(s,'ПРОДУКТ',64,53,600,30,17,C.navy);
 text(s,'Вся практика.\nОдин кабинет.',64,197,565,180,61,C.navy);
 text(s,'Клиенты, консультации,\nматериалы и расписание —\nв одном пространстве.',69,441,545,124,28,C.navy);
 await img(s,'monogram-navy.svg',73,658,122,105,'contain');
 await img(s,'workspace.png',662,141,874,617);
 text(s,'Больше времени на людей.',665,793,850,54,34,C.navy);
}
// Reference 16.15.47: physical presence, adapted as astrologers' community space.
{
 const s=slide('#FFFFFF',source+generated+'Референс 16.15.47: небольшая перпендикулярная вывеска в реальной городской среде. Здесь — концепт входа в пространство астрологов, не существующий адрес.');
 text(s,'СВОЙ ДОМ',58,60,340,30,16,C.navy);
 text(s,'Место\nдля своих.',56,289,345,155,58,C.navy);
 text(s,'Встречи.\nКонсультации.\nСообщество.',60,532,320,130,27,C.navy);
 await img(s,'monogram-gold.svg',62,724,95,82,'contain');
 await img(s,'editorial-sign.png',421,0,1179,900);
}
{
 const s=slide(C.navy,source+'Завершающий кадр в фирменной палитре. Айдентика сохраняет пользовательский логотип; меняются способы применения и презентационная композиция.');
 text(s,'ЛЮДИ / СВЯЗИ / ПРАКТИКА',64,55,1090,30,18,C.gold);
 await img(s,'wordmark-ivory.svg',84,183,956,569,'contain');
 await img(s,'monogram-gold.svg',1238,557,266,229,'contain');
 text(s,'elevenhouse.ai',87,834,810,39,25,C.ivory);
 text(s,'АЙДЕНТИКА / 2026',1300,848,270,28,15,C.ivory);
}
await fs.mkdir(path.join(root,'.codex-finalizer'),{recursive:true});
await fs.mkdir(path.join(root,'.build/editorial-renders'),{recursive:true});
const candidate=path.join(root,'.codex-finalizer/editorial-candidate.pptx');
await(await PresentationFile.exportPptx(p)).save(candidate);
console.log('Exported candidate',candidate);
for(let i=0;i<slides.length;i++){
 const blob=await p.export({slide:slides[i],format:'png',scale:1});
 await fs.writeFile(path.join(root,'.build/editorial-renders',`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await blob.arrayBuffer()));
 console.log('Rendered',i+1);
}
const finalPath=path.join(out,'ElevenHouse-Editorial-Identity.pptx');
const result=await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath,pythonExecutable:python,integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit'],requiredNativeTableOwnerSlides:[],requiredNativeChartOwnerSlides:[],fontPolicy:{basis:'design',families:[FONT]},verifyArtifactToolImport:true,receiptPath:path.join(root,'.codex-finalizer/editorial-validation.json')});
console.log('FINAL',JSON.stringify(result));
