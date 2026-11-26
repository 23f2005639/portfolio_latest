// Fig 4 · BPIP, Bengaluru Parking Intelligence Platform (github.com/23f2005639/parking_violation_system)
// A city-grid relief: each column is one grid cell's congestion impact for the hour on the dial.
// Impact = predicted violations × 3.0 in the peak windows (08–11, 17–20 IST), × 1.0 otherwise.
// The five tallest cells get lit caps: the top hotspots patrols are routed to.
// Run: node figures/parking.mjs  →  public/figures/parking.html
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "./kit/iso-kit.mjs";
import { kitScript, EMBED } from "./inline.mjs";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "figures", "parking.html");
const WIDTH = 620, HEIGHT = 430;

const PLATE = { x: -158, y: -84, w: 316, d: 168, r: 8 }, PLATE_H = 12, FOOT_H = 5;
const COLS = 8, ROWS = 6, PITCH = 21, CELL = 15;
const TILE = { x: -148, y: -70, w: COLS * PITCH + 6, d: ROWS * PITCH + 6, r: 3 }, TILE_H = 4;
const cellAt = (c, r) => ({ x: TILE.x + 3 + c * PITCH + (PITCH - CELL) / 2, y: TILE.y + 3 + r * PITCH + (PITCH - CELL) / 2, w: CELL, d: CELL, r: 1 });
const PER_POINT = 2.1; // world units of column height per impact point
const DIAL = [96, -26], DIAL_R = 30, DIAL_Z = 0, DIAL_H = 7, DIAL_TOP = DIAL_Z + DIAL_H;
const TRACK = { x: 64, y: 40, w: 64, d: 10, r: 2 }, TRACK_H = 3;
const SLIDER = { w: 12, d: 14 };
const SLOT = (mult) => TRACK.x + 10 + ((mult - 1) / 2) * (TRACK.w - 20 - SLIDER.w) ; // ×1 at left, ×3 at right

// ---- the model (shape follows the repo: spatial embedding × hour, ×3 at peak) ----
// shortcut: cell rates are an illustrative pattern, not the trained model's output; swap in exported predictions if they are published
const HOTS = [[1.6, 1.4, 1.0], [5.4, 3.6, 0.85], [3.2, 4.6, 0.55]];
const spatial = (c, r) => 0.12 + HOTS.reduce((s, [hc, hr, w]) => s + w * Math.exp(-((c - hc) ** 2 + (r - hr) ** 2) / 2.2), 0);
const daily = (h) => 0.18 + 0.95 * Math.exp(-(((h - 9.5) / 1.7) ** 2)) + 1.0 * Math.exp(-(((h - 18.5) / 1.8) ** 2)) + 0.35 * Math.exp(-(((h - 13.5) / 2.2) ** 2));
const multiplier = (h) => ((h >= 8 && h < 11) || (h >= 17 && h < 20) ? 3.0 : 1.0);
const BASE = 6.6; // violations per hour at the strongest cell at the daily peak
const impact = (c, r, h) => BASE * spatial(c, r) * daily(h) * multiplier(h);
const band = (v) => (v > 15 ? "critical" : v >= 8 ? "high" : v >= 3 ? "moderate" : "low");
// self-check: peak hours read critical at the top cell, the small hours read low
console.assert(band(Math.max(...Array.from({ length: 48 }, (_, i) => impact(i % 8, Math.floor(i / 8), 18)))) === "critical");
console.assert(band(Math.max(...Array.from({ length: 48 }, (_, i) => impact(i % 8, Math.floor(i / 8), 3)))) === "low");

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [TILE.x + 3, TILE.y + 3, TILE_H + 46], [TILE.x + TILE.w, TILE.y, TILE_H + 46]],
  WIDTH, HEIGHT, { pad: 8, azimuth: 38 },
);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const slab = (plan, z, h, steps = 3, bevel = 0) => k.slabOf(plan, z, h, P, steps, bevel);

function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of k.corners(PLATE, 20).sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.4), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "faint" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // ruler strips along two edges of the map: column and row index, one major per cell
  const front = { x: TILE.x, y: TILE.y + TILE.d + 3, w: TILE.w, d: 6, r: 1 };
  out.push(S(slab(front, 0, 0.6), { tone: "lo", crease: "none" }));
  const ft = k.topTicks(front.x + 3, front.x + front.w - 3, PITCH / 3, 3, front.y + 0.8, 0.6, [1.6, 3.2], P);
  out.push(L(ft.minor, { tone: "lo" }), L(ft.major, { tone: "mid" }));
  const side = { x: TILE.x + TILE.w + 3, y: TILE.y, w: 6, d: TILE.d, r: 1 };
  out.push(S(slab(side, 0, 0.6), { tone: "lo", crease: "none" }));
  const st = k.topTicks(side.y + 3, side.y + side.d - 3, PITCH / 3, 3, side.x + 0.8, 0.6, [1.6, 3.2], P, "y");
  out.push(L(st.minor, { tone: "lo" }), L(st.major, { tone: "mid" }));
  // label plate with three rule lines
  const label = { x: TRACK.x, y: TRACK.y + 20, w: 40, d: 14, r: 1.2 };
  out.push(S(slab(label, 0, 1), { tone: "lo", crease: "none" }));
  out.push(L([3.5, 7, 10.5].map((dy, i) => k.lineOnTop([label.x + 4, label.y + dy], [label.x + label.w - 4 - i * 8, label.y + dy], 1, P)).join(""), { tone: "lo", free: true }));
  out.push(D(k.corners(label, 1.8).map(([x, y]) => at([x, y, 1])), { size: 0.4 }));
  return out.join("");
}

function tile() {
  const out = [`<path class="iso-halo" d="${k.haloOf(TILE, 0, 1, P)}"/>`];
  out.push(S(slab(TILE, 0, TILE_H, 3, 0.6), { tone: "mid" }));
  // street grid: grooves edge to edge between the cells
  const lines = [];
  for (let c = 1; c < COLS; c++) lines.push(k.lineOnTop([TILE.x + 3 + c * PITCH, TILE.y], [TILE.x + 3 + c * PITCH, TILE.y + TILE.d], TILE_H, P));
  for (let r = 1; r < ROWS; r++) lines.push(k.lineOnTop([TILE.x, TILE.y + 3 + r * PITCH], [TILE.x + TILE.w, TILE.y + 3 + r * PITCH], TILE_H, P));
  out.push(L(lines.join(""), { tone: "faint" }));
  return out.join("");
}

function dial() {
  const [x, y] = DIAL;
  const out = [`<path class="iso-halo" d="${k.haloOf({ x: x - DIAL_R, y: y - DIAL_R, w: DIAL_R * 2, d: DIAL_R * 2, r: DIAL_R }, 0, 1, P)}"/>`];
  out.push(S(k.cylinder(x, y, DIAL_R + 2, DIAL_Z, 2.4, P, 72), { tone: "lo" }));
  out.push(S(k.cylinder(x, y, DIAL_R, DIAL_Z + 2.4, DIAL_H - 2.4, P, 72, 0.8), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(x, y, DIAL_R, DIAL_TOP - 3, DIAL_TOP, 90, P, 0.3), { tone: "lo" }));
  out.push(L(k.sideArc(x, y, DIAL_R, DIAL_TOP - 3, P, 48), { tone: "faint" }));
  out.push(L(k.ring(x, y, DIAL_R - 2.4, DIAL_TOP, P, 72), { tone: "lo" }));
  const t = k.radialTicks(x, y, DIAL_R - 3, 24, 6, DIAL_TOP, [2, 4.2], P);
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  // the two peak windows, as arcs on the face between their hour ticks
  const arc = (h0, h1, r) => k.onTop(Array.from({ length: 13 }, (_, i) => { const a = ((h0 + ((h1 - h0) * i) / 12) / 24) * Math.PI * 2; return [x + Math.sin(a) * r, y - Math.cos(a) * r]; }), DIAL_TOP, P);
  for (const [h0, h1] of [[8, 11], [17, 20]]) {
    out.push(L(arc(h0, h1, DIAL_R - 3) + arc(h0, h1, DIAL_R - 7.2), { tone: "hi" }));
    out.push(L([h0, h1].map((h) => { const a = (h / 24) * Math.PI * 2; return k.lineOnTop([x + Math.sin(a) * (DIAL_R - 7.2), y - Math.cos(a) * (DIAL_R - 7.2)], [x + Math.sin(a) * (DIAL_R - 3), y - Math.cos(a) * (DIAL_R - 3)], DIAL_TOP, P); }).join(""), { tone: "hi" }));
  }
  out.push(L(k.ring(x, y, 8, DIAL_TOP, P, 32), { tone: "faint" }));
  return out.join("");
}
function hub() {
  const [x, y] = DIAL;
  return [
    S(k.cylinder(x, y, 4.6, DIAL_TOP, 3, P, 28), { tone: "mid" }),
    L(k.knurl(x, y, 4.6, DIAL_TOP, DIAL_TOP + 3, 20, P), { tone: "lo" }),
    D([at([x, y, DIAL_TOP + 3])], { size: 0.5, tone: "hi" }),
  ].join("");
}
const hand = (h) => {
  const a = (h / 24) * Math.PI * 2, [x, y] = DIAL;
  return k.lineOnTop([x - Math.sin(a) * 5, y + Math.cos(a) * 5], [x + Math.sin(a) * (DIAL_R - 5), y - Math.cos(a) * (DIAL_R - 5)], DIAL_TOP + 0.3, P);
};

function track() {
  const out = [S(slab(TRACK, 0, TRACK_H, 3, 0.4), { tone: "mid" })];
  out.push(S(slab({ x: TRACK.x + 4, y: TRACK.y + TRACK.d / 2 - 1.2, w: TRACK.w - 8, d: 2.4, r: 1 }, TRACK_H, 0.01), { tone: "lo", flat: true, crease: "none" }));
  // detents at ×1 and ×3
  for (const m of [1, 3]) {
    const cx = SLOT(m) + SLIDER.w / 2;
    out.push(L(k.lineOnTop([cx, TRACK.y + TRACK.d + 0.4], [cx, TRACK.y + TRACK.d + 3.4], 0, P), { tone: m === 3 ? "hi" : "mid" }));
  }
  out.push(D([at([TRACK.x + 2.2, TRACK.y + TRACK.d / 2, TRACK_H]), at([TRACK.x + TRACK.w - 2.2, TRACK.y + TRACK.d / 2, TRACK_H])], { size: 0.45 }));
  return out.join("");
}
function slider() {
  const plan = { x: 0, y: TRACK.y - 2, w: SLIDER.w, d: SLIDER.d, r: 1.6 };
  return [
    S(slab(plan, TRACK_H, 6, 3, 0.5), { tone: "hi", crease: "lo" }),
    L(k.planOutline(k.insetPlan(plan, 2.4), TRACK_H + 6, P, 3), { tone: "faint" }),
    L([3.5, 6, 8.5].map((dx) => k.lineOnTop([dx, plan.y + 3], [dx, plan.y + plan.d - 3], TRACK_H + 6, P)).join(""), { tone: "lo" }),
  ].join("");
}

// static depth order of the cells, back to front
const ORDER = Array.from({ length: COLS * ROWS }, (_, i) => [i % COLS, Math.floor(i / COLS)])
  .sort((a, b) => k.depthOf([cellAt(...a).x + CELL / 2, cellAt(...a).y + CELL / 2, 0], P) - k.depthOf([cellAt(...b).x + CELL / 2, cellAt(...b).y + CELL / 2, 0], P));

const svg = k.figureSvg({
  width: WIDTH, height: HEIGHT,
  label: "A relief map of 48 city grid cells. Each cell is a column whose height is that cell's congestion impact for the hour set on the 24-hour dial. In the two peak windows, 8 to 11 and 17 to 20, the selector slides to times three and every column triples. The five tallest cells carry caps: the hotspots patrols are sent to first.",
  body: [base(), tile(), `<g data-part="cells"></g>`, track(), `<g data-part="slider" transform="${k.translateAlong(P, [SLOT(1), 0, 0])}">${slider()}</g>`, dial(), `<path data-part="hand" class="iso-line" data-tone="lit" data-free="start" d="${hand(18)}" style="stroke-width:1.2"/>`, hub()],
});

const live = `
const P = ${JSON.stringify(P)};
const COLS = ${COLS}, ROWS = ${ROWS}, PITCH = ${PITCH}, CELL = ${CELL}, PER_POINT = ${PER_POINT}, TILE_H = ${TILE_H}, BASE = ${BASE};
const TILE = ${JSON.stringify(TILE)}, HOTS = ${JSON.stringify(HOTS)}, ORDER = ${JSON.stringify(ORDER)};
const DIAL = ${JSON.stringify(DIAL)}, DIAL_R = ${DIAL_R}, DIAL_TOP = ${DIAL_TOP}, TRACK = ${JSON.stringify(TRACK)}, SLIDER = ${JSON.stringify(SLIDER)};
const cellAt = ${cellAt.toString()};
const spatial = ${spatial.toString()};
const daily = ${daily.toString()};
const multiplier = ${multiplier.toString()};
const impact = ${impact.toString()};
const band = ${band.toString()};
const SLOT = ${SLOT.toString()};
const hand = ${hand.toString().replace(/k\./g, "")};
const stage = document.querySelector(".iso-stage"), svg = stage.querySelector("svg");
const cells = svg.querySelector('[data-part="cells"]'), handEl = svg.querySelector('[data-part="hand"]'), sliderEl = svg.querySelector('[data-part="slider"]');
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const HOURS_PER_SECOND = 1.1;
const heights = new Float64Array(COLS * ROWS);
let hour = 6, target = 6, shown = 6, slide = 1, frame = 0, last = 0, visible = false, touring = true, idle = 0, first = true, built = "";
function draw(cellsMoving = true) {
  const h = Math.floor(((shown % 24) + 24) % 24);
  const want = Array.from({ length: COLS * ROWS }, (_, i) => impact(i % COLS, Math.floor(i / COLS), h));
  const top = want.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]).slice(0, 5).map(([, i]) => i);
  // the columns are the heavy part: rebuild them only while they ease or when the hour changes
  const key = h + "|" + top.join(",");
  if (cellsMoving || key !== built) {
  built = key;
  let html = "";
  for (const [c, r] of ORDER) {
    const i = r * COLS + c, plan = cellAt(c, r), z = Math.max(0.6, heights[i] * PER_POINT);
    // seam bands at the severity thresholds the column passes: 3 moderate, 8 high, 15 critical
    const seams = [3, 8, 15].filter((v) => heights[i] > v + 0.6).map((v) => sideSeam(plan, TILE_H + v * PER_POINT, P, 2)).join("");
    const groove = z > 2 ? planOutline(insetPlan(plan, 2.6), TILE_H + z, P, 2) : "";
    html += solidSvg(slabOf(plan, TILE_H, z, P, 2, 0.3), { tone: "mid", crease: "lo", inner: (seams ? lineSvg(seams, { tone: "lo" }) : "") + (groove ? lineSvg(groove, { tone: "faint" }) : "") });
    if (top.includes(i)) html += solidSvg(cylinder(plan.x + CELL / 2, plan.y + CELL / 2, 3.2, TILE_H + z, 1.6, P, 20), { tone: "hi", lit: true });
  }
  cells.innerHTML = html;
  }
  handEl.setAttribute("d", hand(shown % 24));
  sliderEl.setAttribute("transform", translateAlong(P, [SLOT(slide), 0, 0]));
  const best = Math.max(...want);
  const text = String(h).padStart(2, "0") + ":00 IST · ×" + multiplier(h).toFixed(1) + (multiplier(h) > 1 ? " peak" : "") + " · top cell " + best.toFixed(1) + " · " + band(best);
  if (readout.textContent !== text) readout.textContent = text;
  stage.setAttribute("aria-valuenow", String(h));
  stage.setAttribute("aria-valuetext", text);
  return want;
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  if (touring) target += HOURS_PER_SECOND * dt;
  shown = touring ? target : shown + (target - shown) * (1 - Math.exp(-dt / 0.25));
  if (!touring && Math.abs(target - shown) < 0.01) shown = target;
  const h = Math.floor(((shown % 24) + 24) % 24);
  const want = Array.from({ length: COLS * ROWS }, (_, i) => impact(i % COLS, Math.floor(i / COLS), h));
  let moving = false, cellsMoving = false;
  for (let i = 0; i < want.length; i++) {
    heights[i] = first ? want[i] : heights[i] + (want[i] - heights[i]) * (1 - Math.exp(-dt / 0.22));
    if (Math.abs(want[i] - heights[i]) > 0.01) cellsMoving = moving = true; else heights[i] = want[i];
  }
  first = false;
  slide += (multiplier(h) - slide) * (1 - Math.exp(-dt / 0.18));
  if (Math.abs(multiplier(h) - slide) < 0.002) slide = multiplier(h); else moving = true;
  draw(cellsMoving);
  frame = visible && (touring || moving || shown !== target) ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const settle = () => { const h = Math.floor(((shown % 24) + 24) % 24); for (let i = 0; i < heights.length; i++) heights[i] = impact(i % COLS, Math.floor(i / COLS), h); slide = multiplier(h); draw(); };
const steer = (to) => {
  touring = false;
  shown = ((shown % 24) + 24) % 24;
  target = to + 24 * Math.round((shown - to) / 24); // the short way round the clock, never back through the whole day
  if (still.matches) { shown = target; return settle(); } // reduced motion: jump to the hour
  clearTimeout(idle);
  idle = setTimeout(() => { touring = true; run(); }, 5000);
  run();
};
new IntersectionObserver((e) => { visible = e[e.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
stage.addEventListener("pointermove", (e) => {
  const box = svg.getBoundingClientRect();
  steer(Math.max(0, Math.min(23, Math.floor(((e.clientX - box.left) / box.width) * 24))));
});
stage.addEventListener("keydown", (e) => {
  const now = Math.round(((shown % 24) + 24) % 24);
  let to = null;
  if (e.key === "ArrowRight" || e.key === "ArrowUp") to = (now + 1) % 24;
  if (e.key === "ArrowLeft" || e.key === "ArrowDown") to = (now + 23) % 24;
  if (to === null) return;
  e.preventDefault(); steer(to);
});
if (still.matches) { touring = false; target = shown = 18; }
{ const h = Math.floor(shown); const w = Array.from({ length: COLS * ROWS }, (_, i) => impact(i % COLS, Math.floor(i / COLS), h)); w.forEach((v, i) => (heights[i] = v)); slide = multiplier(h); first = false; draw(); }
`;

const body = k.plateHtml({
  fig: "Fig 4",
  title: "BPIP · parking hotspots",
  hint: "Hover across to set the hour",
  readout: "06:00 IST · ×1.0 · top cell 2.0 · low",
  keys: [
    { mark: "raised", label: "One column per grid cell: predicted violations × the hour's multiplier; seam bands mark 3, 8 and 15" },
    { mark: "lit", label: "Caps on the five worst cells, where patrols are sent first; the hour hand" },
    { mark: "edge", label: "Peak windows on the dial, 08–11 and 17–20 IST, where the selector moves to ×3" },
  ],
  caption:
    "An illustrative 8 × 6 patch of the 7,814 cells the model covers. The PyTorch model learns a 32-number embedding for each cell and reads the hour as sine and cosine, the weekday and the cell's history, then predicts violations per hour with a Poisson loss (validation RMSE 2.83, MAE 1.59). In the peak windows the impact score is three times the prediction. Above 15 is critical, 8 to 15 high, 3 to 8 moderate.",
  body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="BPIP: arrow keys change the hour" aria-valuemin="0" aria-valuemax="23" aria-valuenow="6">${svg}</div>`,
});

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, k.pageHtml({ title: "BPIP parking hotspots", theme: "light", body: EMBED + body, script: kitScript() + live }));
console.log("wrote", OUT);
