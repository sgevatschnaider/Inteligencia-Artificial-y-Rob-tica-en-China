#!/usr/bin/env python3
"""Audit Infrastructure: original slides/PDF, correspondence, notes and sourced viewer."""
import json,re
from collections import Counter
from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as ET
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[1]
D=ROOT/'materiales/infraestructura'
DATA=json.loads((D/'slides.json').read_text(encoding='utf-8'))
NS={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
ATTR='Material elaborado por el profesor Sergio Gevatschnaider'
assert DATA['attribution']==ATTR
assert len(DATA['slides'])==32
assert [x['number'] for x in DATA['slides']]==list(range(1,33))
assert [x['image'] for x in DATA['slides']]==[f'slides/slide-{n:02d}.webp' for n in range(1,33)]
with ZipFile(D/'presentacion.pptx') as ppt:
    slides=[name for name in ppt.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',name)]
    assert len(slides)==32,'PowerPoint must retain 32 native slides'
    assert len([name for name in ppt.namelist() if re.fullmatch(r'ppt/notesSlides/notesSlide\d+\.xml',name)])==32
    for item in DATA['slides']:
        n=item['number']
        slide=ET.fromstring(ppt.read(f'ppt/slides/slide{n}.xml'))
        texts=' '.join(node.text or '' for node in slide.findall('.//a:t',NS))
        assert ATTR in texts,f'Author attribution is missing from slide {n}'
        assert len(slide.findall('.//a:t',NS))>4,f'Slide {n} is not an editable native slide'
        notes=ET.fromstring(ppt.read(f'ppt/notesSlides/notesSlide{n}.xml'))
        body=next(sp for sp in notes.findall('.//p:sp',NS) if (sp.find('p:nvSpPr/p:nvPr/p:ph',NS) is not None and sp.find('p:nvSpPr/p:nvPr/p:ph',NS).get('type')=='body'))
        actual='\n'.join(''.join(t.text or '' for t in par.findall('.//a:t',NS)) for par in body.findall('p:txBody/a:p',NS)).strip()
        assert actual==item['notes'],f'Viewer notes differ from original PowerPoint on slide {n}'
        assert len(item['notes'])>150
        assert item['title'] and item['chapter'] and item['text']
        assert isinstance(item['source_ids'],list)
        assert all(key in DATA['source_registry'] for key in item['source_ids'])
        img=D/item['image']
        assert img.is_file() and img.stat().st_size>1000
        assert img.read_bytes()[:4]==b'RIFF',f'Invalid image on slide {n}'
        for p in slide.findall('.//a:xfrm/a:ext',NS):
            assert int(p.get('cx','0'))>=0 and int(p.get('cy','0'))>=0
    assert '基础设施' in ppt.read('ppt/slides/slide1.xml').decode()
pdf=PdfReader(D/'presentacion.pdf')
assert len(pdf.pages)==32
for n,p in enumerate(pdf.pages,1):
    assert abs(float(p.mediabox.width)/float(p.mediabox.height)-16/9)<0.001
    text=p.extract_text() or ''
    assert len(text)>250,f'PDF text not selectable on page {n}'
    assert ATTR in text,f'PDF author not found on page {n}'
assert '基础设施' in pdf.pages[0].extract_text()
assert len(pdf.pages[29].get('/Annots',[]))>=5, 'Slide 30 bibliography links missing'
assert len(pdf.pages[30].get('/Annots',[]))>=5, 'Slide 31 bibliography links missing'
assert (D/'fuentes.html').is_file() and (D/'fuentes.html').stat().st_size>2500
assert 'id="infraestructura"' in (ROOT/'index.html').read_text()
assert 'data-infraestructura-link' in (ROOT/'index.html').read_text()
print('Infrastructure validated: 32 editable slides, 32 PDF pages, original 32 sets of teaching notes, 32 WebPs, sources and links.')
