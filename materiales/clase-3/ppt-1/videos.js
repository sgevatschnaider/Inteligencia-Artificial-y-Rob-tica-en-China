'use strict';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function videos(){
 const root=document.getElementById('video-cards');root.replaceChildren();
 for(const [i,v] of PPT1_VIDEOS.entries()){
  const a=document.createElement('article');a.className='card';a.id=v.id;
  a.innerHTML=`<div class="video-poster" aria-hidden="true">${String(i+1).padStart(2,'0')} ▶</div><p class="video-meta">${esc(v.source)} · ${esc(v.audio)}</p><span class="eyebrow">${esc(v.type[lang])}</span><h2 style="font-size:1.6rem">${esc(v.title[lang])}</h2><p>${esc(v.context[lang])}</p><h3>${tr('Objetivo','Objective')}</h3><p>${esc(v.objective[lang])}</p><h3>${tr('Para discutir','Discussion')}</h3><p>${esc(v.question[lang])}</p><div class="slide-video-links">${v.slides.map(s=>`<a class="button" href="reader.html?slide=${s}&lang=${lang}">${tr('Diapositiva','Slide')} ${s}</a>`).join('')}</div><p class="video-meta">${esc(v.caveat[lang])}</p><div class="actions"><button class="primary" data-play>${tr('Reproducir aquí','Play here')}</button><a class="button" href="https://www.youtube.com/watch?v=${v.videoId}" target="_blank" rel="noopener">${tr('Abrir en YouTube','Open on YouTube')} ↗</a></div><div class="player-slot"></div>`;
  a.querySelector('[data-play]').addEventListener('click',e=>{
   const slot=a.querySelector('.player-slot'),active=!!slot.firstChild;slot.replaceChildren();
   e.currentTarget.textContent=active?tr('Reproducir aquí','Play here'):tr('Cerrar reproductor','Close player');
   if(active)return;const frame=document.createElement('iframe');frame.title=v.title[lang];frame.src='https://www.youtube-nocookie.com/embed/'+v.videoId+'?rel=0';frame.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';const wrap=document.createElement('div');wrap.className='video-frame';wrap.append(frame);slot.append(wrap);
  });root.append(a);
 }
 const id=location.hash.slice(1);if(id)document.getElementById(id)?.scrollIntoView();
}
document.addEventListener('languagechange',videos);videos();
