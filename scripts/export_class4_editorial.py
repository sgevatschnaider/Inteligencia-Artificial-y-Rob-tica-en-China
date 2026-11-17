#!/usr/bin/env python3
"""Render the actual editable PPTX in LibreOffice and publish matched web/PDF assets."""
import hashlib
from html import escape
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
from PIL import Image
from pypdf import PdfReader,PdfWriter,Transformation
from pypdf.generic import RectangleObject

ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'materiales/clase-4'
def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()

def html_page(title,lang,body,script=''):
    nav='<a href="../index.html">Clase 4 · ES</a> · <a href="../index.en.html">Class 4 · EN</a>'
    return f'''<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{escape(title)}</title><link rel="stylesheet" href="../theme.css"><style>body{{background:#f7f6f1;color:#172436}}header{{background:#101d31}}header a{{color:white}}.wrap{{max-width:1200px}}h1,h2{{color:#101d31}}a{{color:#087b7e}}.actions .button{{background:#101d31;color:white}}.editorial-slide{{width:100%;height:auto;display:block}}.speaker-note{{white-space:pre-line;line-height:1.7}}article{{padding:24px 0;border-bottom:1px solid #d8e1e5}}.chart{{background:white}}#slide-text{{padding:24px 0}}#slide-text a{{overflow-wrap:anywhere}}select,button{{font:inherit;padding:10px}}.controls{{display:flex;gap:12px;flex-wrap:wrap}}.lead{{color:#536675}}</style></head><body><header><div class="wrap">{nav}</div></header><main class="wrap">{body}</main><footer class="wrap">Sergio Gevatschnaider · 2026</footer>{script}</body></html>\n'''

def main(module):
    folder=BASE/f'ppt-{module}';build=ROOT/'.build/editorial'/f'ppt-{module}'
    metadata=json.loads((folder/'editorial-build.json').read_text())
    runtime=Path(os.environ['CODEX_PRIMARY_RUNTIME_ROOT'])/'dependencies/bin/override'
    for lang in ['es','en']:
        data=json.loads((folder/('slides.json' if lang=='es' else 'slides.en.json')).read_text())
        info=metadata['languages'][lang];pptx=ROOT/info['pptx']
        out=build/f'office-{lang}';out.mkdir(parents=True,exist_ok=True)
        subprocess.run([str(runtime/'soffice'),'--headless',f'-env:UserInstallation=file://{build}/lo-{lang}','--convert-to','pdf','--outdir',str(out),str(pptx)],check=True)
        pdf=out/(pptx.stem+'.pdf');assert len(PdfReader(pdf).pages)==len(data['slides'])
        dest=folder/('presentacion.pdf' if lang=='es' else 'presentation.en.pdf')
        writer=PdfWriter()
        for page in PdfReader(pdf).pages:
            # LibreOffice rounds its page width by a few thousandths of a point.
            # Uniform scaling retains the image ratio and every edge of the slide.
            width,height=float(page.mediabox.width),float(page.mediabox.height)
            scale=min(960/width,540/height)
            page.add_transformation(Transformation().scale(scale).translate((960-width*scale)/2,(540-height*scale)/2))
            page.mediabox=RectangleObject([0,0,960,540]);page.cropbox=RectangleObject([0,0,960,540]);writer.add_page(page)
        with dest.open('wb') as output:writer.write(output)
        subprocess.run([str(runtime/'pdftoppm'),'-scale-to','1600','-png',str(dest),str(out/'page')],check=True)
        slide_dir=folder/('slides' if lang=='es' else 'slides-en');slide_dir.mkdir(exist_ok=True)
        previews=sorted(out.glob('page-*.png'))
        assert len(previews)==len(data['slides'])
        for i,p in enumerate(previews,1):
            with Image.open(p) as im:
                assert im.width*9==im.height*16
                im.convert('RGB').save(slide_dir/f'{i:02d}.webp',quality=91,method=6)
        if lang=='en':
            (BASE/'covers').mkdir(exist_ok=True)
            shutil.copyfile(previews[0],BASE/'covers'/f'module-{module}.png')
        en=lang=='en';index=folder/('index.en.html' if en else 'index.html')
        guide_name='guide.en.html' if en else 'guide.html'
        controls=f'<div class="controls"><button id="prev">{"Previous" if en else "Anterior"}</button><select id="slide" aria-label="Slide">'+''.join(f'<option value="{i}">{i+1}. {escape(sd["title"])}</option>' for i,sd in enumerate(data['slides']))+f'</select><button id="next">{"Next" if en else "Siguiente"}</button><span id="count"></span></div>'
        body=f'<p class="eyebrow">{"CLASS 4" if en else "CLASE 4"} / {module}</p><h1>{escape(data["title"])}</h1><p class="lead">{escape(data["overview"])}</p><div class="actions"><a class="button" href="{pptx.name}">PowerPoint</a><a class="button" href="{dest.name}">PDF</a><a class="button" href="lab{(".en" if en else "")}.html">{"Laboratory" if en else "Laboratorio"}</a><a class="button" href="{guide_name}">{"Speaker guide" if en else "Guía del expositor"}</a><a class="button" href="{("index.html" if en else "index.en.html")}">{"Español" if en else "English"}</a></div>'+controls+'<img id="slide-image" class="editorial-slide" width="1600" height="900" alt=""><section id="slide-text" aria-live="polite"></section>'
        index.write_text(html_page(data['title'],lang,body,'<script src="../viewer.js"></script>'))
        guide='<h1>'+escape(data['title'])+'</h1><p><a href="'+index.name+'">'+('Open presentation' if en else 'Abrir presentación')+'</a></p>'
        for sd in data['slides']:
            guide+=f'<article><h2>{sd["number"]}. {escape(sd["title"])}</h2><p class="speaker-note">{escape(sd["notes"])}</p><ul>'+''.join(f'<li><a href="{escape(url,quote=True)}">{escape(url)}</a></li>' for url in sd['sources'])+'</ul></article>'
        (folder/guide_name).write_text(html_page(data['title'],lang,guide))
        paths=[pptx,dest,index,folder/guide_name,*sorted(slide_dir.glob('*.webp'))]
        info['artifacts']=[{'path':str(p.relative_to(ROOT)),'bytes':p.stat().st_size,'sha256':digest(p)} for p in paths]
        print(f'Module {module} {lang}: opened PPTX, {len(data["slides"])} PDF pages and web images',flush=True)
    (folder/'editorial-build.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n')

if __name__=='__main__':main(int(sys.argv[1]))
