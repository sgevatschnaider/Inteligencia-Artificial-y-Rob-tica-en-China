/* Educational model. No manufacturer calibration or live LLM. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.Class2Model=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function positive(x,name,allowZero=false){if(!Number.isFinite(x)||(allowZero?x<0:x<=0))throw new RangeError(name);return x;}
 function evaluate(p){const {s,w,e}=p;[s,w,e].forEach((x,i)=>positive(x,['s','w','e'][i]));const q=30*s*w,power=(150+100*s*s+80*w)/e;return{q,power,wh:power/q,optimum:Math.sqrt((150+80*w)/100)};}
 function business(p){const base=evaluate(p);const{availability:A,success:r,hours:H,capex:C,residual:R,years:Y,fixed:F,electricity:k,variable:v,battery:B}=p;
 [A,r,H,Y,B].forEach(x=>positive(x,'parameter'));if(A>1||r>1)throw new RangeError('fraction');if(H>8760)throw new RangeError('hours');[C,R,F,k,v].forEach(x=>positive(x,'cost',true));if(R>C)throw new RangeError('residual');
 const operatingHours=H*A,attempts=operatingHours*base.q,valid=attempts*r,kwh=operatingHours*base.power/1000,capital=(C-R)/Y,energyCost=kwh*k,variableCost=attempts*v,annual=capital+F+energyCost+variableCost;
 return{...base,operatingHours,attempts,valid,kwh,capital,energyCost,variableCost,annual,unit:annual/valid,validWh:base.wh/r,runtime:B/base.power};
 }
 function initial(battery){positive(battery,'battery');return{energy:battery,seconds:0,attempts:0,valid:0};}
 function advance(state,p,seconds){positive(seconds,'time',true);const v=evaluate(p);const effective=Math.min(seconds,Math.max(0,state.energy)/v.power*3600),h=effective/3600;const remaining=Math.max(0,state.energy-v.power*h);return{energy:remaining<1e-8?0:remaining,seconds:state.seconds+effective,attempts:state.attempts+v.q*h,valid:state.valid+v.q*h*p.success};}
 return Object.freeze({evaluate,business,initial,advance});
});
