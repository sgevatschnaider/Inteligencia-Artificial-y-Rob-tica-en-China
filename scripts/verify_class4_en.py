#!/usr/bin/env python3
"""Independently reopen and validate the generated Class 4 English package."""
import hashlib
import json
from pathlib import Path
import re
import subprocess
import tempfile
from xml.etree import ElementTree
from zipfile import ZipFile

from PIL import Image
from pptx import Presentation
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/"materiales/clase-4"


def main():
    report=json.loads((ROOT/"qa/class4-en/manifest.json").read_text())
    for artifact in report["artifacts"]:
        path=ROOT/artifact["path"]
        assert path.stat().st_size==artifact["bytes"],path
        assert hashlib.sha256(path.read_bytes()).hexdigest()==artifact["sha256"],path
    assert len(report["artifacts"])==20
    modules=[]
    for module in range(1,5):
        folder=BASE/f"ppt-{module}"
        data=json.loads((folder/"slides.en.json").read_text())
        count=len(data['slides'])
        prs=Presentation(folder/"presentation.en.pptx")
        assert len(prs.slides)==count
        assert prs.slide_width*9==prs.slide_height*16
        with ZipFile(folder/"presentation.en.pptx") as archive:
            assert archive.testzip() is None
            for name in archive.namelist():
                if name.endswith(".xml"):
                    ElementTree.fromstring(archive.read(name))
        for slide,source in zip(prs.slides,data["slides"]):
            assert source["title"] in "\n".join(s.text for s in slide.shapes if s.has_text_frame)
            notes=(source["notes"]+"\n\nSources:\n"+"\n".join(source.get("sources",[]))).strip()
            assert slide.notes_slide.notes_text_frame.text.strip()==notes
        pages=PdfReader(folder/"presentation.en.pdf").pages
        assert len(pages)==count
        for page in pages:
            assert list(page.mediabox)==[0,0,960,540]
            if data.get('editorial_version')!=2:
                assert len(page.images)==1
                assert page.images[0].image.size==(1600,900)
                operations=page.get_contents().operations
                assert [960,0,0,540,0,0] in [list(a) for a,op in operations if op==b"cm"]
                assert not any(op in (b"W",b"W*") for _,op in operations)
        with Image.open(BASE/f"covers/module-{module}.png") as cover:
            assert cover.size==(1600,900)
            cover.verify()
        modules.append({"module":module,"slides":count,"pdf_pages":len(pages),"speaker_notes":count})
    # Syntax-check all translated inline scripts and the external SDV script.
    for path in BASE.glob("ppt-*/lab*.en.html"):
        html=path.read_text()
        assert '<html lang="en"' in html,path
        for script in re.findall(r'<script\b[^>]*>(.*?)</script>',html,flags=re.S):
            with tempfile.NamedTemporaryFile(suffix=".js",mode="w") as temporary:
                temporary.write(script);temporary.flush()
                subprocess.run(["node","--check",temporary.name],check=True,capture_output=True,text=True)
    subprocess.run(["node","--check",str(BASE/"ppt-1/sdv.en.js")],check=True)
    guide=PdfReader(BASE/"guide-audiovisual.en.pdf")
    text="\n".join(page.extract_text() for page in guide.pages)
    assert "Videos for Exploring the Industrial Frontier" in " ".join(text.split())
    links=[]
    for page in guide.pages:
        for annotation in page.get("/Annots",[]):
            action=annotation.get_object().get("/A",{})
            if action.get("/URI"):
                links.append(action["/URI"])
    videos=json.loads((BASE/"videos.en.json").read_text())
    assert sorted(links)==sorted(video["url"] for video in videos)
    print(json.dumps({"modules":modules,"manifest_artifacts":20,"lab_scripts":"valid","audiovisual_guide_pages":len(guide.pages),"audiovisual_links":len(links)}))


if __name__=="__main__":
    main()
