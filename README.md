# Shreyas Namdeo · AI/ML Engineer Portfolio

A static, no-build portfolio: **1-bit dithering** layered on **embossed / debossed plaster**.

- Hero, page background and seal are reliefs rendered in **Blender (Cycles)** with CC0 textures from [ambientCG](https://ambientcg.com) (Plaster003, Concrete034).
- The browser Bayer-dithers the renders live; hovering (or tapping) the hero opens a lens onto the raw render.
- Cards, chips and buttons are raised; metric wells and the nav are pressed in; buttons deboss when clicked. All shadows share the renders' top-left light.

## Run locally
```bash
python3 -m http.server 8766   # then open http://localhost:8766
```

## Re-render the reliefs
Download the textures (1K-JPG zips) into `textures_dl/<Name>/`, then:
```bash
blender -b -P blender/render.py -- textures_dl out            # all: hero bg seal
blender -b -P blender/render.py -- textures_dl out hero       # just one part
```
Convert `out/*.png` to `assets/*.jpg` (the page loads the JPGs).

## Deploy
Plain static files; `vercel.json` skips install/build and serves the repo root.
