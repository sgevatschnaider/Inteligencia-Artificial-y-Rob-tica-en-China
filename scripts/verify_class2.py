#!/usr/bin/env python3
"""Verify class 2 content, bilingual readers and download integrity."""
import json,re
from pathlib import Path
from zipfile import ZipFile
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[1]
MODULE=ROOT/'materiales/clase-2'
data=json.loads((MODULE/'src/catalog.json').read_text(encoding='utf-8'))
embedded=(MODULE/'data.js').read_text(encoding='utf-8').strip()
assert embedded.startswith('window.COURSE_DATA=')
assert json.loads(embedded[len('window.COURSE_DATA='):].removesuffix(';'))==data
names={'agents':{'es':'Fundamentos_Agentes_ES_Superior','en':'Intelligent_Agents_EN_Superior'},'china':{'es':'China_Modelos_Agentes_Robotica_ES_Superior','en':'China_Models_Agents_Robotics_EN_Superior'}}
for key,count in [('agents',22),('china',46)]:
 slides=data[key];assert [s['n'] for s in slides]==list(range(1,count+1))
 for lang in ['es','en']:
  for slide in slides:
   for field in ['title','subtitle','notes']:assert slide[field][lang].strip(),(key,slide['n'],field,lang)
   for item in slide['items']:assert item['label'][lang] and item['body'][lang]
   for source in slide['sources']:assert source in data['sources']
   im=MODULE/'slides'/f'{key}-{lang}'/f"{slide['n']:02}.webp";assert im.stat().st_size>100
  with ZipFile(MODULE/'downloads'/f'{names[key][lang]}.pptx') as z:
   assert z.testzip() is None
   assert len([n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+.xml',n)])==count
   assert len([n for n in z.namelist() if re.fullmatch(r'ppt/notesSlides/notesSlide\d+.xml',n)])==count
   if key=='china':
    assert any(re.fullmatch(r'ppt/(?:slides/)?charts/chart\d+.xml',n) for n in z.namelist())
    assert any(n.endswith('.xlsx') for n in z.namelist())
  assert len(PdfReader(MODULE/'downloads'/f'{names[key][lang]}.pdf').pages)==count
  print(key,lang,count,'slides, notes, images and PDF pages: OK')
for file in ['index.html','reader.html','lab.html','videos.html','guide.html','sources.html','model.js','lab.js','common.js','reader.js','videos.js','theme.css','home.css','downloads/Simulador_Clase_2_Superior.html']:
 assert (MODULE/file).is_file(),file
home=(ROOT/'index.html').read_text(encoding='utf-8');assert home.count('id="clase-2"')==1
assert 'data-class2-cover' in home and 'data-class2-path' in home
assert (ROOT/'ABRIR_SITIO.html').is_file()
print('Class 2 integrated module: PASS')
