#!/usr/bin/env python3
"""Build the English Class 4 package: editable PPTX, PDF decks, covers and translated labs."""
from __future__ import annotations
import hashlib, json, math, os, re, textwrap
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (SimpleDocTemplate, BaseDocTemplate, PageTemplate, Frame,
    Flowable, Paragraph, Spacer, PageBreak, KeepTogether, HRFlowable)
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "materiales" / "clase-4"
BUILD = ROOT / ".build" / "class4-en"
MODULES = {1: ("ppt-1", 8), 2: ("ppt-2", 7), 3: ("ppt-3", 10), 4: ("ppt-4", 12)}
NAVY = "#071923"
PANEL = "#102b38"
PANEL2 = "#153746"
GOLD = "#efbd68"
CYAN = "#79d9ce"
WHITE = "#f2f6f7"
MUTED = "#b7cbd3"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"

def rgb(h):
    h=h.lstrip("#")
    return tuple(int(h[i:i+2],16) for i in (0,2,4))

def pil_font(size, bold=False, serif=False):
    path = FONT_SERIF if serif else (FONT_BOLD if bold else FONT_REG)
    try: return ImageFont.truetype(path, size)
    except OSError: return ImageFont.load_default()

def wrap(draw, text, font, max_width):
    words = str(text).split()
    lines, line = [], ""
    for word in words:
        test = (line + " " + word).strip()
        if draw.textbbox((0,0), test, font=font)[2] <= max_width or not line:
            line = test
        else:
            lines.append(line); line = word
    if line: lines.append(line)
    return lines

def draw_lines(draw, xy, text, font, fill, max_width, leading=None, max_lines=None):
    x,y=xy; leading=leading or int(font.size*1.32)
    lines=wrap(draw,text,font,max_width)
    if max_lines and len(lines)>max_lines:
        lines=lines[:max_lines]
        if lines:
            while draw.textbbox((0,0),lines[-1]+"…",font=font)[2]>max_width and len(lines[-1])>4:
                lines[-1]=lines[-1][:-2]
            lines[-1]+="…"
    for line in lines:
        draw.text((x,y),line,font=font,fill=fill)
        y += leading
    return y

def gradient_bg(w,h):
    im=Image.new("RGB",(w,h))
    px=im.load()
    top=rgb("#061722"); bottom=rgb("#0d2a39")
    for y in range(h):
        t=y/max(1,h-1)
        col=tuple(int(top[i]*(1-t)+bottom[i]*t) for i in range(3))
        for x in range(w): px[x,y]=col
    return im

def draw_cover(module, out):
    w,h=1600,900
    im=gradient_bg(w,h).convert("RGBA")
    glow=Image.new("RGBA",(w,h),(0,0,0,0)); gd=ImageDraw.Draw(glow)
    gd.ellipse((w*.12,h*.12,w*.82,h*.95),fill=(25,154,163,50))
    gd.ellipse((w*.48,h*.04,w*.98,h*.8),fill=(234,171,82,30))
    glow=glow.filter(ImageFilter.GaussianBlur(90)); im=Image.alpha_composite(im,glow)
    d=ImageDraw.Draw(im)
    # Fine grid and circuit traces
    for x in range(70,w,100): d.line((x,0,x,h),fill=(122,191,198,20),width=1)
    for y in range(70,h,100): d.line((0,y,w,y),fill=(122,191,198,18),width=1)
    gold=(239,189,104,235); cyan=(105,219,209,230); pale=(218,234,236,180)
    def line(points,fill=cyan,width=7): d.line(points,fill=fill,width=width,joint="curve")
    def node(x,y,r=13,fill=gold):
        d.ellipse((x-r,y-r,x+r,y+r),fill=fill,outline=(245,248,240,180),width=2)
    if module==1:
        # Factory hall
        d.polygon([(890,280),(1450,280),(1530,420),(1530,720),(840,720),(840,410)],fill=(15,45,59,235),outline=cyan)
        for x in range(930,1470,125):
            d.rectangle((x,360,x+72,610),outline=(100,191,201,130),width=5)
            d.line((x+36,360,x+36,610),fill=(100,191,201,80),width=3)
        # car silhouette
        d.ellipse((270,620,530,810),fill=(4,13,20,255),outline=gold,width=7)
        d.ellipse((820,620,1080,810),fill=(4,13,20,255),outline=gold,width=7)
        d.polygon([(170,610),(250,500),(490,440),(750,450),(890,560),(1000,590),(1050,650),(130,650)],fill=(17,69,86,245),outline=cyan)
        d.line([(290,510),(490,470),(720,480),(840,570)],fill=(204,232,233,220),width=8)
        d.line([(480,480),(455,585),(820,585),(745,480)],fill=(87,183,194,180),width=5)
        # robot arm
        line([(1320,240),(1230,330),(1310,420),(1200,500),(1150,560)],gold,18)
        for p in [(1320,240),(1230,330),(1310,420),(1200,500)]: node(*p,20,gold)
        # battery/circuit
        d.rounded_rectangle((95,190,340,315),radius=24,outline=cyan,width=7)
        d.rectangle((340,225,365,280),fill=cyan)
        for x in [145,205,265]: d.rectangle((x,220,x+30,285),fill=gold)
        line([(365,250),(480,250),(530,330)],cyan,6)
    elif module==2:
        # Network tower
        line([(400,650),(600,230),(800,650)],gold,12)
        line([(485,520),(715,520)],gold,8); line([(525,420),(675,420)],gold,8)
        for y in [330,430,530]:
            d.arc((500-y*.3,180-y*.25,800+y*.3,480+y*.45),200,340,fill=cyan,width=8)
        # qubit sphere
        d.ellipse((900,190,1450,740),outline=gold,width=10)
        d.ellipse((980,325,1370,605),outline=cyan,width=7)
        d.arc((1030,150,1330,780),80,280,fill=cyan,width=8)
        d.arc((1030,150,1330,780),260,100,fill=gold,width=8)
        node(1175,465,22,gold); node(1000,340,14,cyan); node(1370,580,14,cyan)
        for x,y in [(200,240),(300,180),(1300,160),(1430,760),(820,760)]:
            node(x,y,12,gold); line([(x,y),(x+65,y-40),(x+120,y-40)],pale,3)
    elif module==3:
        # Brain network nodes
        brain=(330,190,970,700)
        d.arc(brain,180,350,fill=cyan,width=16); d.arc(brain,190,350,fill=gold,width=8)
        d.arc((440,180,1050,720),190,350,fill=cyan,width=12)
        d.arc((520,250,930,680),0,180,fill=gold,width=8)
        pts=[(420,390),(520,300),(640,360),(760,270),(880,390),(770,520),(610,570),(470,520),(930,550)]
        for a,b in zip(pts,pts[1:]): line([a,b],(102,199,204,150),5)
        for x,y in pts: node(x,y,17,gold if x%2 else cyan)
        # DNA helix
        for y in range(190,720,18):
            t=(y-190)/530
            x1=1120+110*math.sin(t*math.pi*5)
            x2=1370-110*math.sin(t*math.pi*5)
            d.ellipse((x1-8,y-8,x1+8,y+8),fill=gold)
            d.ellipse((x2-8,y-8,x2+8,y+8),fill=cyan)
            if y%54<18: line([(x1,y),(x2,y)],pale,4)
        # molecule nodes
        for x,y in [(1180,150),(1450,250),(1330,740),(1080,770)]: node(x,y,18,gold)
    else:
        # Drone
        d.ellipse((360,310,560,510),outline=gold,width=10)
        d.ellipse((760,310,960,510),outline=gold,width=10)
        line([(460,410),(660,500),(860,410)],cyan,16)
        d.polygon([(520,480),(800,480),(740,590),(580,590)],fill=(20,72,89,240),outline=cyan)
        line([(660,500),(660,660)],gold,10)
        # satellite
        d.rectangle((1090,250,1320,430),outline=cyan,width=8)
        d.rectangle((900,280,1080,400),fill=(25,73,91,230),outline=gold,width=6)
        d.rectangle((1330,280,1510,400),fill=(25,73,91,230),outline=gold,width=6)
        for x in range(920,1080,35): d.line((x,280,x,400),fill=cyan,width=3)
        for x in range(1350,1510,35): d.line((x,280,x,400),fill=cyan,width=3)
        # solar + tokamak rings
        d.polygon([(120,650),(420,580),(530,720),(220,790)],fill=(19,60,76,220),outline=gold)
        for i in range(4): d.line((160+i*65,640-i*17,260+i*65,770-i*17),fill=cyan,width=4)
        for r in [90,125,160]:
            d.ellipse((760-r,650-r,760+r,650+r),outline=gold if r==125 else cyan,width=6)
        node(760,650,18,gold)
    # subtle bottom horizon
    d.line((0,840,w,840),fill=(239,189,104,80),width=2)
    im.convert("RGB").save(out,quality=94)
    return out

def rounded(draw, box, fill, outline=None, radius=22, width=2):
    draw.rounded_rectangle(box,radius=radius,fill=fill,outline=outline,width=width)

def render_slide_image(module, data, slide, cover_path, out):
    W,H=1600,900
    im=gradient_bg(W,H); d=ImageDraw.Draw(im)
    # Header and decorative rule
    d.rounded_rectangle((54,42,1546,858),radius=28,outline=(69,111,126),width=2)
    d.rounded_rectangle((82,75,94,126),radius=5,fill=rgb(GOLD))
    d.text((120,78),f"CHINA TECHNOLOGY  /  CLASS 4  /  MODULE {module:02d}",font=pil_font(21,True),fill=rgb(CYAN))
    d.text((1480,78),f"{slide['number']:02d} / {len(data['slides']):02d}",font=pil_font(21,True),fill=rgb(GOLD),anchor="ra")
    if slide["number"]==1:
        cover=Image.open(cover_path).convert("RGB").resize((700,394))
        im.paste(cover,(88,210))
        d=ImageDraw.Draw(im)
        d.text((850,205),data["short_title"].upper(),font=pil_font(20,True),fill=rgb(GOLD))
        y=250
        y=draw_lines(d,(850,y),slide["title"],pil_font(49,True,True),rgb(WHITE),650,58,3)
        y+=16
        y=draw_lines(d,(850,y),slide["subtitle"],pil_font(25),rgb(CYAN),630,34,3)
        y+=24
        for label,body in slide["items"][:2]:
            rounded(d,(850,y,1480,y+85),(16,49,63),outline=(77,132,145),radius=15,width=2)
            d.text((875,y+15),label,font=pil_font(20,True),fill=rgb(GOLD))
            draw_lines(d,(1085,y+15),body,pil_font(18),rgb(WHITE),365,24,2)
            y+=102
        rounded(d,(850,660,1480,750),(38,49,49),outline=(173,131,67),radius=16,width=2)
        draw_lines(d,(875,682),slide["takeaway"],pil_font(20,True),rgb(GOLD),570,28,2)
    else:
        y=165
        y=draw_lines(d,(88,y),slide["title"],pil_font(43,True,True),rgb(WHITE),1400,52,2)
        y+=10
        draw_lines(d,(90,y),slide["subtitle"],pil_font(23),rgb(CYAN),1380,31,2)
        cards=slide["items"]
        cols=2 if len(cards)>2 else len(cards)
        cols=max(1,cols); rows=math.ceil(len(cards)/cols)
        left=88; top=315; gap=24
        card_w=(1424-gap*(cols-1))/cols
        card_h=145 if rows==2 else 220
        for idx,(label,body) in enumerate(cards):
            row=idx//cols; col=idx%cols
            x=left+col*(card_w+gap); yy=top+row*(card_h+20)
            rounded(d,(int(x),int(yy),int(x+card_w),int(yy+card_h)),rgb(PANEL2),outline=(64,117,133),radius=18,width=2)
            d.rounded_rectangle((int(x+20),int(yy+22),int(x+28),int(yy+card_h-22)),radius=4,fill=rgb(GOLD if idx%2==0 else CYAN))
            d.text((int(x+52),int(yy+22)),label,font=pil_font(21,True),fill=rgb(GOLD))
            draw_lines(d,(int(x+52),int(yy+60)),body,pil_font(19),rgb(WHITE),int(card_w-85),27,3 if rows==2 else 5)
        take_y=top+rows*(card_h+20)+2
        if take_y>740: take_y=745
        rounded(d,(88,755,1510,815),(32,49,52),outline=(173,131,67),radius=14,width=2)
        draw_lines(d,(112,771),slide["takeaway"],pil_font(19,True),rgb(GOLD),1360,24,2)
    d=ImageDraw.Draw(im)
    d.text((90,830),"Prepared by Sergio Gevatschnaider",font=pil_font(16),fill=rgb(MUTED))
    d.text((1510,830),"ENGLISH EDITION · CLASS 4",font=pil_font(15,True),fill=rgb(MUTED),anchor="ra")
    im.save(out,optimize=True)
    return out

def add_text(slide, text, x, y, w, h, size=16, color=WHITE, bold=False, font_name="Aptos", align=None):
    box=slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf=box.text_frame; tf.clear(); tf.word_wrap=True
    tf.margin_left=Inches(.06); tf.margin_right=Inches(.06)
    tf.margin_top=Inches(.03); tf.margin_bottom=Inches(.02)
    p=tf.paragraphs[0]; p.text=str(text)
    p.font.name=font_name; p.font.size=Pt(size); p.font.bold=bold; p.font.color.rgb=RGBColor(*rgb(color))
    if align is not None: p.alignment=align
    return box

def add_rect(slide, x,y,w,h, fill, outline=None, radius=True):
    typ=MSO_SHAPE.ROUNDED_RECTANGLE if radius else MSO_SHAPE.RECTANGLE
    sh=slide.shapes.add_shape(typ,Inches(x),Inches(y),Inches(w),Inches(h))
    sh.fill.solid(); sh.fill.fore_color.rgb=RGBColor(*rgb(fill))
    sh.line.color.rgb=RGBColor(*rgb(outline or fill))
    sh.line.width=Pt(1)
    return sh

def build_pptx(module, data, cover_path, out):
    prs=Presentation()
    prs.slide_width=Inches(13.333); prs.slide_height=Inches(7.5)
    blank=prs.slide_layouts[6]
    for sd in data["slides"]:
        sl=prs.slides.add_slide(blank)
        bg=sl.background.fill; bg.solid(); bg.fore_color.rgb=RGBColor(*rgb(NAVY))
        add_rect(sl,.45,.35,12.43,6.8,NAVY,"#345061",False)
        add_rect(sl,.72,.62,.10,.42,GOLD,GOLD,False)
        add_text(sl,f"CHINA TECHNOLOGY  /  CLASS 4  /  MODULE {module:02d}",1.0,.58,8.7,.28,10,CYAN,True)
        add_text(sl,f"{sd['number']:02d} / {len(data['slides']):02d}",11.9,.58,.65,.28,10,GOLD,True,align=PP_ALIGN.RIGHT)
        if sd["number"]==1:
            sl.shapes.add_picture(str(cover_path),Inches(.75),Inches(1.55),width=Inches(5.95),height=Inches(3.35))
            add_text(sl,data["short_title"].upper(),7.05,1.45,5.3,.35,11,GOLD,True)
            add_text(sl,sd["title"],7.0,1.92,5.4,1.05,29,WHITE,True,"Aptos Display")
            add_text(sl,sd["subtitle"],7.05,3.05,5.2,.7,15,CYAN,False)
            y=3.95
            for label,body in sd["items"][:2]:
                add_rect(sl,7.05,y,5.2,.72,PANEL2,"#497587")
                add_text(sl,label,7.22,y+.10,1.35,.24,12,GOLD,True)
                add_text(sl,body,8.65,y+.10,3.42,.48,11,WHITE)
                y+=.82
            add_rect(sl,7.05,5.78,5.2,.78,"#26383b","#9b7945")
            add_text(sl,sd["takeaway"],7.23,5.94,4.82,.45,12,GOLD,True)
        else:
            add_text(sl,sd["title"],.78,1.18,11.8,.66,25,WHITE,True,"Aptos Display")
            add_text(sl,sd["subtitle"],.82,1.88,11.7,.52,13,CYAN)
            cards=sd["items"]; cols=2 if len(cards)>2 else max(1,len(cards))
            rows=math.ceil(len(cards)/cols); x0=.78; y0=2.62; gap=.20
            card_w=(11.78-gap*(cols-1))/cols
            card_h=1.43 if rows==2 else 2.05
            for i,(label,body) in enumerate(cards):
                row=i//cols; col=i%cols; x=x0+col*(card_w+gap); y=y0+row*(card_h+.18)
                add_rect(sl,x,y,card_w,card_h,PANEL2,"#497587")
                add_rect(sl,x+.18,y+.20,.06,card_h-.4,GOLD if i%2==0 else CYAN,GOLD if i%2==0 else CYAN,False)
                add_text(sl,label,x+.38,y+.18,card_w-.62,.32,12,GOLD,True)
                add_text(sl,body,x+.38,y+.58,card_w-.62,card_h-.68,11,WHITE)
            add_rect(sl,.78,6.34,11.78,.52,"#26383b","#9b7945")
            add_text(sl,sd["takeaway"],.98,6.45,11.35,.28,11,GOLD,True)
        add_text(sl,"Prepared by Sergio Gevatschnaider",.80,7.02,5.6,.22,8,MUTED)
        add_text(sl,"ENGLISH EDITION · CLASS 4",8.3,7.02,4.2,.22,8,MUTED,True,align=PP_ALIGN.RIGHT)
        try:
            notes=sl.notes_slide.notes_text_frame
            src="\n".join(sd.get("sources",[]))
            notes.text=(sd.get("notes","")+"\n\nSources:\n"+src).strip()
        except Exception:
            pass
    prs.save(out)
    check=Presentation(out)
    assert len(check.slides)==len(data["slides"]), f"Slide count mismatch in {out}"
    for s in check.slides:
        assert s.notes_slide.notes_text_frame.text.strip(), f"Missing speaker notes on slide in {out}"
    return out

class PageImage(Flowable):
    def __init__(self, path, width, height):
        super().__init__(); self.path=str(path); self.width=width; self.height=height
    def draw(self):
        self.canv.drawImage(self.path,0,0,width=self.width,height=self.height,preserveAspectRatio=False,mask="auto")

def build_pdf(slide_paths, out):
    page=(960,540)
    doc=SimpleDocTemplate(str(out),pagesize=page,leftMargin=0,rightMargin=0,topMargin=0,bottomMargin=0)
    story=[]
    for i,p in enumerate(slide_paths):
        if i: story.append(PageBreak())
        story.append(PageImage(p,page[0],page[1]))
    doc.build(story)
    assert len(PdfReader(str(out)).pages)==len(slide_paths), f"PDF page count mismatch: {out}"
    return out

def build_video_guide(videos, out):
    styles=getSampleStyleSheet()
    styles.add(ParagraphStyle(name="GuideTitle",parent=styles["Title"],fontName="Helvetica-Bold",fontSize=24,leading=28,textColor=colors.HexColor("#102b38"),spaceAfter=8))
    styles.add(ParagraphStyle(name="GuideSub",parent=styles["Normal"],fontSize=10,leading=14,textColor=colors.HexColor("#536b74"),spaceAfter=12))
    styles.add(ParagraphStyle(name="VideoTitle",parent=styles["Heading2"],fontSize=12,leading=15,textColor=colors.HexColor("#123d4b"),spaceBefore=9,spaceAfter=4))
    styles.add(ParagraphStyle(name="SmallBody",parent=styles["BodyText"],fontSize=9,leading=12,spaceAfter=4))
    styles.add(ParagraphStyle(name="Status",parent=styles["BodyText"],fontSize=8,leading=10,textColor=colors.HexColor("#7c5c27"),spaceAfter=3))
    doc=SimpleDocTemplate(str(out),pagesize=A4,rightMargin=17*mm,leftMargin=17*mm,topMargin=16*mm,bottomMargin=16*mm)
    story=[Paragraph("TECHNOLOGICAL CHINA · CLASS 4",styles["GuideSub"]),
           Paragraph("Videos for Exploring the Industrial Frontier",styles["GuideTitle"]),
           Paragraph("A curated bilingual companion to the four presentations. Twelve resources were checked as available on 15 November 2026. Four earlier links are retained as archive references and are clearly marked as unverified.",styles["GuideSub"]),
           Paragraph("<b>How to use this guide</b>",styles["Heading2"]),
           Paragraph("Each link opens the original publisher or video page. Resources are organized by the presentation they complement. Use the discussion question to connect the footage with the model and evidence in the slides.",styles["SmallBody"]),
           Spacer(1,5)]
    for module in range(1,5):
        story.append(Paragraph(f"MODULE {module}",styles["Heading1"]))
        for v in [x for x in videos if x["module"]==module]:
            status="VERIFIED RESOURCE" if v["status"]=="verified" else "ARCHIVE LINK · AVAILABILITY NOT VERIFIED"
            link=f'<link href="{v["url"]}" color="#0b7774">Open original resource ↗</link>'
            story.append(KeepTogether([
                Paragraph(v["title"],styles["VideoTitle"]),
                Paragraph(f"<b>{status}</b> · {v['origin']} · Slides {v['slides']}",styles["Status"]),
                Paragraph(v["description"],styles["SmallBody"]),
                Paragraph(f"<b>Discussion:</b> {v['question']}",styles["SmallBody"]),
                Paragraph(link,styles["SmallBody"]),
                HRFlowable(width="100%",thickness=.4,color=colors.HexColor("#d4dfdf"),spaceBefore=3,spaceAfter=4)
            ]))
        story.append(Spacer(1,7))
    story.append(Paragraph("Prepared by Sergio Gevatschnaider · English edition · November 2026",styles["SmallBody"]))
    doc.build(story)
    assert len(PdfReader(str(out)).pages)>=3
    return out

def translate_lab(source, target, translations, extra_links=True):
    text=source.read_text(encoding="utf-8")
    mapping={}
    mapping.update(translations.get("common",{}))
    key=source.name
    if source.name=="lab.html":
        parent=source.parent.name
        idx=int(parent.split("-")[-1])
        mapping={**translations.get("common",{}),**translations.get(f"lab{idx}",{})}
    elif source.name=="lab-sdv.html":
        mapping={**translations.get("common",{}),**translations.get("labSdv",{})}
    for src,dst in sorted(mapping.items(),key=lambda kv:len(kv[0]),reverse=True):
        text=text.replace(src,dst)
    text=text.replace('<html lang="es">','<html lang="en">').replace('<html lang="es"','<html lang="en"')
    text=text.replace('href="../index.html"','href="../index.en.html"')
    text=text.replace('href="index.html"','href="index.en.html"')
    text=text.replace('href="guide.html"','href="guide.en.html"')
    text=text.replace('href="../videos.html"','href="../videos.en.html"')
    text=text.replace('href="../guia-docente.html"','href="../teaching-guide.en.html"')
    text=text.replace('href="../../index.html"','href="../../index.html?lang=en"')
    text=text.replace("Instituto Confucio UBA","")
    text=text.replace(" ·  · "," · ")
    target.write_text(text,encoding="utf-8")
    return target

def make_outputs():
    BUILD.mkdir(parents=True,exist_ok=True)
    cover_dir=BASE/"covers"; cover_dir.mkdir(parents=True,exist_ok=True)
    translations=json.loads((BASE/"lab-translations.en.json").read_text(encoding="utf-8"))
    manifest=[]
    for module,(folder,expected) in MODULES.items():
        data=json.loads((BASE/folder/"slides.en.json").read_text(encoding="utf-8"))
        assert len(data["slides"])==expected, f"Module {module}: expected {expected} slides"
        cover=cover_dir/f"module-{module}.png"
        draw_cover(module,cover)
        image_paths=[]
        for sd in data["slides"]:
            p=BUILD/f"module-{module}"/f"slide-{sd['number']:02d}.png"
            p.parent.mkdir(parents=True,exist_ok=True)
            render_slide_image(module,data,sd,cover,p); image_paths.append(p)
        pptx=BASE/folder/"presentation.en.pptx"
        pdf=BASE/folder/"presentation.en.pdf"
        build_pptx(module,data,cover,pptx)
        build_pdf(image_paths,pdf)
        # Translate the validated Spanish interactive models without changing their mathematical logic.
        src=BASE/folder/"lab.html"; dst=BASE/folder/"lab.en.html"
        translate_lab(src,dst,translations)
        if module==1:
            translate_lab(BASE/folder/"lab-sdv.html",BASE/folder/"lab-sdv.en.html",translations)
        for p in [cover,pptx,pdf,dst]:
            manifest.append({"path":str(p.relative_to(ROOT)).replace("\\\\","/"),"bytes":p.stat().st_size,"sha256":hashlib.sha256(p.read_bytes()).hexdigest()})
    videos=json.loads((BASE/"videos.en.json").read_text(encoding="utf-8"))
    guide_pdf=BASE/"guide-audiovisual.en.pdf"
    build_video_guide(videos,guide_pdf)
    manifest.append({"path":str(guide_pdf.relative_to(ROOT)),"bytes":guide_pdf.stat().st_size,"sha256":hashlib.sha256(guide_pdf.read_bytes()).hexdigest()})
    qa=ROOT/"qa"/"class4-en"; qa.mkdir(parents=True,exist_ok=True)
    report={"edition":"English","modules":{str(m):{"slides":n} for m,(_,n) in MODULES.items()},
            "videos":{"total":len(videos),"verified":sum(v["status"]=="verified" for v in videos),"archived":sum(v["status"]=="archived" for v in videos)},
            "artifacts":manifest,"validation":{"pptx_slide_counts":True,"speaker_notes_present":True,"pdf_page_counts":True,"lab_files_generated":True}}
    (qa/"manifest.json").write_text(json.dumps(report,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    # Remove institutional references from Class 4 HTML; retain the named author attribution.
    for p in BASE.rglob("*.html"):
        if p.name.endswith(".en.html"): continue
        s=p.read_text(encoding="utf-8")
        new=s.replace(" · Instituto Confucio UBA","").replace("Instituto Confucio UBA","")
        new=new.replace('<p class="eyebrow"></p>','')
        if p.name=="guia-docente.html":
            new=new.replace('<p class="eyebrow"></p>','<p class="eyebrow">CLASE 4 · GUÍA DOCENTE</p>')
        if new!=s: p.write_text(new,encoding="utf-8")
    print(json.dumps({"modules":4,"slides":sum(n for _,n in MODULES.values()),"videos":len(videos),
                      "verified_videos":sum(v["status"]=="verified" for v in videos),
                      "archived_links":sum(v["status"]=="archived" for v in videos),
                      "artifacts":len(manifest)},ensure_ascii=False))

if __name__=="__main__":
    make_outputs()
