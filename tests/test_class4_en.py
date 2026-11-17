"""Regression checks for full-page slides and non-cascading translation."""
import importlib.util
from pathlib import Path
import tempfile
import unittest

from PIL import Image
from pypdf import PdfReader

spec = importlib.util.spec_from_file_location("builder", Path(__file__).resolve().parents[1] / "scripts/build_class4_en.py")
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)


class EnglishBuilderTests(unittest.TestCase):
    def test_full_page_images_have_one_uncropped_16_9_page_each(self):
        with tempfile.TemporaryDirectory() as directory:
            paths=[]
            for i,color in enumerate(("red", "blue", "green")):
                path=Path(directory)/f"{i}.png"
                Image.new("RGB",(1600,900),color).save(path)
                paths.append(path)
            pdf=builder.build_pdf(paths,Path(directory)/"slides.pdf")
            pages=PdfReader(pdf).pages
            self.assertEqual(len(pages),3)
            for page,path in zip(pages,paths):
                self.assertEqual(list(page.mediabox),[0,0,960,540])
                self.assertEqual(len(page.images),1)
                self.assertEqual(page.images[0].image.size,(1600,900))
                # Drawing covers the whole page at the origin, with no crop.
                operations=page.get_contents().operations
                matrices=[list(args) for args,op in operations if op==b"cm"]
                self.assertIn([960,0,0,540,0,0],matrices)
                self.assertFalse(any(op in (b"W",b"W*") for _,op in operations))
                self.assertEqual(page.images[0].image.convert("RGB").tobytes(),Image.open(path).tobytes())

    def test_non_widescreen_image_is_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            path=Path(directory)/"square.png"
            Image.new("RGB",(100,100)).save(path)
            with self.assertRaisesRegex(ValueError,"16:9"):
                builder.build_pdf([path],Path(directory)/"slides.pdf")

    def test_translation_preserves_code_and_already_translated_words(self):
        mapping={"con":"with","min/u":"min/unit","congestión":"congestion","Constante":"Constant"}
        source='const x="congestión con min/u"; // congestion, content, min/unit'
        self.assertEqual(builder.translate_text(source,mapping),'const x="congestion with min/unit"; // congestion, content, min/unit')


if __name__=="__main__":
    unittest.main()
