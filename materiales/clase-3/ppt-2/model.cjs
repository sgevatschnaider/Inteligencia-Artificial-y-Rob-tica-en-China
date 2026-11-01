/* Synthetic teaching equations. No LLM weights, APIs or calibrated performance data. */
(function(root){'use strict';
const IDS=['k','bal','difficulty','reason','verify','nagents','steps'];const LIMITS={k:[1,5],bal:[0,100],difficulty:[5,100],reason:[0,100],verify:[0,100],nagents:[1,6],steps:[6,32]};const SETUPS={balance:[2,70,55,55,60,3,18],dense:[4,80,75,90,85,4,22],scarcity:[1,40,70,20,35,2,20],agents:[3,80,65,70,90,6,24],stress:[2,15,95,25,10,5,25]};const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));const seed=s=>((s*1664525+1013904223)>>>0)/4294967296;
function clean(input){return Object.fromEntries(IDS.map((id,i)=>{const n=Number(input[id]);return [id,clamp(Math.round(Number.isFinite(n)?n:SETUPS.balance[i]),...LIMITS[id])];}));}
function simulate(input,count){const c=clean(input),history=[],loads=Array(8).fill(0);let active=[];const limit=count===undefined?c.steps:clamp(Math.floor(count),0,c.steps);
for(let t=1;t<=limit;t++){
 const raw=loads.map((_,j)=>.26+.74*seed(104729+t*7919+j*6007+c.difficulty*79+c.bal*31)-(100-c.bal)/100*loads[j]*.018);
 active=raw.map((v,i)=>[v,i]).sort((a,b)=>b[0]-a[0]||a[1]-b[1]).slice(0,c.k).map(x=>x[1]);active.forEach(i=>loads[i]++);
 const total=loads.reduce((a,b)=>a+b,0),imbalance=Math.sqrt(loads.reduce((a,b)=>a+(b-total/8)**2,0)/8)/Math.max(1,total/8),complex=c.difficulty/100,reason=c.reason/100,ver=c.verify/100,team=(c.nagents-1)/5;
 const quality=clamp(51+13*reason+12*ver+7*team+7*Math.log2(1+c.k)-25*complex-9*imbalance+2.2*(seed(t*991+13)-.5),0,100),risk=clamp(16+33*complex+17*imbalance-18*ver-7*reason-5*team,0,100);
 const dtCost=.43+.22*c.k+.48*reason+.18*ver+.15*team+.10*complex,dtLatency=.32+.17*c.k+.43*reason+.16*ver+.12*team,prev=history.at(-1),cost=(prev?prev.cost:0)+dtCost,latency=(prev?prev.latency:0)+dtLatency;
 history.push({step:t,expertIds:[...active],quality,risk,cost,latency,imbalance,normalizedCost:clamp(cost/(c.steps*2.9)*100,0,100),dtCost});
}return {history,loads,active,config:c};}
const api={IDS,LIMITS,SETUPS,clean,simulate};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChinaAIModel=api;
})(typeof globalThis!=='undefined'?globalThis:this);
