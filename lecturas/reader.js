'use strict';
(function(){
const docs=[
['politica-gobernanza','policy-governance','Política y gobernanza','Policy and governance'],
['empresas-modelos','companies-models','Empresas, modelos y chips','Companies, models and chips'],
['robotica-industria','robotics-industry','Robótica e IA física','Robotics and embodied AI'],
['aplicaciones-etica','applications-ethics','Aplicaciones y sociedad','Applications and society'],
['cronologia','timeline','Cronología','Timeline'],
['fuentes','sources','Fuentes y metodología','Sources and methodology']];
const $=id=>document.getElementById(id),p=new URLSearchParams(location.search),lang=p.get('lang')==='en'?'en':'es',i=Math.max(0,docs.findIndex(d=>d[lang==='es'?0:1]===p.get('doc'))),d=docs[i],name=k=>k[lang==='es'?2:3],slug=k=>k[lang==='es'?0:1];
const url=(k,l)=>'?lang='+l+'&doc='+encodeURIComponent(k[l==='es'?0:1]);
document.documentElement.lang=lang;
document.title=name(d)+' · '+(lang==='es'?'China tecnológica':'Technological China');
$('brand').textContent=lang==='es'?'Inteligencia Artificial y Robótica en China':'Artificial Intelligence and Robotics in China';
$('es').href=url(d,'es');$('en').href=url(d,'en');$(lang).classList.add('current');
$('crumb').textContent=lang==='es'?'Inicio':'Home';$('crumb-current').textContent=name(d);
$('side-label').textContent=lang==='es'?'BIBLIOTECA DE INVESTIGACIÓN':'RESEARCH LIBRARY';
$('header-label').textContent=lang==='es'?'INVESTIGACIÓN · 2026':'RESEARCH · 2026';
$('desc').textContent=lang==='es'?'Texto completo · Fuentes originales':'Full text · Original sources';
$('back').textContent=lang==='es'?'← Volver a la portada':'← Back to home';
$('return').textContent=lang==='es'?'Volver a la portada ↗':'Back to home ↗';
$('sidenav').innerHTML=docs.map((entry,j)=>'<a class="'+(j===i?'current':'')+'" href="'+url(entry,lang)+'"'+(j===i?' aria-current="page"':'')+'>'+String(j+1).padStart(2,'0')+' · '+name(entry)+'</a>').join('');
const next=docs[(i+1)%docs.length];$('next').href=url(next,lang);$('next').textContent=(lang==='es'?'Siguiente: ':'Next: ')+name(next)+' →';
$('title').textContent=name(d);
const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function href(path){
 if(/^https?:\/\//i.test(path)||path[0]==='#')return path;
 const cross=path.match(/^\.\.\/(es|en)\/([^/]+)\.md$/);
 if(cross){const match=docs.find(item=>item[cross[1]==='es'?0:1]===cross[2]);return match?url(match,cross[1]):'../index.html';}
 if(path.startsWith('../../README'))return '../index.html';
 if(path.startsWith('../../data/'))return '../data/'+path.slice(11);
 if(path.startsWith('../../'))return '../'+path.slice(6);
 if(path.endsWith('.md')){const match=docs.find(item=>slug(item)+'.md'===path);return match?url(match,lang):'../index.html';}
 return '#';
}
function inline(line){
 let s=escape(line);
 s=s.replace(/\[([^\]]+)\]\(([^)]+)\)/g,function(_,label,target){const address=href(target.replace(/&amp;/g,'&')),external=/^https?:/i.test(address);return '<a href="'+escape(address)+'"'+(external?' target="_blank" rel="noopener noreferrer"':'')+'>'+label+'</a>';});
 return s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/(^|[^*])\*([^*]+)\*/g,'$1<em>$2</em>');
}
function render(md){
 let lines=md.replace(/\r/g,'').split('\n'),out=[],para=[],list='';
 const endP=()=>{if(para.length){out.push('<p>'+inline(para.join(' '))+'</p>');para=[];}};
 const endL=()=>{if(list){out.push('</'+list+'>');list='';}};
 for(let index=0;index<lines.length;index++){const line=lines[index].trim();
 if(index===0&&line.startsWith('# '))continue;
 if(index<5&&(/^\*\*\[English\]/.test(line)||/^\*\*\[Español\]/.test(line)))continue;
 if(!line){endP();endL();continue;}
 if(line.startsWith('|')){endP();endL();const table=[];while(index<lines.length&&lines[index].trim().startsWith('|')){table.push(lines[index].trim());index++;}index--;if(table.length>1){out.push('<div class="tablewrap"><table>');table.forEach((r,j)=>{if(j===1&&/^[|\s:-]+$/.test(r))return;const tag=j===0?'th':'td';out.push('<tr>'+r.replace(/^\||\|$/g,'').split('|').map(c=>'<'+tag+'>'+inline(c.trim())+'</'+tag+'>').join('')+'</tr>');});out.push('</table></div>');}continue;}
 const h=line.match(/^(#{2,4})\s+(.+)$/);
 if(h){endP();endL();const n=Math.min(3,h[1].length);out.push('<h'+n+'>'+inline(h[2])+'</h'+n+'>');continue;}
 const b=line.match(/^[-*]\s+(.+)$/),o=line.match(/^\d+\.\s+(.+)$/);
 if(b||o){endP();const type=b?'ul':'ol';if(list!==type){endL();out.push('<'+type+'>');list=type;}out.push('<li>'+inline(b?b[1]:o[1])+'</li>');continue;}
 if(line.startsWith('> ')){endP();endL();out.push('<blockquote>'+inline(line.slice(2))+'</blockquote>');continue;}
 para.push(line);
 }
 endP();endL();return out.join('\n');
}
fetch('../docs/'+lang+'/'+slug(d)+'.md').then(r=>{if(!r.ok)throw Error('No document');return r.text();}).then(md=>{const heading=md.match(/^# (.+)$/m);if(heading)$('title').textContent=heading[1];$('article').innerHTML=render(md);}).catch(()=>{const link='../docs/'+lang+'/'+slug(d)+'.md';$('article').innerHTML='<p>'+(lang==='es'?'No se pudo cargar la lectura.':'The article could not be loaded.')+'</p><a href="'+link+'">'+(lang==='es'?'Consultar archivo original':'Open source file')+'</a>';});
})();
