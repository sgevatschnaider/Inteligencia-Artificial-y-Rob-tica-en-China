const {chromium}=require('playwright');
const http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..'),out=path.join(root,'.build/class4-en/browser');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{
 const file=path.join(root,decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(!file.startsWith(root)||!fs.existsSync(file)){res.writeHead(404).end();return;}
 const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png'};
 res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const results=[];
 try{
  for(let i=1;i<=5;i++){
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
   const suffix=i===5?'ppt-1/lab-sdv.en.html':`ppt-${i}/lab.en.html`;
   const response=await page.goto(`http://127.0.0.1:${server.address().port}/materiales/clase-4/${suffix}`);
   assert.equal(response.status(),200);
   await page.waitForTimeout(300);
   assert.equal(await page.locator('html').getAttribute('lang'),'en');
   assert(await page.locator('h1').isVisible());
   if(i===1){const x=await page.evaluate(()=>{setScenario('base');for(let j=0;j<120;j++)step(.25);render();return {arrivals:state.arrivals,total:state.good+state.reject+state.lost+wip()}});assert.equal(x.arrivals,x.total);}
   if(i===2){const x=await page.evaluate(()=>{setTab('quantum');qPreset('bell');return {c:concurrence(),p:probs()}});assert(Math.abs(x.c-1)<1e-12);assert(Math.abs(x.p[0]-.5)<1e-12);}
   if(i===3){const x=await page.evaluate(()=>{trainBci();return bciResult.metrics.acc});assert(x>=0&&x<=1);}
   if(i===4){const x=await page.evaluate(()=>{setTab('energy');$('power').value=20;$('utilization').value=65;$('efficiency').value=52;h2Calc();return $('h2Production').textContent});assert.equal(x,'6,000');}
   if(i===5){const before=await page.locator('#result').innerText();await page.locator('#speed').fill('120');await page.locator('#speed').dispatchEvent('input');assert.notEqual(await page.locator('#result').innerText(),before);assert((await page.locator('#result').innerText()).includes('Braking'));}
   await page.screenshot({path:path.join(out,`lab-${i}.png`)});
   assert.deepEqual(errors,[],suffix);
   results.push({path:suffix,browser_errors:errors.length,status:'passed'});
   await page.close();
  }
  fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
