#!/usr/bin/env python3
"""Verify the 32-slide Infrastructure module's files, native text and synchronized notes."""
import json
import re
from collections import Counter
from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as ET
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[1]
MODULE=ROOT/'materiales/infraestructura'
DATA=json.loads((MODULE/'slides.json').read_text(encoding='utf-8'))
NS={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
ATTR='Material elaborado por el profesor Sergio Gevatschnaider'
compact=lambda s:re.sub(r'\s+','',s)
assert len(DATA['slides'])==32
assert [s['number'] for s in DATA['slides']]==list(range(1,33))
assert DATA['attribution']==ATTR
with ZipFile(MODULE/'presentacion.pptx') as deck:
    slide_parts=[p for p in deck.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',p)]
    assert len(slide_parts)==32
    presentation=ET.fromstring(deck.read('ppt/presentation.xml'))
    size=presentation.find('p:sldSz',NS)
    assert abs(int(size.get('cx'))/int(size.get('cy'))-16/9)<0.0001
    for slide in DATA['slides']:
        n=slide['number']
        xml=ET.fromstring(deck.read(f'ppt/slides/slide{n}.xml'))
        texts=xml.findall('.//a:t',NS)
        native=''.join(t.text or '' for t in texts)
        assert ATTR in native,f'Attribution missing from native slide {n}'
        assert len(texts)>5,f'Slide {n} became a single screenshot'
        native_blocks=[''.join(t.text or '' for t in sp.findall('.//a:t',NS)) for sp in xml.findall('.//p:sp',NS)]
        assert Counter(compact(t) for t in slide['text'] if t.strip())==Counter(compact(t) for t in native_blocks if t.strip()),f'Transcript differs from native slide {n}'
        assert all(int(e.get('cx','0'))>=0 and int(e.get('cy','0'))>=0 for e in xml.findall('.//a:xfrm/a:ext',NS)),f'Negative geometry on slide {n}'
        notes=ET.fromstring(deck.read(f'ppt/notesSlides/notesSlide{n}.xml'))
        body=next(sp for sp in notes.findall('.//p:sp',NS) if sp.find('p:nvSpPr/p:nvPr/p:ph',NS) is not None and sp.find('p:nvSpPr/p:nvPr/p:ph',NS).get('type')=='body')
        note_text='\n'.join(''.join(t.text or '' for t in p.findall('.//a:t',NS)) for p in body.findall('p:txBody/a:p',NS))
        assert note_text==slide['notes'],f'Notes out of sync on slide {n}'
        assert len(slide['notes'].split())>100,f'Incomplete teaching notes on slide {n}'
        assert slide['source_ids'] and all(i in DATA['source_registry'] for i in slide['source_ids'])
        image=MODULE/slide['image']
        assert image.is_file() and image.stat().st_size>1000,f'Empty or missing image for slide {n}'
        assert image.read_bytes()[:4]==b'RIFF',f'Invalid WebP header for slide {n}'
    cover=deck.read('ppt/slides/slide1.xml').decode()
    assert '基础设施' in cover
    assert not any('service-robots-on-the-rise-worldwide' in deck.read(p).decode() for p in deck.namelist() if p.endswith('.rels'))
pdf=PdfReader(MODULE/'presentacion.pdf')
assert len(pdf.pages)==32
for n,page in enumerate(pdf.pages,1):
    assert abs(float(page.mediabox.width)/float(page.mediabox.height)-16/9)<0.001
    text=page.extract_text() or ''
    assert compact(ATTR) in compact(text),f'PDF attribution missing on page {n}'
    assert len(text)>180,f'PDF text is not selectable on page {n}'
assert '基础设施' in pdf.pages[0].extract_text()
assert len(pdf.pages[29].get('/Annots',[]))>=5
assert len(pdf.pages[30].get('/Annots',[]))>=5
print('Infrastructure files verified: 32 editable slides, 32 PDF pages, Chinese text, exact attribution, synchronized transcripts/notes, bibliography links and valid geometry.')
