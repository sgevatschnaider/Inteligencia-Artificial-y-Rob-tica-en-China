(() => {
 'use strict';
 const initialView=new URLSearchParams(location.search).get('view');
 const $=id=>document.getElementById(id),english=new URLSearchParams(location.search).get('lang')==='en',lang=english?'en':'es';
 const word=(es,en)=>english?en:es;
 document.documentElement.lang=lang;
 document.querySelectorAll('[data-en]').forEach(el=>{if(english)el.textContent=el.dataset.en;});
 $('switch-es').removeAttribute('aria-current');$('switch-en').removeAttribute('aria-current');$(english?'switch-en':'switch-es').setAttribute('aria-current','page');
 $('search').placeholder=word('Planes, IA+, regulación…','Plans, IA+, regulation…');
 $('previous').ariaLabel=word('Diapositiva anterior','Previous slide');$('next').ariaLabel=word('Diapositiva siguiente','Next slide');
 $('search').ariaLabel=word('Buscar en contenidos y notas','Search slides and notes');
 let deck=[],registry={},current=1,active='slides';
 const tabs=['slides','pdf','sources'];
 const normalize=t=>t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const clamp=n=>Math.max(1,Math.min(deck.length,Number.isFinite(Number(n))?Math.round(Number(n)):1));
 function sources(){
  const slide=deck[current-1];if(!slide)return;
  $('sources-title').textContent=current+'. '+slide.title;$('speaker-notes').textContent=slide.notes;$('illustration-note').textContent=slide.illustration;
  $('source-links').replaceChildren();
  for(const id of slide.source_ids){const ref=registry[id];if(!ref)continue;
   const li=document.createElement('li'),a=document.createElement('a'),meta=document.createElement('small');a.href=ref.url;a.textContent=ref.title;a.target='_blank';a.rel='noopener noreferrer';
   meta.className='source-meta';meta.textContent=[ref.kind,ref.date,ref.locator].filter(Boolean).join(' · ');li.append(a,meta);$('source-links').append(li);
  }
 }
 function activate(name,{focus=false}={}){
  active=name;
  for(const tab of tabs){$(tab+'-panel').hidden=tab!==name;const b=$('tab-'+tab);b.classList.toggle('selected',tab===name);b.setAttribute('aria-selected',String(tab===name));b.tabIndex=tab===name?0:-1;}
  if(name==='sources')sources();
  if(name==='pdf')$('pdf-panel').querySelector('object').data='presentacion.pdf#page='+current;
  if(focus)$('tab-'+name).focus();
 }
 function setPage(value,{scroll=false}={}){
  if(!deck.length)return;current=clamp(value);const d=deck[current-1];
  $('image-error').hidden=true;$('slide-image').src=d.image;$('slide-image').alt=word('Diapositiva ','Slide ')+current+': '+d.title;
  $('page').value=current;$('previous').disabled=current===1;$('next').disabled=current===deck.length;
  $('slide-title').textContent=d.title;$('chapter-label').textContent=d.chapter;$('slide-transcript').textContent=d.text.join('\n\n');
  $('slide-status').textContent=word('Diapositiva ','Slide ')+current+' / '+deck.length+': '+d.title;
  document.querySelectorAll('[data-page]').forEach(b=>{const selected=Number(b.dataset.page)===current;b.classList.toggle('active',selected);if(selected)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  $('switch-es').href='?lang=es#'+current;$('switch-en').href='?lang=en#'+current;
  history.replaceState(null,'','?lang='+lang+'#'+current);
  if(active==='sources')sources();if(active==='pdf')$('pdf-panel').querySelector('object').data='presentacion.pdf#page='+current;
  if(current<deck.length){const im=new Image();im.src=deck[current].image;}
  if(scroll)$('stage').scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
 }
 function listSlides(query=''){
  const needle=normalize(query.trim()),groups=new Map();
  const hits=deck.filter(d=>!needle||normalize(d.title+' '+d.text.join(' ')+' '+d.notes).includes(needle));
  for(const d of hits){if(!groups.has(d.chapter))groups.set(d.chapter,[]);groups.get(d.chapter).push(d);}
  $('chapters').replaceChildren();
  for(const [name,items] of groups){const group=document.createElement('section'),heading=document.createElement('h3');group.className='chapter-group';heading.textContent=name;heading.lang='es';group.append(heading);
   for(const d of items){const b=document.createElement('button'),num=document.createElement('span'),label=document.createElement('span');b.type='button';b.dataset.page=d.number;b.lang='es';num.textContent=String(d.number).padStart(2,'0');label.textContent=d.title;b.append(num,label);b.classList.toggle('active',current===d.number);if(current===d.number)b.setAttribute('aria-current','page');b.addEventListener('click',()=>{activate('slides');setPage(d.number,{scroll:true});});group.append(b);}
   $('chapters').append(group);
  }
  $('search-status').textContent=needle?hits.length+word(' resultados',' results'):'';
 }
 async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else if($('stage').requestFullscreen)await $('stage').requestFullscreen();else $('slide-status').textContent=word('Pantalla completa no disponible en este navegador.','Full screen is unavailable in this browser.');}catch{$('slide-status').textContent=word('El navegador no permitió pantalla completa.','The browser did not allow full screen.');}}
 for(const name of tabs){const b=$('tab-'+name);b.addEventListener('click',()=>activate(name));b.addEventListener('keydown',e=>{const i=tabs.indexOf(name);let n;if(e.key==='ArrowRight')n=(i+1)%3;if(e.key==='ArrowLeft')n=(i+2)%3;if(e.key==='Home')n=0;if(e.key==='End')n=2;if(n!==undefined){e.preventDefault();activate(tabs[n],{focus:true});}});}
 $('previous').addEventListener('click',()=>setPage(current-1));$('next').addEventListener('click',()=>setPage(current+1));$('page').addEventListener('change',e=>setPage(e.target.value));$('search').addEventListener('input',e=>listSlides(e.target.value));$('show-sources').addEventListener('click',()=>activate('sources',{focus:true}));$('fullscreen').addEventListener('click',fullscreen);$('slide-image').addEventListener('error',()=>{$('image-error').hidden=false;});
 document.addEventListener('keydown',e=>{
  if(active!=='slides'||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,textarea,select,summary,[role=tab]'))return;
  if(['ArrowRight','PageDown'].includes(e.key)){e.preventDefault();setPage(current+1);}
  if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();setPage(current-1);}
  if(e.key==='Home'){e.preventDefault();setPage(1);}if(e.key==='End'){e.preventDefault();setPage(deck.length);}
  if(e.key.toLowerCase()==='f'&&!e.target.closest('button,a')){e.preventDefault();fullscreen();}
 });
 window.addEventListener('hashchange',()=>setPage(location.hash.slice(1)));
 fetch('slides.json').then(r=>{if(!r.ok)throw Error('metadata');return r.json();}).then(data=>{deck=data.slides;registry=data.source_registry;$('page').max=deck.length;$('page-total').textContent='/ '+deck.length;listSlides();setPage(location.hash.slice(1)||1);if(initialView==='sources')activate('sources');}).catch(()=>{$('search-status').textContent=word('No se pudo cargar el índice. Podés abrir el PDF.','The index could not load. You can open the PDF.');});
})();
