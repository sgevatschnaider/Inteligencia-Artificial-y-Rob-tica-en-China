#!/usr/bin/env python3
"""Verify the Dragon module and its authored files without altering legacy decks."""
import json,re,sys,zipfile
from pathlib import Path
from xml.etree import ElementTree as ET
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[1]; D=ROOT/'materiales/dragon'
author='Material elaborado por el profesor Sergio Gevatschnaider'
data=json.loads((D/'slides.json').read_text()); slides=data['slides']
assert len(slides)==10 and [s['number'] for s in slides]==list(range(1,11))
assert data['language']=='es' and data['updated']=='2026-10-20'
for slide in slides:
 assert (D/slide['image']).is_file(),slide['image']
 assert len(slide['notes'].split())>180,slide['number']
 assert slide['source_ids'] and all(i in data['source_registry'] for i in slide['source_ids'])
 assert slide['sources']==[data['source_registry'][i]['url'] for i in slide['source_ids']]
 assert slide['illustration'] and all(u.startswith('https://') for u in slide['sources'])
with zipfile.ZipFile(D/'presentacion.pptx') as z:
 names=[n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)]
 assert len(names)==10
 ns={'a':'http://schemas.openxmlformats.org/drawingml/2006/main'}
 for n in range(1,11):
  slide=ET.fromstring(z.read(f'ppt/slides/slide{n}.xml'))
  text=' '.join(el.text or '' for el in slide.findall('.//a:t',ns))
  assert author in text,(n,'attribution')
  if n==1: assert '龙' in text and ord('龙')==0x9f99
  notes=ET.fromstring(z.read(f'ppt/notesSlides/notesSlide{n}.xml'))
  note_text=' '.join(el.text or '' for el in notes.findall('.//a:t',ns))
  assert 'Objetivo pedagógico' in note_text and 'https://' in note_text
  assert 'Ilustración conceptual' in note_text
 core=z.read('docProps/core.xml').decode();assert 'Sergio Gevatschnaider' in core
pdf=PdfReader(D/'presentacion.pdf');assert len(pdf.pages)==10
for i,p in enumerate(pdf.pages):
 text=p.extract_text();assert author in text,(i+1,'PDF attribution')
 assert abs(float(p.mediabox.width)/float(p.mediabox.height)-16/9)<.001
assert '龙' in pdf.pages[0].extract_text()
home=(ROOT/'index.html').read_text();assert home.index('id="dragon"')<home.index('id="transformacion-industrial"')
assert home.index('id="intro-video"')<home.index('id="dragon"')
assert 'data-dragon-link' in home and 'English viewer interface' in home
print('Dragon verification passed: 10 editable slides, 10 PDF pages, Unicode 龙, attribution, notes and source mappings.')
