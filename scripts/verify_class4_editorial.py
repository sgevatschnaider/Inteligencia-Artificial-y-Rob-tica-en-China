#!/usr/bin/env python3
"""Validate source lineage, editable packages and bilingual editorial publication."""
import hashlib
import json
from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as ET
from PIL import Image
from pptx import Presentation
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'materiales/clase-4'
def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()

def verify(module):
    folder=BASE/f'ppt-{module}';meta=json.loads((folder/'editorial-build.json').read_text())
    assert digest(ROOT/'scripts/render_class4_editorial.mjs')==meta['renderer_sha256'],'Renderer changed: regenerate editorial module '+str(module)
    source=[];results=[]
    for lang in ['es','en']:
        info=meta['languages'][lang];data=json.loads((ROOT/info['source']).read_text());source.append(data)
        assert digest(ROOT/info['source'])==info['source_sha256']
        assert digest(ROOT/info['pptx'])==info['pptx_sha256']
        for artifact in info['artifacts']:
            p=ROOT/artifact['path'];assert p.stat().st_size==artifact['bytes'],p
            assert digest(p)==artifact['sha256'],p
        prs=Presentation(ROOT/info['pptx']);n=len(data['slides']);assert len(prs.slides)==n
        assert prs.slide_width*9==prs.slide_height*16
        with ZipFile(ROOT/info['pptx']) as z:
            assert z.testzip() is None
            for name in z.namelist():
                if name.endswith('.xml'):ET.fromstring(z.read(name))
        for slide,sd in zip(prs.slides,data['slides']):
            assert len(sd['notes'].split())>=70,(module,lang,sd['number'],'Notes too short')
            actual=slide.notes_slide.notes_text_frame.text
            assert sd['notes'] in actual,(module,lang,sd['number'],'Speaker notes differ')
            assert sd['title'] in '\n'.join(s.text for s in slide.shapes if s.has_text_frame)
            if sd['visual']['layout']=='chart':assert any(s.has_chart for s in slide.shapes)
            image=folder/sd['image']
            with Image.open(image) as im:assert im.width*9==im.height*16
        pdf=folder/('presentacion.pdf' if lang=='es' else 'presentation.en.pdf')
        pages=PdfReader(pdf).pages;assert len(pages)==n
        for page in pages:
            w,h=float(page.mediabox.width),float(page.mediabox.height);assert abs(w/h-16/9)<1e-5
            assert page.extract_text().strip(),'PDF unexpectedly contains an empty page'
        results.append({'module':module,'language':lang,'slides':n,'pdf_pages':n,'notes':n,'native_chart_slides':info['charts'],'source_hashes':'verified'})
    es,en=source;assert len(es['slides'])==len(en['slides'])
    for a,b in zip(es['slides'],en['slides']):
        assert a['number']==b['number'] and a['visual']['layout']==b['visual']['layout']
        if a['visual']['layout']=='chart':
            assert [x['values'] for x in a['visual']['series']]==[x['values'] for x in b['visual']['series']]
    return results

if __name__=='__main__':
    results=[]
    for i in range(1,5):
        if (BASE/f'ppt-{i}/editorial-build.json').exists():results+=verify(i)
    assert results,'No editorial presentations found'
    print(json.dumps(results,ensure_ascii=False))
