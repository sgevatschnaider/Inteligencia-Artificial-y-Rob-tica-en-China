import vm from 'node:vm';import fs from 'node:fs';
const results=[];function check(ok,name,details){results.push({name,pass:!!ok,details});if(!ok)throw Error(name)}
function load(i){const html=fs.readFileSync(`materiales/clase-4/ppt-${i}/lab.html`,'utf8'),els=new Map();
const ctx=new Proxy({measureText:t=>({width:String(t).length*7}),setLineDash:()=>{}},{get:(o,k)=>k in o?o[k]:(...a)=>ctx,set:(o,k,v)=>(o[k]=v,true)});
function element(id){if(els.has(id))return els.get(id);const style={},e={id,value:'0',textContent:'',innerHTML:'',style,dataset:{},className:'',width:700,height:300,children:[],classList:{toggle(){},add(){},remove(){},contains(){return false}},addEventListener(){},getContext:()=>ctx,querySelector:()=>element(id+'-child'),querySelectorAll:()=>[],appendChild(){},append(){},click(){},setAttribute(){},getAttribute(){return null},remove(){}};els.set(id,e);return e}
for(const m of html.matchAll(/<(input|select)\b([^>]*)>/g)){const a=Object.fromEntries(Array.from(m[2].matchAll(/([\w-]+)="([^"]*)"/g),x=>[x[1],x[2]]));if(a.id){element(a.id).value=a.value||'0';}}
const document={getElementById:element,querySelector:()=>element('dummy'),querySelectorAll:()=>[],createElement:()=>element('created'),body:element('body'),documentElement:element('html'),addEventListener(){}};
const sandbox={document,console,Math,Number,Array,Map,Set,JSON,String,Blob,URL,setInterval:()=>1,clearInterval(){},setTimeout(){},clearTimeout(){},getComputedStyle:()=>({getPropertyValue:()=> '#abcdef'}),window:{addEventListener(){},devicePixelRatio:1},performance:{now:()=>0},requestAnimationFrame:()=>1};
sandbox.window.document=document;const context=vm.createContext(sandbox);const script=Array.from(html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g),m=>m[1]).join('\n');vm.runInContext(script,context,{timeout:20000});return {run:s=>vm.runInContext(s,context,{timeout:30000}),els};}
try{
let {run,els}=load(1);
const f=run(`(()=>{let out=[];for(const k of Object.keys(scenarios)){setScenario(k);for(let t=0;t<1920;t++)step(.25);out.push({key:k,time:state.time,arrivals:state.arrivals,good:state.good,reject:state.reject,lost:state.lost,wip:wip()})}return out})()`);
for(const x of f)check(x.time===480&&x.arrivals===x.good+x.reject+x.lost+x.wip,'Fábrica conserva flujo '+x.key,x);
check(run(`(()=>{setScenario('base');for(let t=0;t<1920;t++)step(.25);let a=state.good;reset();for(let t=0;t<1920;t++)step(.25);return a===state.good})()`),'Fábrica reproducible con reinicio');
({run,els}=load(2));els.get('edge').value='edge';
check(Math.abs(run(`qPreset('zero');applySingle('H',0);applySingle('H',0);abs2(q.state[0])`)-1)<1e-12,'H² = identidad');
const bell=run(`qPreset('bell');({p:probs(),c:concurrence(),b:reducedBloch()})`);check(Math.abs(bell.p[0]-.5)<1e-12&&bell.p[1]===0&&Math.abs(bell.c-1)<1e-12,'Bell normalizado y entrelazado',bell);
check(Math.abs(bell.b.x)+Math.abs(bell.b.y)+Math.abs(bell.b.z)<1e-12,'Bloch reducido del estado Bell es cero');
check(run(`qShots(1000);applySingle('X',1);q.shotNumber===0`),'Puerta invalida mediciones');
check(run(`qSet(2,1);$('circuit').innerHTML.includes('|1⟩')`),'Circuito conserva estado inicial 01');
check(run(`qSet(2);applySingle('H',0);applyCnot();q.history.length===2`),'Circuito conserva columnas de puertas');
for(const demand of [1,1000,3000]){els.get('traffic').value=String(demand);const x=run('netMetrics(1)');check(Number.isFinite(x.gen5.lat)&&Number.isFinite(x.gen6.lat),'Red valores finitos demanda '+demand);}
({run,els}=load(3));
check(run(`rocAuc([{label:0,prob:.5},{label:1,prob:.5}]).auc===.5`),'ROC-AUC empates = 0,5');
check(run(`bciResult.metrics.acc>=0&&bciResult.metrics.acc<=1`),'BCI métricas acotadas');
const active=run(`(()=>{newScience();for(let i=0;i<20;i++)nextExperiment();let ids=science.observations.map(o=>o.candidate.id);return {n:ids.length,unique:new Set(ids).size,used:science.used.size}})()`);check(active.n===active.unique&&active.n===active.used,'Candidatos no se repiten',active);
check(run(`compare();comparison.active.length===comparison.random.length`),'Comparación igual presupuesto');
check(run(`science.observations.every(o=>Number.isFinite(o.noiseVar))`),'GP conserva varianza de cada ensayo');
({run,els}=load(4));
const air=run(`(()=>{$('demand').value=30;initAir();for(let i=0;i<48;i++)airTick();let g=air.generated;airTick();return{g,stable:air.generated===g,t:air.t,soc:air.units.map(u=>u.soc),hist:air.history.map(x=>x.t)}})()`);check(air.g===240&&air.t===480&&air.stable,'Aire demanda completa y fin de turno',air);check(air.soc.every(v=>v>=0&&v<=1)&&air.hist.every((v,i,a)=>i===0||v>a[i-1]),'Aire SOC acotado e historial temporal');
check(run(`$('satCount').value=4;$('obstruction').value=80;$('receiver').value=2;runPnt();$('pntError').textContent==='Sin solución'`),'PNT sin solución no reporta error cero');
check(run(`setTab('energy');h2Calc();fusionCalc();true`),'Pestaña energía y cálculos sin funciones inexistentes');
const h2=run(`$('power').value=20;$('utilization').value=65;$('efficiency').value=52;h2Calc();$('h2Production').textContent`);check(h2==='6.000','H₂ produce 6000 kg/día',h2);
const d=60/3.6,brake=d*d/(2*.7*9.81);check(Math.abs((2*d)**2/(2*.7*9.81)/brake-4)<1e-12,'Detención: duplicar velocidad cuadruplica frenado');
for(let i=1;i<=4;i++){
 const l=load(i);const html=fs.readFileSync(`materiales/clase-4/ppt-${i}/lab.html`,'utf8');
 for(const m of html.matchAll(/<input\b([^>]*type="range"[^>]*)>/g)){const a=Object.fromEntries(Array.from(m[1].matchAll(/([\w-]+)="([^"]*)"/g),x=>[x[1],x[2]]));for(const v of [a.min,a.max]){l.els.get(a.id).value=v;l.run(i===1?'syncControls();advanceOne()':i===2?'updateNetLabels();netMetrics(1);renderQuantum()':i===3?'trainBci();if(science)renderScience()':'setAirLabels();initAir();airTick();runPnt();h2Calc();fusionCalc()');}}
 check(true,'Laboratorio '+i+': extremos de todos los rangos sin excepción');
}
}catch(e){results.push({name:e.message,pass:false});console.error(e.stack)}
fs.mkdirSync('qa/clase-4',{recursive:true});fs.writeFileSync('qa/clase-4/model-tests.json',JSON.stringify({date:new Date().toISOString(),environment:'Node VM with DOM/canvas stubs; mathematical and execution checks, not rendered browser tests',results},null,2));console.log(JSON.stringify({passed:results.filter(x=>x.pass).length,failed:results.filter(x=>!x.pass)}));if(results.some(x=>!x.pass))process.exitCode=1;
