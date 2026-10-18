'use strict';
(() => {
  const $=id=>document.getElementById(id);
  const english=document.documentElement.lang==='en';
  const words=english?{slide:'Slide',results:'results',hypothetical:'Hypothetical teaching example. These numbers do not describe an observed plant.',transition:'Explanation or transition slide. The full bibliography appears at the end of the presentation.',error:'The index could not load. The PDF and PowerPoint remain available.'}:{slide:'Diapositiva',results:'resultados',hypothetical:'Ejemplo hipotético para explorar un mecanismo. Los números no describen una planta observada.',transition:'Diapositiva de explicación o transición. La bibliografía completa figura al final de la presentación.',error:'No se pudo cargar el índice. El PDF y el PowerPoint siguen disponibles.'};
  const pdfFile=english?'presentation.pdf':'presentacion.pdf';
  try{localStorage.setItem('china-ai-language',english?'en':'es');}catch{}
  let deck=[],current=1;
  const panels=['slides','pdf','sources'];
  const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  function activate(tab){
    for(const name of panels){$(name+'-panel').hidden=name!==tab;$('tab-'+name).classList.toggle('selected',name===tab);$('tab-'+name).setAttribute('aria-selected',String(name===tab));}
    if(tab==='pdf')$('pdf-panel').querySelector('object').data=`${pdfFile}#page=${current}&view=FitH`;
    if(tab==='sources')showSources();
  }
  function setPage(value,{focus=false}={}){
    if(!deck.length)return;
    current=Math.max(1,Math.min(deck.length,Math.round(Number(value)||1)));
    const slide=deck[current-1];
    $('slide-image').src=slide.image;$('slide-image').alt=`${words.slide} ${current}: ${slide.title}`;
    $('switch-es').href=(english?'../':'./')+'#'+current;
    $('switch-en').href=(english?'./':'en/')+'#'+current;
    $('page').value=current;$('previous').disabled=current===1;$('next').disabled=current===deck.length;
    $('slide-title').textContent=slide.title;$('chapter-label').textContent=slide.chapter;$('slide-transcript').textContent=slide.text.join('\n');
    document.querySelectorAll('[data-page]').forEach(button=>{const active=Number(button.dataset.page)===current;button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
    history.replaceState(null,'',`#${current}`);
    if(!$('sources-panel').hidden)showSources();
    if(!$('pdf-panel').hidden)$('pdf-panel').querySelector('object').data=`${pdfFile}#page=${current}&view=FitH`;
    if(current<deck.length){const image=new Image();image.src=deck[current].image;}
    if(focus)$('stage').scrollIntoView({block:'nearest',behavior:'smooth'});
  }
  function listSlides(query=''){
    const needle=normalize(query.trim()),groups=new Map();
    const hits=deck.filter(slide=>!needle||normalize(slide.title+' '+slide.text.join(' ')).includes(needle));
    for(const slide of hits){if(!groups.has(slide.chapter))groups.set(slide.chapter,[]);groups.get(slide.chapter).push(slide);}
    $('chapters').replaceChildren();
    for(const [name,slides] of groups){const group=document.createElement('section');group.className='chapter-group';const title=document.createElement('h3');title.textContent=name;group.append(title);for(const slide of slides){const button=document.createElement('button');button.dataset.page=slide.number;const number=document.createElement('span');number.textContent=String(slide.number).padStart(2,'0');const label=document.createElement('span');label.textContent=slide.title;button.append(number,label);button.classList.toggle('active',slide.number===current);button.addEventListener('click',()=>{setPage(slide.number,{focus:true});activate('slides');});group.append(button);}$('chapters').append(group);}
    $('search-status').textContent=needle?`${hits.length} ${words.results}`:'';
  }
  function showSources(){
    const slide=deck[current-1];if(!slide)return;
    $('sources-title').textContent=`${current}. ${slide.title}`;$('speaker-notes').textContent=slide.notes;
    $('source-links').replaceChildren();
    if(!slide.sources.length){const li=document.createElement('li');li.textContent=slide.hypothetical?words.hypothetical:words.transition;$('source-links').append(li);}
    for(const uri of slide.sources){const li=document.createElement('li'),a=document.createElement('a');a.href=uri;a.textContent=uri;a.target='_blank';a.rel='noopener';li.append(a);$('source-links').append(li);}
  }
  for(const name of panels)$('tab-'+name).addEventListener('click',()=>activate(name));
  $('previous').addEventListener('click',()=>setPage(current-1));$('next').addEventListener('click',()=>setPage(current+1));
  $('page').addEventListener('change',e=>setPage(e.target.value));$('search').addEventListener('input',e=>listSlides(e.target.value));
  $('show-sources').addEventListener('click',()=>activate('sources'));
  async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else if($('stage').requestFullscreen)await $('stage').requestFullscreen();}catch{ /* The reader remains usable when fullscreen is unavailable. */ }}
  $('fullscreen').addEventListener('click',fullscreen);
  document.addEventListener('keydown',e=>{
    if(e.target.matches('input,textarea,select')||$('slides-panel').hidden)return;
    if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();setPage(current+1);}
    if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();setPage(current-1);}
    if(e.key==='Home'){e.preventDefault();setPage(1);}if(e.key==='End'){e.preventDefault();setPage(deck.length);}if(e.key.toLowerCase()==='f'){e.preventDefault();fullscreen();}
  });
  window.addEventListener('hashchange',()=>setPage(location.hash.slice(1)));
  fetch('slides.json').then(r=>{if(!r.ok)throw Error('metadata');return r.json();}).then(data=>{deck=data.slides;$('page').max=deck.length;$('page-total').textContent='/ '+deck.length;listSlides();setPage(location.hash.slice(1)||1);}).catch(()=>{$('search-status').textContent=words.error;});
})();
