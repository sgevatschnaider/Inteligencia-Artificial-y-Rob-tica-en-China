#!/usr/bin/env python3
"""Validate the bilingual repository without third-party dependencies."""

from __future__ import annotations

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
MARKDOWN_LINK = re.compile(r"!?(?:\[[^\]]*\])\(([^)]+)\)")
FORBIDDEN = (
    "your-username",
    "Your Name",
    "htmlpreview.github.io",
    "raw.githack.com",
    "Aquí tienes el código Markdown listo",
    "Entiendo perfectamente lo que sucede",
)
BILINGUAL_RESOURCES = {
    "Introducción robótica en China.html",
    "IA_Automoviles_China.html",
    "IA_Salud_China.html",
    "Capital Robótico vs Capital Común — Efecto del Data Flywheel.html",
    "Capital Robótico vs. Capital Común_Teoría.html",
    "Data Flywheel (U→D→Q→U).html",
    "Datos Comparativos sobre Robótica.html",
    "Robot_datos_sinteticos.html",
    "Panorama_Industrial_2026.html",
    "Simulacion_dataflywheel.html",
    "Simulador Data Flywheel Componentes.html",
}
PAGE_DICTIONARIES = {
    "Introducción robótica en China.html": "i18n-introduccion.js",
    "IA_Automoviles_China.html": "i18n-automoviles.js",
    "IA_Salud_China.html": "i18n-salud.js",
}


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.html_lang: str | None = None
        self.has_title = False
        self.links: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag == "html":
            self.html_lang = values.get("lang")
        elif tag == "title":
            self.has_title = True
        elif tag in {"a", "link", "script", "img", "object"}:
            value = values.get("href") or values.get("src") or values.get("data")
            if value:
                self.links.append(value)


def local_target(source: Path, raw_link: str) -> Path | None:
    link = raw_link.strip().strip("<>")
    if not link or link.startswith("#"):
        return None
    parsed = urlsplit(link)
    if parsed.scheme or parsed.netloc:
        return None
    path = unquote(parsed.path)
    if not path:
        return None
    return (source.parent / path).resolve()


def validate_markdown(errors: list[str]) -> None:
    for source in ROOT.rglob("*.md"):
        text = source.read_text(encoding="utf-8")
        for forbidden in FORBIDDEN:
            if forbidden in text:
                errors.append(f"{source.relative_to(ROOT)} contains forbidden text: {forbidden}")
        for match in MARKDOWN_LINK.finditer(text):
            target = local_target(source, match.group(1).split()[0])
            if target is not None and not target.exists():
                errors.append(
                    f"{source.relative_to(ROOT)} links to missing file: "
                    f"{target.relative_to(ROOT) if target.is_relative_to(ROOT) else target}"
                )


def validate_html(errors: list[str]) -> None:
    resource_count = 0
    for source in ROOT.rglob("*.html"):
        text = source.read_text(encoding="utf-8")
        parser = PageParser()
        parser.feed(text)
        if not parser.html_lang:
            errors.append(f"{source.relative_to(ROOT)} has no html lang attribute")
        if not parser.has_title:
            errors.append(f"{source.relative_to(ROOT)} has no title element")
        if source.parent.name == "recursos":
            resource_count += 1
            if "Portada bilingüe / Bilingual home" not in text:
                errors.append(f"{source.relative_to(ROOT)} lacks the bilingual navigation banner")
            if source.name in BILINGUAL_RESOURCES:
                if '<script src="i18n.js"></script>' not in text:
                    errors.append(f"{source.relative_to(ROOT)} lacks the bilingual language controller")
                if "Recurso bilingüe ES/EN" not in text:
                    errors.append(f"{source.relative_to(ROOT)} is not labelled ES/EN")
                page_dictionary = PAGE_DICTIONARIES.get(source.name)
                if page_dictionary and f'<script src="{page_dictionary}"></script>' not in text:
                    errors.append(f"{source.relative_to(ROOT)} lacks its page translation dictionary")
        for raw_link in parser.links:
            target = local_target(source, raw_link)
            if target is not None and not target.exists():
                errors.append(f"{source.relative_to(ROOT)} links to missing file: {raw_link}")
    if resource_count != 11:
        errors.append(f"Expected 11 HTML resources, found {resource_count}")


def validate_required_files(errors: list[str]) -> None:
    required = (
        "README.md",
        "README.es.md",
        "README.en.md",
        "CONTRIBUTING.md",
        "CITATION.cff",
        "LICENSE",
        "LICENSE-CONTENT.md",
        "index.html",
        "docs/es/fuentes.md",
        "docs/en/sources.md",
        "recursos/README.md",
        "recursos/i18n.js",
        "resources/README.md",
    )
    for relative in required:
        if not (ROOT / relative).is_file():
            errors.append(f"Required file is missing: {relative}")


def main() -> int:
    errors: list[str] = []
    validate_required_files(errors)
    validate_markdown(errors)
    validate_html(errors)
    module = ROOT / "materiales/transformacion-industrial"
    for name in ("index.html", "viewer.js", "viewer.css", "presentacion.pptx", "presentacion.pdf", "slides.json"):
        if not (module / name).is_file():
            errors.append(f"Presentation module is missing: {name}")
    if (module / "slides.json").is_file():
        slides = json.loads((module / "slides.json").read_text(encoding="utf-8"))["slides"]
        if [slide["number"] for slide in slides] != list(range(1, 48)):
            errors.append("Expected 47 presentation slides in order")
        for slide in slides:
            if not (module / slide["image"]).is_file():
                errors.append(f"Missing slide image: {slide['image']}")
    if errors:
        print("Repository validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1
    print("Repository validation passed: bilingual structure, local links, and HTML entry points are valid.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
