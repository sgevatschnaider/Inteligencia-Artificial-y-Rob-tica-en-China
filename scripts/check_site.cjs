'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const home=read('index.html'),reader=read('lecturas/reader.js');
const docs=[
  ['politica-gobernanza','policy-governance'],
  ['empresas-modelos','companies-models'],
  ['robotica-industria','robotics-industry'],
  ['aplicaciones-etica','applications-ethics'],
  ['cronologia','timeline'],
  ['fuentes','sources']
];
assert(home.includes('id="videos"')&&home.includes('href="#videos"')&&home.includes('href="videolab/?lang=es"'),'Homepage VideoLab integration missing');
for(const pathName of ['videolab/index.html','videolab/styles.css','videolab/catalog.js','videolab/app.js']){
 assert(fs.existsSync(path.join(root,pathName)),'Missing VideoLab file: '+pathName);
}
const videoPage=read('videolab/index.html');
assert(videoPage.includes('id="video-grid"')&&videoPage.includes('id="player-modal"'),'VideoLab gallery/player markup missing');
assert(home.includes('id="presentation"'),'Missing featured presentation');
assert(home.includes('id="infraestructura"')&&home.includes('data-infraestructura-link'),'Missing third academic module');
assert(home.includes('id="simulations"'),'Missing simulations section');
assert(home.includes('id="robotlab-feature"')&&home.includes('data-robotlab-launch'),'Featured RobotLab entry missing');
for(const file of ['index.html','styles.css','model.js','app.js','i18n.js','preview.svg','home.css'])assert(fs.existsSync(path.join(root,'robotlab',file)),'Missing RobotLab file: '+file);
assert(!/Instituto\s+Confucio/i.test(read('robotlab/index.html')),'Removed affiliation remains in RobotLab');
assert(home.includes('id="reports"'),'Missing reports section');
assert.equal((home.match(/class="sim-card"/g)||[]).length,6,'Expected six simulation buttons');
assert.equal((home.match(/class="report-row"/g)||[]).length,5,'Expected five report links');
assert(!home.includes('id="resources"'),'Old mixed resources section remains');
assert(!home.includes('id="landscape"'),'Old duplicate map still present');
assert(!home.includes('github.com/sgevatschnaider/Inteligencia-Artificial-y-Rob-tica-en-China/blob/main/docs/'),'Reader links still exit to GitHub');
assert(home.includes('data-presentation-file="pdf"')&&home.includes('data-presentation-file="pptx"'),'Bilingual PDF/PPT controls missing');
assert(home.includes('language===')&&home.includes('presentation.pptx'),'Bilingual viewer files not dynamically linked');
const html=read('lecturas/index.html');
assert(html.includes('reader.js')&&html.includes('reader.css'),'Reader dependencies missing');
for(const [es,en] of docs){
  for(const [lang,slug] of [['es',es],['en',en]]){
    const md='docs/'+lang+'/'+slug+'.md';
    assert(fs.existsSync(path.join(root,md)),'Missing full article '+md);
    assert(read(md).startsWith('# '),'Empty or invalid article '+md);
    assert(reader.includes(slug),'Missing reader route '+slug);
    assert(home.includes('doc='+slug)||slug==='timeline'||slug==='cronologia'||slug==='fuentes'||slug==='sources','Topic not linked '+slug);
  }
}
for(const p of ['README.es.md','README.en.md']){
  const text=read(p);
  assert(text.includes('lecturas/index.html'),'Research reader not linked in '+p);
  assert(text.length<6500,'README has not been condensed: '+p);
}
for(const p of ['PANORAMA-2026.es.md','PANORAMA-2026.en.md'])assert(read(p).length>10000,'Original long-form analysis not preserved: '+p);
const resources=[
'Capital Robótico vs Capital Común — Efecto del Data Flywheel.html',
'Capital Robótico vs. Capital Común_Teoría.html',
'Data Flywheel (U→D→Q→U).html',
'Robot_datos_sinteticos.html',
'Simulacion_dataflywheel.html',
'Simulador Data Flywheel Componentes.html',
'Introducción robótica en China.html',
'IA_Automoviles_China.html',
'IA_Salud_China.html',
'Datos Comparativos sobre Robótica.html',
'Panorama_Industrial_2026.html'];
for(const p of resources)assert(fs.existsSync(path.join(root,'recursos',p)),'Missing interactive resource '+p);
assert(fs.existsSync(path.join(root,'materiales/transformacion-industrial/en/presentation.pdf')));
assert(fs.existsSync(path.join(root,'materiales/transformacion-industrial/en/presentation.pptx')));
console.log('Site audit passed: bilingual research reader, six simulations, five reports, complete archives and presentation links.');
