'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html;charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.pdf':'application/pdf','.pptx':'application/vnd.openxmlformats-officedocument.presentationml.presentation'};
const server=http.createServer((req,res)=>{let p=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(p!==root&&!p.startsWith(root+path.sep))return res.writeHead(403).end();if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');if(!fs.existsSync(p))return res.writeHead(404).end();res.writeHead(200,{'Content-Type':types[path.extname(p)]||'application/octet-stream'});fs.createReadStream(p).pipe(res);});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
let browser;try{try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});}catch{browser=await chromium.launch({headless:true,args:['--no-sandbox']});}
const errors=[];
for(const viewport of [{width:1440,height:1000},{width:768,height:1024},{width:390,height:844}]){
 const page=await browser.newPage({viewport});page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/materiales/dragon/?lang=es#1');await page.waitForSelector('[data-page="10"]');
 if(process.env.DRAGON_SCREENSHOT_DIR){fs.mkdirSync(process.env.DRAGON_SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.DRAGON_SCREENSHOT_DIR,'cover-'+viewport.width+'.png'),fullPage:true});}
 assert.equal(await page.locator('[data-page]').count(),10);assert.equal(await page.locator('#slide-image').evaluate(im=>im.complete&&im.naturalWidth>0),true);
 assert(await page.locator('#previous').isDisabled());await page.locator('#next').click();assert.equal(await page.locator('#page').inputValue(),'2');
 await page.locator('#page').fill('999');await page.locator('#page').dispatchEvent('change');assert.equal(await page.locator('#page').inputValue(),'10');assert(await page.locator('#next').isDisabled());
 await page.locator('#stage').focus();await page.keyboard.press('Home');assert.equal(await page.locator('#page').inputValue(),'1');await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#page').inputValue(),'2');
 await page.locator('#stage').focus();await page.keyboard.press('f');assert(await page.evaluate(()=>!!document.fullscreenElement));await page.locator('#fullscreen').click();await page.waitForFunction(()=>!document.fullscreenElement);await page.locator('#next').focus();await page.keyboard.press('f');await page.waitForFunction(()=>!!document.fullscreenElement);await page.keyboard.press('f');await page.waitForFunction(()=>!document.fullscreenElement);
 await page.locator('#search').fill('financiamiento');assert(await page.locator('[data-page]').count()>0);await page.locator('#search').fill('zzzzsincoincidencias');await page.waitForFunction(()=>document.querySelectorAll('[data-page]').length===0,{},{timeout:5000}).catch(async error=>{console.error('Search diagnostics',await page.locator('#search').inputValue(),await page.locator('#search-status').innerText(),errors);throw error;});assert.equal(await page.locator('[data-page]').count(),0);await page.locator('#search').fill('');
 await page.locator('[data-page="8"]').click();await page.locator('#show-sources').click();assert.equal(await page.locator('#source-links a').count(),5);assert((await page.locator('#speaker-notes').innerText()).includes('artículo 2'));
 await page.locator('#tab-sources').focus();await page.keyboard.press('ArrowLeft');assert(await page.locator('#pdf-panel').isVisible());assert((await page.locator('object').getAttribute('data')).includes('#page=8'));
 await page.locator('#tab-slides').click();await page.locator('#switch-en').click();await page.waitForSelector('[data-page="10"]');assert.equal(await page.locator('html').getAttribute('lang'),'en');assert((await page.locator('.deck-notice').innerText()).includes('in Spanish'));
 assert.equal(await page.locator('#page').inputValue(),'8');
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal overflow at '+viewport.width);
 if(process.env.DRAGON_SCREENSHOT_DIR){fs.mkdirSync(process.env.DRAGON_SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.DRAGON_SCREENSHOT_DIR,'viewer-'+viewport.width+'.png'),fullPage:true});}
 await page.close();
}
const deep=await browser.newPage();await deep.goto(base+'/materiales/dragon/?view=sources#8');await deep.waitForSelector('#source-links a');assert(await deep.locator('#sources-panel').isVisible());assert.equal(await deep.locator('#page').inputValue(),'8');await deep.close();
const request=await browser.newContext();
for(let n=1;n<=10;n++){const r=await request.request.get(base+'/materiales/dragon/slides/slide-'+String(n).padStart(2,'0')+'.webp');assert(r.ok());assert((await r.body()).length>1000);}
for(const f of ['presentacion.pdf','presentacion.pptx','fuentes.html'])assert((await request.request.get(base+'/materiales/dragon/'+f)).ok());
const page=await browser.newPage({viewport:{width:1366,height:1000}});await page.goto(base);await page.locator('#lang-en').click();assert((await page.locator('[data-dragon-link]').first().getAttribute('href')).includes('lang=en'));assert((await page.locator('[data-presentation-link]').first().getAttribute('href')).includes('/en/'));
if(process.env.DRAGON_SCREENSHOT_DIR)await page.locator('#dragon').screenshot({path:path.join(process.env.DRAGON_SCREENSHOT_DIR,'home-dragon.png')});
const order=await page.evaluate(()=>['intro-video','dragon','transformacion-industrial'].map(id=>document.getElementById(id).getBoundingClientRect().top));assert(order[0]<order[1]&&order[1]<order[2]);assert.equal(errors.length,0,errors.join('\n'));
console.log('Dragon browser checks passed: desktop/tablet/mobile, English interface, search, notes, keyboard, fullscreen, assets and homepage order.');
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
