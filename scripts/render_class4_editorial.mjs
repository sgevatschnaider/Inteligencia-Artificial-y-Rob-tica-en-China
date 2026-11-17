#!/usr/bin/env node
/** Author the bilingual Class 4 decks from slides*.json with native editable objects.
 * Requires @oai/artifact-tool 2.8.158 in the authoring runtime. CI independently
 * validates the committed output and its source/content hashes; it never replaces
 * an editorial deck with the older card-grid renderer.
 */
import fs from 'node:fs/promises';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath,pathToFileURL} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES||ROOT,'package.json'));
const {Presentation,PresentationFile}=require('@oai/artifact-tool');
const C={navy:'#101D31',teal:'#148A8B',coral:'#D94F45',gold:'#D8AB45',paper:'#F7F6F1',ink:'#172436',muted:'#536675',line:'#D8E1E5',pale:'#E1F0ED',white:'#FFFFFF'};
const FONT='DejaVu Sans',W=1280,H=720;
const lineNone={style:'solid',fill:'none',width:0};
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
function box(sl,x,y,w,h,fill,line='none') {return sl.shapes.add({geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{style:'solid',fill:line,width:line==='none'?0:1}})}
function text(sl,name,value,x,y,w,h,size=26,color=C.ink,bold=false,align='left'){
 const sh=sl.shapes.add({name,geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:lineNone});
 sh.text=String(value);sh.text.style={typeface:FONT,fontSize:size,color,bold,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:0};return sh;
}
function rule(sl,x,y,w,color=C.line){box(sl,x,y,w,2,color)}
function label(sl,value,x,y,color=C.teal,w=1100){text(sl,'section',value.toUpperCase(),x,y,w,28,17,color,true)}
function photo(sl,asset,x,y,w,h,fit='cover'){
 const bytes=readFileSync(path.join(ROOT,asset.path));
 sl.images.add({blob:bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),contentType:asset.path.toLowerCase().endsWith('.png')?'image/png':'image/jpeg',alt:asset.alt,fit,position:{left:x,top:y,width:w,height:h}});
}
function chrome(sl,sd,module,lang,count){
 sl.background.fill=C.paper;
 label(sl,sd.section||`${lang==='es'?'Fronteras industriales':'Industrial frontiers'} / ${module}`,64,35);
 const titleSize=sd.title.length>63?39:45;
 text(sl,'title',sd.title,64,84,1152,118,titleSize,C.navy,true);
 text(sl,'subtitle',sd.subtitle,66,202,1145,58,24,C.muted);
 rule(sl,64,654,1152);
 text(sl,'author','Sergio Gevatschnaider',64,677,500,20,14,C.muted);
 text(sl,'page',`${lang.toUpperCase()} / ${String(sd.number).padStart(2,'0')} / ${String(count).padStart(2,'0')}`,1010,677,206,20,14,C.muted,false,'right');
}
function takeaway(sl,sd,dark=false){
 const color=dark?C.white:C.navy;
 rule(sl,64,596,1152,dark?C.teal:C.teal);
 text(sl,'takeaway',sd.takeaway,66,612,1145,36,22,color,true);
}
function column(sl,labelValue,body,x,y,w,color=C.teal){
 text(sl,'item-title',labelValue,x,y,w,66,28,color,true);
 text(sl,'item-body',body,x,y+78,w,176,24,C.ink);
}
function columns(sl,sd){
 const n=sd.items.length,w=(1152-38*(n-1))/n;
 sd.items.forEach(([a,b],i)=>{const x=64+i*(w+38);label(sl,String(i+1).padStart(2,'0'),x,284,[C.teal,C.coral,C.navy,C.navy][i%4],w);column(sl,a,b,x,329,w,[C.teal,C.coral,C.navy,C.navy][i%4]);if(i<n-1)box(sl,x+w+18,290,1,244,C.line)});
}
function rows(sl,sd){
 const gap=sd.items.length===5?58:76;
 sd.items.forEach(([a,b],i)=>{const y=276+i*gap;text(sl,'row-label',a,68,y,308,gap-8,24,[C.teal,C.coral,C.navy,C.teal,C.coral][i%5],true);text(sl,'row-description',b,400,y,806,gap-8,24,C.ink);if(i)rule(sl,64,y-14,1152)});
}
function flow(sl,sd){
 const n=sd.items.length,w=(1110-(n-1)*34)/n;
 sd.items.forEach(([a,b],i)=>{const x=76+i*(w+34);box(sl,x,300,w,80,i===n-1?C.teal:C.navy);text(sl,'flow-label',a,x+12,306,w-24,72,24,C.white,true,'center');text(sl,'flow-explanation',b,x,402,w,152,24,C.ink);if(i<n-1)sl.shapes.add({geometry:'rightArrow',position:{left:x+w+7,top:327,width:20,height:22},fill:C.coral,line:lineNone});});
}
function layers(sl,sd){
 sd.items.forEach(([a,b],i)=>{const y=274+i*75;box(sl,70,y,1140,62,i%2?C.white:C.pale);text(sl,'layer-name',a,88,y+15,290,45,25,C.teal,true);text(sl,'layer-detail',b,404,y+14,785,46,24,C.ink);});
}
function chart(sl,sd){
 const v=sd.visual,st={typeface:FONT,fontSize:24,color:C.muted};
 const config={position:{left:64,top:278,width:v.side?790:1152,height:295},categories:v.categories,
  series:v.series.map((s,i)=>({name:s.name,values:s.values,fill:[C.teal,C.coral,C.gold,C.navy][i%4]})),hasLegend:v.series.length>1,
  legend:{position:'bottom',textStyle:st},barOptions:{direction:v.direction||'column',grouping:v.stacked?'stacked':'clustered',gapWidth:110},
  xAxis:{textStyle:st,line:{style:'solid',fill:C.line,width:1},majorGridlines:{style:'solid',fill:'none',width:0}},
  yAxis:{textStyle:st,min:0,...(v.max?{max:v.max}:{}),numberFormatCode:v.format||'0',majorGridlines:{style:'solid',fill:C.line,width:1}},
  dataLabels:{showValue:!v.stacked,position:'outEnd',textStyle:{...st,bold:true}},chartFill:C.paper,plotAreaFill:C.paper,chartLine:lineNone,plotAreaLine:lineNone};
 sl.charts.add('bar',config);
 if(v.side){text(sl,'chart-stat',v.side.value,910,303,292,90,60,C.teal,true);text(sl,'chart-stat-label',v.side.label,910,413,292,142,25,C.ink)}
 text(sl,'chart-source',v.caption,66,565,1145,27,17,C.muted);
}
function circuit(sl,sd,lang){
 const x0=130,x1=1110;
 [334,467].forEach((y,i)=>{text(sl,'wire-state',i?'|0⟩':'|0⟩',70,y-24,70,60,32,C.navy);box(sl,x0,y,x1-x0,3,C.muted)});
 box(sl,270,296,78,78,C.navy);text(sl,'Hadamard','H',270,312,78,55,39,C.white,true,'center');
 sl.shapes.add({geometry:'ellipse',position:{left:560,top:323,width:24,height:24},fill:C.coral,line:lineNone});box(sl,571,335,3,133,C.coral);
 sl.shapes.add({geometry:'ellipse',position:{left:541,top:435,width:64,height:64},fill:C.paper,line:{style:'solid',fill:C.coral,width:3}});text(sl,'target','+',545,438,56,56,38,C.coral,false,'center');
 text(sl,'bell-state','(|00⟩ + |11⟩) / √2',745,365,430,80,38,C.teal,true);
 text(sl,'gate-description',lang==='es'?'Preparar / aplicar H / correlacionar con CNOT / medir':'Prepare / apply H / correlate with CNOT / measure',110,530,1080,50,25,C.ink);
}
function matrix(sl,sd){
 sd.items.forEach(([a,b],i)=>{const x=76+(i%2)*590,y=290+Math.floor(i/2)*144;box(sl,x,y,7,110,[C.teal,C.coral,C.gold,C.navy][i]);text(sl,'matrix-label',a,x+22,y,535,38,27,C.navy,true);text(sl,'matrix-description',b,x+22,y+48,525,85,24,C.ink);});
}
function timeline(sl,sd){
 const n=sd.items.length,w=1100/n;
 box(sl,90,333,1098,4,C.line);
 sd.items.forEach(([a,b],i)=>{const x=84+i*w;sl.shapes.add({geometry:'ellipse',position:{left:x+7,top:322,width:25,height:25},fill:i===n-1?C.coral:C.teal,line:lineNone});text(sl,'time',a,x,275,w-25,45,25,C.teal,true);text(sl,'milestone',b,x,380,w-30,180,24,C.ink)});
}
function casePhoto(sl,sd){
 const asset=sd.visual.asset;photo(sl,asset,64,280,640,292,'contain');
 text(sl,'photo-credit',asset.caption,64,569,640,25,15,C.muted);
 const n=sd.items.length;
 sd.items.forEach(([a,b],i)=>{const y=280+i*(290/n);text(sl,'case-label',a,750,y,450,34,24,C.teal,true);text(sl,'case-detail',b,750,y+37,450,290/n-36,22,C.ink)});
}
function cover(sl,sd,module,lang,count,asset){
 sl.background.fill=C.navy;photo(sl,asset,660,0,620,H,'cover');box(sl,654,0,6,H,C.coral);
 label(sl,`${lang==='es'?'CHINA TECNOLÓGICA / CLASE 4':'TECHNOLOGICAL CHINA / CLASS 4'}`,64,63,C.gold,550);
 const size=sd.title.length>55?48:58;
 text(sl,'title',sd.title,64,150,535,260,size,C.white,true);
 text(sl,'subtitle',sd.subtitle,66,450,528,132,27,'#C6E9E6');
 text(sl,'author','Sergio Gevatschnaider',66,648,530,28,20,C.white,true);
 text(sl,'module',`${lang==='es'?'MÓDULO':'MODULE'} ${String(module).padStart(2,'0')} / ${count} ${lang==='es'?'DIAPOSITIVAS':'SLIDES'}`,66,607,530,28,18,C.gold);
 box(sl,680,649,574,55,'#101D31/88');text(sl,'image-credit',asset.caption,694,657,548,45,15,C.white);
}
function close(sl,sd,module,lang,count){
 sl.background.fill=C.navy;
 label(sl,lang==='es'?'SÍNTESIS Y EXPERIMENTO':'SYNTHESIS AND EXPERIMENT',64,54,C.gold);
 text(sl,'title',sd.title,64,134,532,210,54,C.white,true);
 text(sl,'takeaway',sd.takeaway,66,388,526,172,29,'#C6E9E6');
 sd.items.forEach(([a,b],i)=>{const y=140+i*114;label(sl,String(i+1).padStart(2,'0'),676,y,C.gold,60);text(sl,'close-label',a,738,y,465,39,26,C.white,true);text(sl,'close-detail',b,738,y+44,465,71,23,'#C6E9E6')});
 text(sl,'author','Sergio Gevatschnaider',66,663,500,26,17,C.white);
 text(sl,'page',`${lang.toUpperCase()} / ${count}`,1080,663,130,26,17,C.white,false,'right');
}
async function main(){
 const module=Number(process.argv[2]);if(![1,2,3,4].includes(module))throw Error('Usage: node scripts/render_class4_editorial.mjs MODULE');
 const folder=path.join(ROOT,'materiales/clase-4',`ppt-${module}`),build=path.join(ROOT,'.build/editorial',`ppt-${module}`);
 await fs.mkdir(build,{recursive:true});
 const summary={module,renderer:'@oai/artifact-tool 2.8.158',renderer_sha256:hash(await fs.readFile(fileURLToPath(import.meta.url))),languages:{}};
 for(const lang of ['es','en']){
  const source=path.join(folder,lang==='es'?'slides.json':'slides.en.json'),raw=await fs.readFile(source),data=JSON.parse(raw);
  if(data.editorial_version!==2)throw Error(`Missing editorial content: ${source}`);
  const deck=Presentation.create({slideSize:{width:W,height:H}}),chartOwners=[];
  for(const sd of data.slides){
   const sl=deck.slides.add(),layout=sd.visual.layout;
   if(layout==='cover')cover(sl,sd,module,lang,data.slides.length,data.hero);
   else if(layout==='close')close(sl,sd,module,lang,data.slides.length);
   else{
    chrome(sl,sd,module,lang,data.slides.length);
    const render={columns,rows,flow,layers,chart,matrix,timeline,photo:casePhoto,circuit};
    if(!render[layout])throw Error(`Unknown layout ${layout}`);
    render[layout](sl,sd,lang);takeaway(sl,sd);
    if(layout==='chart')chartOwners.push(sd.number);
   }
   sl.speakerNotes.text=`${sd.notes}\n\n${lang==='es'?'Fuentes':'Sources'}:\n${sd.sources.join('\n')}`;
  }
  const candidate=path.join(build,`candidate-${lang}.pptx`);await(await PresentationFile.exportPptx(deck)).save(candidate);
  // The source deck is intentionally redesigned, rather than used as a master.
  const {finalizePresentation}=await import(pathToFileURL('/home/agent/.codex/skills/builtins/presentations/container_tools/artifact_tool_utils.mjs'));
  await fs.mkdir(path.join(build,'output'),{recursive:true});
  const final=path.join(build,'output',`final-${lang}-${Date.now()}.pptx`);
  await finalizePresentation({workspaceDir:ROOT,candidatePath:candidate,finalPath:final,
   explicitTotalSlideCount:data.slides.length,requiredNativeChartOwnerSlides:chartOwners,
   materializeLiteralChartWorkbooks:true,fontPolicy:{basis:'design',families:[FONT]},
   pythonExecutable:process.env.CODEX_PRIMARY_RUNTIME_PYTHON,
   integrityValidatorPath:'/home/agent/.codex/skills/builtins/presentations/container_tools/inspect_presentation_package_integrity.py',
   layoutValidatorPath:'/home/agent/.codex/skills/builtins/presentations/container_tools/inspect_presentation_layout_geometry.py',
   layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit'],
   verifyArtifactToolImport:true,receiptPath:path.join(build,`validation-${lang}-${Date.now()}.json`)});
  const output=path.join(folder,lang==='es'?'presentacion.pptx':'presentation.en.pptx');await fs.copyFile(final,output);
  summary.languages[lang]={source:path.relative(ROOT,source),source_sha256:hash(raw),pptx:path.relative(ROOT,output),pptx_sha256:hash(await fs.readFile(output)),slides:data.slides.length,notes:data.slides.length,charts:chartOwners};
 }
 await fs.writeFile(path.join(folder,'editorial-build.json'),JSON.stringify(summary,null,2)+'\n');
 console.log(JSON.stringify(summary));
}
main().catch(e=>{console.error(e.stack);process.exitCode=1});
