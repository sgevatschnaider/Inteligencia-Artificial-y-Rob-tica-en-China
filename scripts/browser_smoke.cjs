#!/usr/bin/env node
'use strict';
// Chromium end-to-end smoke test. In addition to link checks, verify that
// every interactive application visibly renders and reacts to user input.
// Block third-party CDNs to test the local chart fallbacks.
const http=require('node:http'), fs=require('node:fs'), path=require('node:path'), assert=require('node:assert/strict');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..'),port=51377;
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json','.md':'text/markdown'};
const server=http.createServer((req,res)=>{
  let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return;}
  let target=path.resolve(ROOT,'.'+pathname);
  if(target!==ROOT&&!target.startsWith(ROOT+path.sep)){res.writeHead(403).end();return;}
  if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  if(!fs.existsSync(target)){res.writeHead(404).end('not found '+pathname);return;}
  res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(target).pipe(res);
});
async function run(){
await new Promise(resolve=>server.listen(port,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:1366,height:768}});
await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
const sims=[
'Capital Robótico vs Capital Común — Efecto del Data Flywheel.html',
'Capital Robótico vs. Capital Común_Teoría.html',
'Data Flywheel (U→D→Q→U).html',
'Robot_datos_sinteticos.html',
'Simulacion_dataflywheel.html',
'Simulador Data Flywheel Componentes.html'
];
const inspectCanvas=async(page,id)=>page.locator('#'+id).evaluate(el=>{
const ctx=el.getContext('2d');if(!ctx)return false;const image=ctx.getImageData(0,0,el.width,el.height);
let points=0,colors=new Set();
for(let y=0;y<el.height;y+=13)for(let x=0;x<el.width;x+=13){
  const n=(y*el.width+x)*4,p=image.data;
  if(p[n+3]!==0){points++;colors.add([p[n]>>5,p[n+1]>>5,p[n+2]>>5].join(':'));}
}
return points>10&&colors.size>=3;
});
try{
 for(let i=0;i<sims.length;i++){
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const url='http://127.0.0.1:'+port+'/recursos/'+encodeURIComponent(sims[i]);
  const response=await page.goto(url,{waitUntil:'domcontentloaded'});
  assert.equal(response.status(),200,'HTML missing '+sims[i]);
  await page.waitForTimeout(350);
  assert(await page.locator('h1').first().isVisible(),'No visible main heading in '+sims[i]);
  assert.equal(await page.locator('.resource-toolbar').count(),1,'Missing in-flow navigation in '+sims[i]);
  const nav=await page.locator('.resource-toolbar').boundingBox();
  assert(nav&&nav.y<120,'Navigation should be in flow, not covering the bottom right');
  if(i===0){
   assert(await page.locator('#theta0').innerText()!=='—','Robotic capital KPI not initialized');
   assert(await inspectCanvas(page,'chart'),'Robotic capital production canvas blank');
   assert(await inspectCanvas(page,'thetaChart'),'Robotic capital learning canvas blank');
   const sidebar=await page.locator('.grid > aside').boundingBox(),results=await page.locator('.result-column').boundingBox();
   assert(results.x>sidebar.x+sidebar.width-4&&Math.abs(results.y-sidebar.y)<20,'RESULTS DISPLACED FROM RIGHT COLUMN');
   const before=await page.locator('#gain_tot').innerText();
   await page.locator('#A').evaluate(el=>{el.value='1.50';el.dispatchEvent(new Event('input',{bubbles:true}));});
   assert.notEqual(await page.locator('#gain_tot').innerText(),before,'Robotic capital parameters do not update outputs');
   await page.locator('#preset').click();await page.locator('#reset').click();
  }
  if(i===2){
   for(const id of ['chartQ','chartU','chartD','chartT'])assert(await inspectCanvas(page,id),'Comparison offline canvas blank: '+id);
   assert(!(await page.locator('#play').isDisabled()),'Comparison play disabled without CDN');
   await page.locator('#play').click();await page.waitForTimeout(700);
   const q=await page.locator('#kpi_qCN').innerText();
   assert(q&&q!=='—'&&q!=='0.200','Comparison animation did not advance Q');
   await page.locator('#pause').click();
  }
  if(i===3){
   assert.equal(await page.locator('#kpis .kpi-card').count(),8,'Synthetic-data KPIs empty without CDN');
   for(const id of ['chartQ','chartU','chartD','chartMix','chartDeltaEff','chartDataEff'])assert(await inspectCanvas(page,id),'Synthetic-data fallback canvas blank: '+id);
   const before=await page.locator('#kpis').innerText();
   await page.locator('#months').evaluate(el=>{el.value='12';el.dispatchEvent(new Event('input',{bubbles:true}));});
   assert.notEqual(await page.locator('#kpis').innerText(),before,'Synthetic-data slider does not update KPIs');
  }
  if(i===4){
   await page.getByRole('button',{name:'Acelerar'}).click();
   assert(await page.locator('#flywheel').evaluate(el=>el.classList.contains('fast')),'Animation accelerate fails');
   await page.getByRole('button',{name:'Reiniciar'}).click();
   assert(!(await page.locator('#flywheel').evaluate(el=>el.classList.contains('fast'))),'Animation reset fails');
  }
  if(errors.length)throw Error('JavaScript errors in '+sims[i]+': '+errors.join(' | '));
  console.log('PASS '+(i+1)+'/6: '+sims[i]);
  await page.close();
 }
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+port+'/',{waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('.sim-card').count(),6,'Homepage does not expose six simulation cards');
 assert.equal(await page.locator('.report-row').count(),5,'Homepage does not expose five reports');
 assert.equal(await page.locator('#videos .videolab-card').count(),4,'Homepage video previews missing');
 for(const lang of ['es','en']){
  await page.locator('#lang-'+lang).click();
  await page.locator('[data-home-video]').first().click();
  assert.equal(await page.locator('#home-video-player[open]').count(),1,'Homepage video player did not open');
  assert((await page.locator('#home-video-title').innerText()).includes(lang==='es'?'fabrican':'building'),'Homepage player title not translated');
  assert((await page.locator('#home-video-source').getAttribute('href')).includes('watch?v=ub2gWviKZpk'),'Original video link missing');
  await page.keyboard.press('Escape');
  await page.locator('#home-video-screen iframe').waitFor({state:'detached'});
  assert.equal(await page.locator('#home-video-screen iframe').count(),0,'Homepage player did not stop on close');
 }
 await page.setViewportSize({width:390,height:844});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2),'Homepage overflows on mobile');
 await page.setViewportSize({width:1366,height:768});
 await page.goto('http://127.0.0.1:'+port+'/lecturas/index.html?lang=en&doc=companies-models',{waitUntil:'domcontentloaded'});
 await page.waitForSelector('.prose table');
 assert((await page.locator('.prose').innerText()).includes('DeepSeek'),'Research reader did not render full English content');
 if(errors.length)throw Error('Browser errors in homepage or research reader: '+errors.join(' | '));
 await page.close();
 console.log('PASS home: 6 simulations, 5 reports and English research reader.');
 // VideoLab regression: gallery, bilingual labels, filters, click-to-load playback and mobile layout.
 const videoPage=await context.newPage(),videoErrors=[];
 videoPage.on('pageerror',e=>videoErrors.push(e.message));
 const videoResponse=await videoPage.goto('http://127.0.0.1:'+port+'/videolab/',{waitUntil:'domcontentloaded'});
 assert.equal(videoResponse.status(),200,'VideoLab route missing');
 assert.equal(await videoPage.locator('.video-card').count(),11,'VideoLab should show 11 curated resources');
 for(const [classNo,count] of [['1',3],['2',3],['3',2],['4',3]]){
  await videoPage.locator('[data-lesson="'+classNo+'"]').click();
  assert.equal(await videoPage.locator('.video-card').count(),count,'Wrong video count for lesson '+classNo);
 }
 await videoPage.locator('[data-lesson="all"]').click();
 await videoPage.locator('#search').fill('robotaxi');
 assert(await videoPage.locator('.video-card').count()>=1,'VideoLab search is not functional');
 await videoPage.locator('#search').fill('');
 await videoPage.locator('#set-en').click();
 assert.equal(await videoPage.locator('html').getAttribute('lang'),'en','English language not applied');
 assert.equal(await videoPage.locator('#set-en').getAttribute('aria-pressed'),'true');
 await videoPage.locator('#set-es').click();
 await videoPage.locator('.video-card').first().locator('.learn-toggle').click();
 assert.equal(await videoPage.locator('.video-card').first().locator('.pedagogy').isVisible(),true,'Teaching guide did not expand');
 await videoPage.locator('.video-card').first().locator('.watch').click();
 assert.equal(await videoPage.locator('#player-modal[open]').count(),1,'Click-to-load player did not open');
 assert((await videoPage.locator('#player-area iframe').getAttribute('src')).includes('youtube-nocookie.com/embed/'),'Wrong video embed');
 await videoPage.locator('#close-modal').click();
 assert.equal(await videoPage.locator('#player-area iframe').count(),0,'Player should unload on close');
 const external=videoPage.locator('#small-manufacturers a.watch');
 assert.equal(await external.getAttribute('target'),'_blank','External video must open in a new tab');
 await videoPage.setViewportSize({width:390,height:844});
 assert(await videoPage.locator('h1').isVisible(),'Mobile hero missing');
 assert(await videoPage.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2),'Mobile layout overflows horizontally');
 if(videoErrors.length)throw Error('VideoLab JS errors: '+videoErrors.join(' | '));
 await videoPage.close();
 console.log('PASS VideoLab: 11 videos, four filters, search, ES/EN, evidence guide, modal and responsive layout.');
}finally{await context.close();await browser.close();await new Promise(resolve=>server.close(resolve));}
}
run().catch(e=>{console.error('BROWSER SMOKE FAILED:',e.stack||e);server.close();process.exitCode=1;});
