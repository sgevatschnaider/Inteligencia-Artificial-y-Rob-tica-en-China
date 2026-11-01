#!/usr/bin/env python3
"""Verify the incremental class 3 collection and its bilingual teaching assets."""
from pathlib import Path
import json,zipfile,xml.etree.ElementTree as ET,re
from pypdf import PdfReader
R=Path(__file__).resolve().parents[1];M=R/'materiales/clase-3';B=M/'ppt-1'
modules=json.loads((M/'modules.json').read_text());assert modules[0]['id']=='ppt-1'
data=json.loads((B/'catalog.json').read_text());videos=json.loads((B/'videos.json').read_text());assert len(videos)==5
for l in ['es','en']:
 assert len(data[l])==35
 for i,s in enumerate(data[l],1):
  assert s['number']==i and s['notes'] and s['text'];p=B/s['image'];assert p.is_file() and p.stat().st_size>100
 p=B/f'downloads/China_Tecnologica_PPT1_{l.upper()}.pptx'
 with zipfile.ZipFile(p) as z:
  slides=[n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+.xml',n)];assert len(slides)==35
  notes=[n for n in z.namelist() if re.fullmatch(r'ppt/notesSlides/notesSlide\d+.xml',n)];assert len(notes)==35
  for name in slides:
   x=ET.fromstring(z.read(name))
   for node in x.iter():
    if node.tag.endswith('}ext'):assert int(node.attrib.get('cx',0))>=0 and int(node.attrib.get('cy',0))>=0
 assert len(PdfReader(B/f'downloads/China_Tecnologica_PPT1_{l.upper()}.pdf').pages)==35
assert all(1<=s<=35 for v in videos for s in v['slides'])
es=(B/'lab.html').read_text();en=(B/'lab-en.html').read_text()
assert re.findall(r'data:image/[^\"\')]+',es)==re.findall(r'data:image/[^\"\')]+',en),'Embedded visual asset differs across translations'
assert 'window.PPT1_DATA=' in (B/'data.js').read_text()
print('Class 3 files verified: 70 views, 70 slide and notes parts, 70 PDF pages, video associations and intact embedded images.')
