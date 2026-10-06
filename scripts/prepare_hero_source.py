import os
from PIL import Image, ImageDraw, ImageFont

SRC_IMG = "/home/human/.gemini/antigravity-cli/brain/45490564-6fe6-4e30-ad64-d329fcd69d2b/.user_uploaded/uploaded_media_1791220501593.png"
OUT_IMG = "/home/human/portfoliov2/public/hero_schematic_source.png"

def create_hero_source():
    im = Image.open(SRC_IMG).convert("RGB")
    w, h = im.size
    draw = ImageDraw.Draw(im)

    # 1. Clear the central text area where 'ai but simple' was
    # x=260..1320, y=85..315
    draw.rectangle([250, 85, 1335, 315], fill="#ffffff")

    # 2. Load fonts
    font_main_path = "/usr/share/fonts/liberation/LiberationSans-Bold.ttf"
    font_sub_path = "/usr/share/fonts/TTF/JetBrainsMonoNerdFont-Bold.ttf"

    font_main = ImageFont.truetype(font_main_path, 128)
    font_sub = ImageFont.truetype(font_sub_path, 26)

    text_main = "shreyas namdeo"
    text_sub = "AI / ML ENGINEER // AGENTIC SYSTEMS // PYTORCH"

    # Compute text bounding boxes to center them perfectly
    bbox_main = draw.textbbox((0, 0), text_main, font=font_main)
    main_w = bbox_main[2] - bbox_main[0]
    main_h = bbox_main[3] - bbox_main[1]

    bbox_sub = draw.textbbox((0, 0), text_sub, font=font_sub)
    sub_w = bbox_sub[2] - bbox_sub[0]
    sub_h = bbox_sub[3] - bbox_sub[1]

    center_x = w // 2
    # Vertically balance within the canvas (height 396)
    main_x = center_x - main_w // 2 - bbox_main[0]
    main_y = (h // 2) - (main_h // 2) - 30 - bbox_main[1]

    sub_x = center_x - sub_w // 2 - bbox_sub[0]
    sub_y = main_y + main_h + 38

    # 3. Draw text in solid black
    draw.text((main_x, main_y), text_main, fill="#000000", font=font_main)
    draw.text((sub_x, sub_y), text_sub, fill="#27272a", font=font_sub)

    os.makedirs(os.path.dirname(OUT_IMG), exist_ok=True)
    im.save(OUT_IMG, "PNG")
    print(f"Successfully generated hero schematic source: {OUT_IMG} ({w}x{h})")

if __name__ == "__main__":
    create_hero_source()
