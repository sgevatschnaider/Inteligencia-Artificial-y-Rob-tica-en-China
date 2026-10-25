(function(){
 const q=new URLSearchParams(location.search);let pref='es';try{pref=localStorage.getItem('china-ai-language')||localStorage.getItem('china-class2-lang')||'es';}catch{}
 window.lang=q.get('lang')==='en'?'en':q.get('lang')==='es'?'es':pref;
 window.tr=(es,en)=>window.lang==='es'?es:en;
 function setLang(l){window.lang=l==='en'?'en':'es';document.documentElement.lang=window.lang;
 document.querySelectorAll('[data-es]').forEach(x=>x.textContent=x.dataset[window.lang]);
 document.querySelectorAll('[data-lang]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.lang===window.lang)));
 document.querySelectorAll('a[href]').forEach(a=>{const href=a.dataset.localHref||a.getAttribute('href');if(!href||href.startsWith('#')||/^[a-z]+:/i.test(href)||a.hasAttribute('download'))return;a.dataset.localHref=href;try{const u=new URL(href,location.href);if(u.pathname.endsWith('.html')){u.searchParams.set('lang',window.lang);a.href=u.href;}}catch{}});
 try{localStorage.setItem('china-ai-language',window.lang);}catch{}
 try{const u=new URL(location.href);u.searchParams.set('lang',window.lang);history.replaceState(null,'',u);}catch{}
 document.dispatchEvent(new CustomEvent('languagechange',{detail:window.lang}));}
 document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));window.setLang=setLang;setLang(window.lang);
})();
