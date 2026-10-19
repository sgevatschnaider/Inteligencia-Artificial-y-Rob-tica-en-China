(() => {
  'use strict';
  const catalog = Array.isArray(window.VIDEOLAB_CATALOG) ? window.VIDEOLAB_CATALOG : [];
  const byId = id => document.getElementById(id);
  const state = { lang:'es', lesson:'all', query:'' };
  const titles = {
    es:['','Transformación industrial y automatización','Inteligencia artificial y robots humanoides','Semiconductores y cadenas tecnológicas','Aplicaciones, seguridad y ciudades inteligentes'],
    en:['','Industrial transformation and automation','Artificial intelligence and humanoid robotics','Semiconductors and technology supply chains','Applications, safety and smart cities']
  };
  const kinds = {
    es:{company:'Demostración empresarial',report:'Reportaje independiente',explainer:'Animación / explicación'},
    en:{company:'Company demonstration',report:'Independent reporting',explainer:'Animation / explainer'}
  };
  const txt = (es,en) => state.lang==='en' ? en:es;
  const tr = entry => typeof entry==='object' && entry !== null ? (entry[state.lang] || entry.es || '') : (entry || '');
  function el(tag,className,text) { const node=document.createElement(tag); if(className)node.className=className;if(text!==undefined)node.textContent=text;return node; }
  function setLanguage(lang) {
    state.lang=lang==='en'?'en':'es';
    document.documentElement.lang=state.lang;
    document.querySelectorAll('[data-es][data-en]').forEach(node => node.textContent=node.dataset[state.lang]);
    document.querySelectorAll('[data-placeholder-es]').forEach(node => node.placeholder=node.dataset['placeholder'+(state.lang==='en'?'En':'Es')]);
    byId('set-es').setAttribute('aria-pressed',String(state.lang==='es'));
    byId('set-en').setAttribute('aria-pressed',String(state.lang==='en'));
    try { localStorage.setItem('china-ai-language',state.lang); } catch (_) {}
    render();
  }
  function createPoster(item) {
    const poster=el('div','poster '+item.color);
    const label=el('span','poster-tag',txt('CLASE ','LESSON ')+String(item.lesson).padStart(2,'0'));
    poster.append(label);
    if(item.format==='youtube' && /^[a-zA-Z0-9_-]{11}$/.test(item.videoId)) {
      const img=el('img');img.src='https://i.ytimg.com/vi/'+item.videoId+'/hqdefault.jpg';img.alt=txt('Miniatura de ', 'Thumbnail: ')+tr(item.title);img.loading='lazy';img.decoding='async';img.referrerPolicy='no-referrer';img.addEventListener('error',()=>img.remove(),{once:true});poster.append(img);
    }
    poster.append(el('span','poster-label',item.format==='youtube'?'':tr(item.title)));
    poster.append(el('span','play-mark','▶'));
    return poster;
  }
  function createCard(item) {
    const article=el('article','video-card');
    article.id=item.id;
    article.append(createPoster(item));
    const body=el('div','card-body');
    const meta=el('div','meta',txt('CLASE ','LESSON ')+item.lesson+'  ·  '+kinds[state.lang][item.kind]+(item.duration?'  ·  '+item.duration:''));
    body.append(meta,el('h3','',tr(item.title)),el('p','description',tr(item.summary)));
    const source=el('p','source');source.append(el('strong','',txt('Fuente: ','Source: ')),document.createTextNode(item.source+' · '+item.year));body.append(source);
    const actions=el('div','card-action');
    if(item.format==='youtube') {
      const watch=el('button','watch',txt('▶ Reproducir','▶ Play video'));watch.type='button';watch.setAttribute('aria-label',txt('Reproducir ','Play ')+tr(item.title));watch.addEventListener('click',()=>play(item));actions.append(watch);
    } else {
      const watch=el('a','watch',txt('↗ Ver en origen','↗ Open source'));watch.href=item.url;watch.target='_blank';watch.rel='noopener noreferrer';watch.setAttribute('aria-label',txt('Abrir video externo: ','Open external video: ')+tr(item.title));actions.append(watch);
    }
    const toggle=el('button','learn-toggle',txt('Guía docente +','Teaching notes +'));toggle.type='button';
    const details=el('div','pedagogy');details.hidden=true;
    const question=el('p');question.append(el('strong','',txt('Pregunta: ','Question: ')),document.createTextNode(tr(item.question)));
    const caveat=el('p');caveat.append(el('strong','',txt('Límite de evidencia: ','Evidence limit: ')),document.createTextNode(tr(item.caveat)));
    details.append(question,caveat);
    toggle.setAttribute('aria-expanded','false');
    toggle.addEventListener('click',()=>{const open=details.hidden;details.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?txt('Ocultar guía −','Hide notes −'):txt('Guía docente +','Teaching notes +');});
    actions.append(toggle);body.append(actions,details);article.append(body);return article;
  }
  function render(){
    const grid=byId('video-grid');grid.replaceChildren();
    const query=state.query.toLocaleLowerCase().trim();
    const selected=catalog.filter(item=>(state.lesson==='all'||String(item.lesson)===state.lesson)&&(!query||[item.title.es,item.title.en,item.summary.es,item.summary.en,item.source,kinds.es[item.kind],kinds.en[item.kind]].join(' ').toLocaleLowerCase().includes(query)));
    selected.forEach(item=>grid.append(createCard(item)));
    byId('result-count').textContent=selected.length+' / '+catalog.length+' '+txt('videos','videos');
    byId('no-results').hidden=selected.length!==0;
    byId('video-total').textContent=String(catalog.length).padStart(2,'0');
    byId('lesson-info').textContent=state.lesson==='all'?txt('Cuatro clases · Demostraciones y reportajes contrastados','Four lessons · Company demos and independent reports'):titles[state.lang][Number(state.lesson)];
    document.querySelectorAll('.filter').forEach(button=>{const active=button.dataset.lesson===state.lesson;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});
  }
  const dialog=byId('player-modal');
  function stop(){byId('player-area').replaceChildren();}
  function play(item){
    if (!/^[a-zA-Z0-9_-]{11}$/.test(item.videoId))return;
    byId('modal-title').textContent=tr(item.title);
    byId('modal-note').textContent=txt('Video de ','Video by ')+item.source+'. '+txt('Si no carga el reproductor, usá el enlace de origen.','If playback is unavailable, use the original link.');
    const youtube='https://www.youtube.com/watch?v='+item.videoId;
    byId('modal-source').href=youtube;
    const iframe=el('iframe');
    iframe.src='https://www.youtube-nocookie.com/embed/'+item.videoId+'?rel=0';
    iframe.title=tr(item.title);iframe.loading='eager';iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';iframe.allowFullscreen=true;
    byId('player-area').replaceChildren(iframe);
    if(typeof dialog.showModal==='function')dialog.showModal();else window.open(youtube,'_blank','noopener,noreferrer');
  }
  dialog.addEventListener('close',stop);
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  byId('close-modal').addEventListener('click',()=>dialog.close());
  document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{state.lesson=button.dataset.lesson;render();try{const url=new URL(location.href);if(state.lesson==='all')url.searchParams.delete('clase');else url.searchParams.set('clase',state.lesson);history.replaceState(null,'',url);}catch(_){}}));
  byId('search').addEventListener('input',event=>{state.query=event.target.value;render();});
  byId('set-es').addEventListener('click',()=>setLanguage('es'));
  byId('set-en').addEventListener('click',()=>setLanguage('en'));
  let lang='es';try{lang=new URLSearchParams(location.search).get('lang')||localStorage.getItem('china-ai-language')||(navigator.language.toLowerCase().startsWith('es')?'es':'en');}catch(_){}
  try{const c=new URLSearchParams(location.search).get('clase');if(['1','2','3','4'].includes(c))state.lesson=c;}catch(_){}
  setLanguage(lang);
})();