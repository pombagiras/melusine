#!/usr/bin/env python3
"""
Gerador de Vídeos Cinemagraph (10 segundos / 1080x1920 Reels)
1. @almasdepombagira (Guardiã das Almas - Sagrado, Chamas e Partículas)
2. @alexiamelusine (Alexia Melusine - Vanguarda, Trans Pride e Cyber-Aesthetic)
"""

import os
import sys
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "reels"
OUTPUT_DIR.mkdir(exist_ok=True)

FONTS_DIR = Path("C:/Windows/Fonts")
FONT_GEORGIA = str(FONTS_DIR / "georgia.ttf")
FONT_GEORGIA_BOLD = str(FONTS_DIR / "georgiab.ttf")
FONT_ARIAL_BOLD = str(FONTS_DIR / "arialbd.ttf")
FONT_ARIAL = str(FONTS_DIR / "arial.ttf")

WIDTH = 1080
HEIGHT = 1920
DURATION = 10
FPS = 30

def create_almas_overlay():
    """Gera overlay tipográfico e moldura mística para @almasdepombagira"""
    img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Vinheta sutil na base e topo
    for y in range(HEIGHT):
        if y < 350:
            alpha = int((1 - y / 350) * 190)
            draw.line([(0, y), (WIDTH, y)], fill=(8, 2, 4, alpha))
        elif y > 1250:
            alpha = int(((y - 1250) / (HEIGHT - 1250)) * 230)
            draw.line([(0, y), (WIDTH, y)], fill=(8, 2, 4, alpha))

    # Moldura dourada fina com cantos estilizados
    margin = 45
    gold_border = (212, 175, 55, 120)
    draw.rectangle([margin, margin, WIDTH - margin, HEIGHT - margin], outline=gold_border, width=2)
    draw.rectangle([margin + 8, margin + 8, WIDTH - margin - 8, HEIGHT - margin - 8], outline=(212, 175, 55, 50), width=1)

    # Detalhes de cantos sagrados (losangos / cruzes)
    corner_size = 14
    for cx, cy in [(margin, margin), (WIDTH - margin, margin), (margin, HEIGHT - margin), (WIDTH - margin, HEIGHT - margin)]:
        draw.polygon([(cx - corner_size, cy), (cx, cy - corner_size), (cx + corner_size, cy), (cx, cy + corner_size)], fill=(212, 175, 55, 180))

    # Tipografia Topo: Pombagiras Portal
    try:
        font_brand = ImageFont.truetype(FONT_GEORGIA, 28)
        font_quote = ImageFont.truetype(FONT_GEORGIA_BOLD, 46)
        font_sub = ImageFont.truetype(FONT_GEORGIA, 32)
        font_footer = ImageFont.truetype(FONT_GEORGIA, 26)
    except Exception:
        font_brand = font_quote = font_sub = font_footer = ImageFont.load_default()

    brand_text = "•   A L M A S   D E   P O M B A G I R A   •"
    bbox_brand = draw.textbbox((0, 0), brand_text, font=font_brand)
    draw.text(((WIDTH - (bbox_brand[2] - bbox_brand[0])) // 2, 120), brand_text, font=font_brand, fill=(212, 175, 55, 230))

    # Citação Principal (Base)
    quote_line1 = "“Nem toda Guardiã precisa gargalhar"
    quote_line2 = "para se fazer respeitar.”"
    sub_line = "No silêncio das Almas habita a maior soberania."

    bbox1 = draw.textbbox((0, 0), quote_line1, font=font_quote)
    draw.text(((WIDTH - (bbox1[2] - bbox1[0])) // 2, 1420), quote_line1, font=font_quote, fill=(255, 248, 230, 255))

    bbox2 = draw.textbbox((0, 0), quote_line2, font=font_quote)
    draw.text(((WIDTH - (bbox2[2] - bbox2[0])) // 2, 1485), quote_line2, font=font_quote, fill=(212, 175, 55, 255))

    bbox_sub = draw.textbbox((0, 0), sub_line, font=font_sub)
    draw.text(((WIDTH - (bbox_sub[2] - bbox_sub[0])) // 2, 1570), sub_line, font=font_sub, fill=(220, 195, 180, 220))

    # Linha divisória dourada
    draw.line([(WIDTH // 2 - 120, 1640), (WIDTH // 2 + 120, 1640)], fill=(212, 175, 55, 180), width=2)

    footer_text = "pombagiras.com  •  @almasdepombagira"
    bbox_foot = draw.textbbox((0, 0), footer_text, font=font_footer)
    draw.text(((WIDTH - (bbox_foot[2] - bbox_foot[0])) // 2, 1670), footer_text, font=font_footer, fill=(180, 160, 130, 190))

    overlay_path = OUTPUT_DIR / "overlay_almas.png"
    img.save(overlay_path, "PNG")
    return overlay_path

def create_alexia_overlay():
    """Gera overlay tipográfico e estético futurista/Pride para @alexiamelusine"""
    img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Vinheta suave
    for y in range(HEIGHT):
        if y < 350:
            alpha = int((1 - y / 350) * 180)
            draw.line([(0, y), (WIDTH, y)], fill=(5, 5, 10, alpha))
        elif y > 1250:
            alpha = int(((y - 1250) / (HEIGHT - 1250)) * 240)
            draw.line([(0, y), (WIDTH, y)], fill=(5, 5, 10, alpha))

    # Cores da Bandeira Trans
    c_blue = (91, 206, 250)
    c_pink = (245, 169, 184)
    c_white = (255, 255, 255)

    # Borda sutil com degradê conceitual
    margin = 45
    draw.rectangle([margin, margin, WIDTH - margin, HEIGHT - margin], outline=(91, 206, 250, 90), width=2)
    draw.rectangle([margin + 6, margin + 6, WIDTH - margin - 6, HEIGHT - margin - 6], outline=(245, 169, 184, 50), width=1)

    # Barra sutil Trans Pride no topo
    bar_w = 180
    bar_h = 6
    bar_x = (WIDTH - bar_w) // 2
    bar_y = 90
    draw.rectangle([bar_x, bar_y, bar_x + 50, bar_y + bar_h], fill=c_blue + (240,))
    draw.rectangle([bar_x + 50, bar_y, bar_x + 90, bar_y + bar_h], fill=c_pink + (240,))
    draw.rectangle([bar_x + 90, bar_y, bar_x + 130, bar_y + bar_h], fill=c_white + (240,))
    draw.rectangle([bar_x + 130, bar_y, bar_x + 180, bar_y + bar_h], fill=c_pink + (240,))

    try:
        font_brand = ImageFont.truetype(FONT_ARIAL_BOLD, 26)
        font_quote = ImageFont.truetype(FONT_ARIAL_BOLD, 46)
        font_sub = ImageFont.truetype(FONT_ARIAL, 30)
        font_footer = ImageFont.truetype(FONT_ARIAL, 26)
    except Exception:
        font_brand = font_quote = font_sub = font_footer = ImageFont.load_default()

    brand_text = "A L E X I A   M E L U S I N E   |   A R T E   &   P R I D E"
    bbox_brand = draw.textbbox((0, 0), brand_text, font=font_brand)
    draw.text(((WIDTH - (bbox_brand[2] - bbox_brand[0])) // 2, 120), brand_text, font=font_brand, fill=(245, 169, 184, 240))

    # Citação Manifesto
    quote_line1 = "“Existir com orgulho é a obra"
    quote_line2 = "mais radical que podemos assinar.”"
    sub_line = "Arte Generativa  •  Identidade  •  Vanguarda"

    bbox1 = draw.textbbox((0, 0), quote_line1, font=font_quote)
    draw.text(((WIDTH - (bbox1[2] - bbox1[0])) // 2, 1420), quote_line1, font=font_quote, fill=(255, 255, 255, 255))

    bbox2 = draw.textbbox((0, 0), quote_line2, font=font_quote)
    draw.text(((WIDTH - (bbox2[2] - bbox2[0])) // 2, 1485), quote_line2, font=font_quote, fill=(91, 206, 250, 255))

    bbox_sub = draw.textbbox((0, 0), sub_line, font=font_sub)
    draw.text(((WIDTH - (bbox_sub[2] - bbox_sub[0])) // 2, 1570), sub_line, font=font_sub, fill=(245, 169, 184, 210))

    # Linha divisória
    draw.line([(WIDTH // 2 - 100, 1640), (WIDTH // 2 + 100, 1640)], fill=(91, 206, 250, 160), width=2)

    footer_text = "alexiamelusine.com  •  @alexiamelusine"
    bbox_foot = draw.textbbox((0, 0), footer_text, font=font_footer)
    draw.text(((WIDTH - (bbox_foot[2] - bbox_foot[0])) // 2, 1670), footer_text, font=font_footer, fill=(200, 210, 230, 190))

    overlay_path = OUTPUT_DIR / "overlay_alexia.png"
    img.save(overlay_path, "PNG")
    return overlay_path

def render_almas_video(overlay_png):
    """Renderiza vídeo de 10s para @almasdepombagira com zoom, chama pulsante e áudio drone sagrado"""
    input_img = BASE_DIR / "fotos" / "pombagira_das_almas.png"
    if not input_img.exists():
        input_img = BASE_DIR / "pombagira-que-nao-gosta-de-festas" / "capa.png"
        
    output_mp4 = OUTPUT_DIR / "almas_silencio_guardia.mp4"
    print(f"🎬 Renderizando vídeo Almas de Pombagira: {output_mp4.name}...")

    # Filtro de Vídeo:
    # 1. Zoompan gera exatamente 300 quadros (10s a 30fps)
    # 2. Oscilação de luz de vela (eq brightness + contrast oscilando)
    # 3. Overlay com fade-in suave a partir de 1.0s
    filter_complex = (
        f"[0:v]zoompan=z='min(zoom+0.0006,1.08)':d={DURATION*FPS}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s={WIDTH}x{HEIGHT}:fps={FPS},"
        f"eq=brightness='0.025*sin(2*PI*t*1.6)+0.012*sin(2*PI*t*3.2)':contrast='1.02+0.035*sin(2*PI*t*1.6)':saturation=1.12[bg];"
        f"[1:v]format=rgba,fade=in:st=1.0:d=1.5:alpha=1[ov];"
        f"[bg][ov]overlay=0:0[v]"
    )

    # Áudio Sagrado Místico (Drone profundo com harmônicos)
    audio_filter = "aevalsrc='0.16*sin(2*PI*55*t)+0.09*sin(2*PI*110*t)+0.05*sin(2*PI*165*t)+0.03*sin(2*PI*220*t)':s=44100"

    cmd = [
        "ffmpeg", "-y",
        "-i", str(input_img),
        "-loop", "1", "-t", str(DURATION), "-i", str(overlay_png),
        "-f", "lavfi", "-t", str(DURATION), "-i", audio_filter,
        "-filter_complex", filter_complex,
        "-map", "[v]", "-map", "2:a",
        "-c:v", "libx264", "-preset", "fast", "-crf", "22", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-t", str(DURATION),
        "-movflags", "+faststart",
        str(output_mp4)
    ]

    subprocess.run(cmd, check=True)
    print(f"✅ Vídeo Almas gerado: {output_mp4} ({output_mp4.stat().st_size / 1024 / 1024:.2f} MB)")
    return output_mp4

def render_alexia_video(overlay_png):
    """Renderiza vídeo de 10s para @alexiamelusine com zoom, aura holográfica e áudio synthwave"""
    input_img = BASE_DIR / "fotos" / "Alê (3).png"
    if not input_img.exists():
        input_img = BASE_DIR / "fotos" / "A.MELUSINE.png"
    output_mp4 = OUTPUT_DIR / "alexia_pride_manifesto.mp4"
    print(f"🎬 Renderizando vídeo Alexia Melusine: {output_mp4.name}...")

    # Filtro de Vídeo:
    # 1. Zoompan gera exatamente 300 quadros (10s a 30fps)
    # 2. Pulso sutil de luz holográfica/neon azul e rosa
    # 3. Overlay com fade-in suave
    filter_complex = (
        f"[0:v]zoompan=z='min(zoom+0.0006,1.08)':d={DURATION*FPS}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s={WIDTH}x{HEIGHT}:fps={FPS},"
        f"eq=gamma_b='1.0+0.08*sin(2*PI*t*0.8)':gamma_r='1.0+0.06*cos(2*PI*t*0.8)':saturation=1.15[bg];"
        f"[1:v]format=rgba,fade=in:st=1.0:d=1.5:alpha=1[ov];"
        f"[bg][ov]overlay=0:0[v]"
    )

    # Áudio Synthwave Dark Ambient (Acordes cibernéticos C minor / F minor)
    audio_filter = "aevalsrc='0.12*sin(2*PI*130.81*t)+0.08*sin(2*PI*155.56*t)+0.07*sin(2*PI*196*t)+0.04*sin(2*PI*261.63*t)':s=44100"

    cmd = [
        "ffmpeg", "-y",
        "-i", str(input_img),
        "-loop", "1", "-t", str(DURATION), "-i", str(overlay_png),
        "-f", "lavfi", "-t", str(DURATION), "-i", audio_filter,
        "-filter_complex", filter_complex,
        "-map", "[v]", "-map", "2:a",
        "-c:v", "libx264", "-preset", "fast", "-crf", "22", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-t", str(DURATION),
        "-movflags", "+faststart",
        str(output_mp4)
    ]

    subprocess.run(cmd, check=True)
    print(f"✅ Vídeo Alexia gerado: {output_mp4} ({output_mp4.stat().st_size / 1024 / 1024:.2f} MB)")
    return output_mp4

def main():
    print("=" * 60)
    print("✨ RENDERIZANDO CINEMAGRAPHS DE DEMONSTRAÇÃO (10s / 1080x1920) ✨")
    print("=" * 60)

    # 1. Almas de Pombagira
    overlay_almas = create_almas_overlay()
    render_almas_video(overlay_almas)

    print("-" * 60)

    # 2. Alexia Melusine
    overlay_alexia = create_alexia_overlay()
    render_alexia_video(overlay_alexia)

    print("=" * 60)
    print("🎉 AMBOS OS VÍDEOS FORAM GERADOS COM SUCESSO NA PASTA /reels!")
    print("=" * 60)

if __name__ == "__main__":
    main()

