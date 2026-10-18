#!/usr/bin/env python3
"""Verify all 47 slides in the viewer, PDF and PowerPoint for both languages."""
import json
import re
from pathlib import Path
from zipfile import ZipFile
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1] / "materiales/transformacion-industrial"
EXPECTED = set(range(1, 48))

for directory, stem in ((ROOT, "presentacion"), (ROOT / "en", "presentation")):
    language = "en" if directory.name == "en" else "es"
    entries = json.loads((directory / "slides.json").read_text(encoding="utf-8"))["slides"]
    assert len(entries) == 47, f"{language}: expected 47 indexed slides"
    assert {x["number"] for x in entries} == EXPECTED, f"{language}: missing indexed slides"
    for entry in entries:
        image = directory / entry["image"]
        assert image.is_file() and image.stat().st_size > 0, f"{language}: missing or empty slide {entry['number']}: {image}"
        assert entry["title"] and entry["text"] and entry["notes"], f"{language}: incomplete slide metadata {entry['number']}"

    pptx = directory / f"{stem}.pptx"
    with ZipFile(pptx) as archive:
        slide_numbers = {
            int(match.group(1))
            for name in archive.namelist()
            if (match := re.fullmatch(r"ppt/slides/slide(\d+)\.xml", name))
        }
        assert slide_numbers == EXPECTED, f"{language}: PowerPoint slide set incomplete: {sorted(slide_numbers)}"
        assert archive.testzip() is None, f"{language}: damaged PowerPoint archive"

    pdf = directory / f"{stem}.pdf"
    reader = PdfReader(str(pdf))
    assert not reader.is_encrypted, f"{language}: encrypted PDF"
    assert len(reader.pages) == 47, f"{language}: PDF contains {len(reader.pages)} pages, expected 47"
    for index in (0, 6, 23, 46):
        assert reader.pages[index].mediabox.width > 0, f"{language}: invalid PDF page {index+1}"
        assert reader.pages[index].mediabox.height > 0, f"{language}: invalid PDF page {index+1}"
    print(f"{language.upper()}: viewer 47/47, PowerPoint 47/47, PDF 47/47; selected PDF pages readable")

print("Bilingual PowerPoint, PDF and viewer integrity passed.")
