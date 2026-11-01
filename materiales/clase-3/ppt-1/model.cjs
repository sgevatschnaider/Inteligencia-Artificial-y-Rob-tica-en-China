'use strict';
const YEARS=Array.from({length:16},(_,i)=>2025+i);
const BASE=Object.freeze({rd:2.8,talent:68,diffusion:64,industrial:80,access:65,coord:70});
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
  function model(p){
    const st={knowledge:100,adoption:100,industry:100,local:100,productivity:100};
    const result=[];
    for(let t=0;t<YEARS.length;t++){
      if(t>0){
        const access=p.access/65,rd=p.rd/2.8,talent=p.talent/68,coord=p.coord/70,industrial=p.industrial/80,diffusion=p.diffusion/64;
        const k=clamp(.023*Math.pow(rd,.48)*Math.pow(talent,.28)*Math.pow(coord,.17)*(.8+.2*access),.003,.075);
        const d=clamp(.029*Math.pow(diffusion,.55)*Math.pow(st.knowledge/100,.22)*Math.pow(industrial,.18)*clamp(1-.4*(st.adoption-100)/100,.45,1.2),.002,.09);
        const u=clamp(.020*Math.pow(st.adoption/100,.30)*Math.pow(industrial,.27)*Math.pow(access,.29)*Math.pow(st.knowledge/100,.14)*clamp(1-.22*(st.industry-100)/100,.55,1.1),.002,.07);
        const l=clamp(.015*Math.pow(rd,.30)*Math.pow(coord,.38)*Math.pow(st.knowledge/100,.25)*(1.1-.1*access)*clamp(1-.25*(st.local-100)/100,.55,1.1),.002,.07);
        const pr=clamp(.012*Math.pow(st.industry/100,.40)*Math.pow(st.adoption/100,.30)*Math.pow(st.knowledge/100,.15)*(.55+.45*access)*(.7+.3*talent),.002,.07);
        st.knowledge*=(1+k);st.adoption*=(1+d);st.industry*=(1+u);st.local*=(1+l);st.productivity*=(1+pr);
      }
      const innovation=100*Math.pow(st.knowledge/100,.55)*Math.pow(st.adoption/100,.20)*Math.pow(st.local/100,.25);
      const exposure=clamp(.65*(100-p.access)+32*clamp(1-(st.local-100)/100,0,1),0,100);
      result.push({year:YEARS[t],innovation,productivity:st.productivity,industry:st.industry,local:st.local,knowledge:st.knowledge,adoption:st.adoption,exposure});
    }
    return result;
  }
module.exports={YEARS,BASE,model};
