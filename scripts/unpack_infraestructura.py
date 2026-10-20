#!/usr/bin/env python3
"""Restore the 32 original slides and accompanying files from the verified source package.
Idempotent; only touches materiales/infraestructura (never other lessons).
"""
from __future__ import annotations
import hashlib, io, json, re
from html import escape
from pathlib import Path
from urllib.parse import urlparse
from xml.etree import ElementTree as ET
from zipfile import ZipFile

ROOT=Path(__file__).resolve().parents[1]
DEST=ROOT/'materiales/infraestructura'
PARTS=DEST/'paquete'
SHA256='279831f73f935198e9c8f841cd2b47eb3dd9038256985dad747a72fb159eef92'
NS={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
EXPECTED={f'slides/slide-{i:02d}.webp' for i in range(1,33)}|{'presentacion.pdf','presentacion.pptx','slides.json','LEEME.txt'}

def note_from_ppt(z,n):
    root=ET.fromstring(z.read(f'ppt/notesSlides/notesSlide{n}.xml'))
    for sp in root.findall('.//p:sp',NS):
        ph=sp.find('p:nvSpPr/p:nvPr/p:ph',NS)
        if ph is not None and ph.attrib.get('type')=='body':
            return '\n'.join(''.join(t.text or '' for t in par.findall('.//a:t',NS)) for par in sp.findall('p:txBody/a:p',NS)).strip()
    raise ValueError(f'No teaching notes for slide {n}')

def enhance_metadata():
    path=DEST/'slides.json'
    data=json.loads(path.read_text(encoding='utf-8'))
    assert len(data['slides'])==32, 'Expected exactly 32 academic slides'
    registry={}
    with ZipFile(DEST/'presentacion.pptx') as ppt:
        for i,slide in enumerate(data['slides'],1):
            assert slide['number']==i and slide['image']==f'slides/slide-{i:02d}.webp'
            slide['notes']=note_from_ppt(ppt,i)
            assert len(slide['notes'])>150, 'Teaching notes incomplete'
            slide['illustration']=('Imagen cinematográfica generada con IA: representación conceptual, no fotografía documental.'
                                   if i in (1,4,6,14,15,22,32)
                                   else 'Gráficos y diagramas didácticos: no son mediciones independientes.')
            slide['source_ids']=[]
            for url in slide.pop('sources',[]):
                if url not in registry:
                    host=urlparse(url).hostname or ''
                    labels={
                     'hai.stanford.edu':'Stanford HAI · AI Index 2026',
                     'ifr.org':'International Federation of Robotics · World Robotics 2026',
                     'iea.org':'International Energy Agency · Global EV Outlook 2026',
                     'collegeai.tsinghua.edu.cn':'Tsinghua University · College of AI',
                     'english.ia.ac.cn':'Chinese Academy of Sciences · Institute of Automation',
                     'shlab.org.cn':'Shanghai AI Laboratory',
                     'cppcc.gov.cn':'CPPCC · Documento institucional chino',
                     'ndrc.gov.cn':'NDRC · Documento de planificación china',
                    }
                    title=next((label for domain,label in labels.items() if host.endswith(domain)),host)
                    registry[url]=('ref'+str(len(registry)+1).zfill(2),title)
                slide['source_ids'].append(registry[url][0])
    data['source_registry']={id:{'url':url,'title':title,'kind':'Informe académico o fuente institucional','date':'corte documental 2026-10-20'} for url,(id,title) in registry.items()}
    data['subtitle']='La base material, científica y humana de la revolución tecnológica china'
    data['attribution']=data.pop('author','Material elaborado por el profesor Sergio Gevatschnaider')
    data['illustrations']=data.pop('notice','Ilustraciones conceptuales, no fotografías documentales.')
    path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    return data

def source_page(data):
    s=['<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
       '<title>La infraestructura · Fuentes y notas</title><link rel="stylesheet" href="viewer.css"></head><body>',
       '<header class="site-header"><a class="back" href="./">← Volver al visor</a></header>',
       '<main class="source-register"><div class="eyebrow">La infraestructura — 基础设施</div><h1>Fuentes y notas por diapositiva</h1>',
       '<p>Material elaborado por el profesor Sergio Gevatschnaider · 20 de octubre de 2026.</p>',
       '<p>Atención metodológica: no equiparar artículos muy citados con modelos notables, instalaciones de robots industriales con humanoides ni producción de automóviles con exportaciones. Las ilustraciones de ciudades, fábricas y laboratorios son conceptuales.</p>']
    for slide in data['slides']:
        s.extend([f'<section id="slide-{slide["number"]}"><h2>{slide["number"]:02d} · {escape(slide["title"])}</h2>',
                  f'<p><strong>{escape(slide["chapter"])}</strong></p><p>{escape(slide["illustration"])}</p>',
                  '<pre style="white-space:pre-wrap;font:inherit">'+escape(slide['notes'])+'</pre>'])
        if slide['source_ids']:
            s.append('<ul>')
            for key in slide['source_ids']:
                ref=data['source_registry'][key]
                s.append(f'<li><a target="_blank" rel="noopener noreferrer" href="{escape(ref["url"],quote=True)}">{escape(ref["title"])}</a><small> · {escape(ref["url"])}</small></li>')
            s.append('</ul>')
        s.append('</section>')
    s.extend(['</main><footer><a href="./">Volver al visor</a> · <a href="../../index.html?lang=es#infraestructura">Página principal</a></footer></body></html>'])
    (DEST/'fuentes.html').write_text('\n'.join(s)+'\n',encoding='utf-8')

def main():
    chunks=sorted(PARTS.glob('parte-*.bin'))
    if chunks:
        assert len(chunks)==25 and [p.name for p in chunks]==[f'parte-{i:02d}.bin' for i in range(1,26)], 'Incomplete package'
        raw=b''.join(x.read_bytes() for x in chunks)
        assert hashlib.sha256(raw).hexdigest()==SHA256, 'Source package SHA256 mismatch'
        with ZipFile(io.BytesIO(raw)) as pkg:
            assert pkg.testzip() is None,'Corrupted ZIP'
            assert set(pkg.namelist())==EXPECTED, 'Unexpected package contents'
            for name in sorted(EXPECTED):
                target=DEST/name;target.parent.mkdir(parents=True,exist_ok=True)
                target.write_bytes(pkg.read(name))
        data=enhance_metadata();source_page(data)
        print('Infrastructure package restored, 32 images, PPTX, PDF, metadata, notes and references.')
    else:
        assert all((DEST/x).is_file() for x in EXPECTED|{'fuentes.html'}), 'Neither package chunks nor restored files present'
        print('Infrastructure materials already present; no extraction needed.')
if __name__=='__main__':main()
