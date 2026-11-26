# shreyascloud.tech

My portfolio. A black and white page (a glyph portal over my name on the first screen) with a short colour clip for each project.

Vite + React + TypeScript + Tailwind v4, set up the shadcn way (`components.json`, components in `src/components/ui`).

```bash
npm install
npm run dev      # local
npm run build    # outputs dist/
```

The Container Sentinel and BPIP explainers are ManimGX scenes in `explainers/scenes.py`:

```bash
manimgx render explainers/scenes.py ContainerSentinel -r 960x540 --fps 30
```

Copy the result to `public/container.mp4` (or `parking.mp4` for `ParkingHotspots`).
