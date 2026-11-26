// Fig 3 · Container Sentinel (github.com/23f2005639/Docker_Security_Agent)
// A test bench: a striker carriage runs five real attacks against the sandbox, then the four
// agents report. Scanner, monitor and network run together (asyncio.gather), the reporter after.
// Run: node figures/container.mjs  →  public/figures/container.html
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "./kit/iso-kit.mjs";
import { kitScript, EMBED } from "./inline.mjs";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "figures", "container.html");
const WIDTH = 620, HEIGHT = 430;

// ---- world (units ≈ px), x right, y toward the viewer's left-front, z up ----
const PLATE = { x: -150, y: -74, w: 250, d: 150, r: 8 }, PLATE_H = 12, FOOT_H = 5;
const DECK = { x: -142, y: -68, w: 234, d: 30, r: 3 }, DECK_H = 16;
const DIAL_Y = -53, DIAL_R = 12, DIAL_Z = DECK_H, DIAL_H = 4, DIAL_TOP = DIAL_Z + DIAL_H;
const AGENTS = [["scanner", -118], ["monitor", -86], ["network", -54], ["reporter", -14]];
const PRINTER = { x: 18, y: -64, w: 44, d: 22, r: 2 }, PRINTER_TOP = DECK_H + 16;
const PAPER = { x: 26, y: -54.6, w: 28, d: 1.2, r: 0.3 };
const KNOB = [78, -53];

const BOX = { y: -20, d: 34, w: 44 }, PLINTH_H = 3, BOX_H = 30, BOX_TOP = PLINTH_H + BOX_H, LID_H = 2.6;
const CONTAINERS = [["nginx-target", -136], ["flask-target", -84], ["redis-target", -32]];
const SOCK = { x: 26, y: -14, w: 18, d: 28, r: 2 }, SOCK_H = 26, PORT_Z = 14;
const FRONT = BOX.y + BOX.d; // container and socket faces the ram strikes

const RAILS = [34, 50], RAIL_D = 4, RAIL_H = 4, RAIL_FROM = -146, RAIL_TO = 96;
const CART = { w: 28, d: 26, y: 31 }, CART_Z = RAIL_H, CART_H = 4;
const HOUSING = { w: 14, d: 13, y: 34 }, HOUSING_Z = CART_Z + CART_H, HOUSING_H = 13;
const RAM = { w: 6, z: 11, h: 6 }, RAM_REST = 8, RAM_REACH = HOUSING.y - FRONT - 0.4;
const PARK = 76;

// attacks from src/attacks: what each one hits
const ATTACKS = [
  { name: "nsenter escape", hits: "flask-target", x: -84 + BOX.w / 2, box: 1 },
  { name: "Redis lateral movement", hits: "redis-target", x: -32 + BOX.w / 2, box: 2 },
  { name: "Docker socket escape", hits: "docker.sock", x: SOCK.x + SOCK.w / 2, box: -1 },
  { name: "AuthZ bypass", hits: "docker.sock", x: SOCK.x + SOCK.w / 2, box: -1 },
  { name: "runc CVE-2025-31133", hits: "docker.sock", x: SOCK.x + SOCK.w / 2, box: -1 },
];

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), ...k.boxCorners(DECK, 0, PRINTER_TOP + 28), ...k.boxCorners({ x: -136, y: BOX.y, w: 200, d: BOX.d, r: 0 }, 0, BOX_TOP + 10)],
  WIDTH, HEIGHT, { pad: 8, azimuth: 40 },
);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const slab = (plan, z, h, steps = 3, bevel = 0) => k.slabOf(plan, z, h, P, steps, bevel);

// ---- base: the host ----
function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  const feet = k.corners(PLATE, 20).sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P));
  for (const [x, y] of feet) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.4), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "faint" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // ruler strip along the front edge: the carriage's travel
  const strip = { x: RAIL_FROM + 4, y: 60, w: RAIL_TO - RAIL_FROM - 8, d: 7, r: 1 };
  out.push(S(slab(strip, 0, 0.6), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }));
  // stop marks on the strip: one per target
  for (const x of new Set(ATTACKS.map((a) => a.x))) out.push(L(k.lineOnTop([x, strip.y], [x, strip.y + strip.d], 0.6, P), { tone: "hi" }));
  return out.join("");
}

// ---- the analyzer deck at the back: four agent dials and the report printer ----
function deck() {
  const out = [`<path class="iso-halo" d="${k.haloOf(DECK, 0, DECK_H, P)}"/>`];
  out.push(S(slab(DECK, 0, DECK_H, 4, 0.8), { tone: "mid" }));
  out.push(L(k.sideSeam(DECK, 4, P, 4), { tone: "faint" }));
  out.push(D([DECK.x + 5, DECK.x + DECK.w - 5].flatMap((x) => [at([x, DECK.y + 5, DECK_H]), at([x, DECK.y + DECK.d - 5, DECK_H])]), { size: 0.45 }));
  // a groove that groups the three agents that run together
  const group = { x: AGENTS[0][1] - 16, y: DIAL_Y - 15, w: AGENTS[2][1] - AGENTS[0][1] + 32, d: 30, r: 3 };
  out.push(L(k.planOutline(group, DECK_H, P, 4), { tone: "lo" }));
  for (const [, x] of AGENTS) {
    out.push(S(k.cylinder(x, DIAL_Y, DIAL_R + 1.6, DIAL_Z, 1.2, P, 40), { tone: "lo" }));
    out.push(S(k.cylinder(x, DIAL_Y, DIAL_R, DIAL_Z + 1.2, DIAL_H - 1.2, P, 56, 0.6), { tone: "hi", crease: "lo" }));
    out.push(L(k.ring(x, DIAL_Y, DIAL_R - 1.8, DIAL_TOP, P, 48), { tone: "lo" }));
    const t = k.radialTicks(x, DIAL_Y, DIAL_R - 2.4, 20, 5, DIAL_TOP, [1, 2.2], P, -Math.PI * 0.75, Math.PI * 1.5);
    out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
    out.push(L(k.ring(x, DIAL_Y, 1.3, DIAL_TOP, P, 12), { tone: "mid" }));
  }
  // printer
  out.push(S(slab(PRINTER, DECK_H, PRINTER_TOP - DECK_H, 3, 0.6), { tone: "mid" }));
  out.push(L(k.sideSeam(PRINTER, DECK_H + 4, P, 3), { tone: "faint" }));
  const slot = { x: PAPER.x - 2, y: PAPER.y - 1.6, w: PAPER.w + 4, d: 4.4, r: 1 };
  out.push(S(slab(slot, PRINTER_TOP, 0.01), { tone: "lo", flat: true, crease: "none" }));
  out.push(D([at([PRINTER.x + 4, PRINTER.y + PRINTER.d - 4, PRINTER_TOP]), at([PRINTER.x + PRINTER.w - 4, PRINTER.y + PRINTER.d - 4, PRINTER_TOP])], { size: 0.45 }));
  // knurled knob and its seat
  out.push(S(k.cylinder(KNOB[0], KNOB[1], 7, DECK_H, 1.2, P, 32), { tone: "lo" }));
  out.push(S(k.cylinder(KNOB[0], KNOB[1], 5.4, DECK_H + 1.2, 5, P, 32), { tone: "mid" }));
  out.push(L(k.knurl(KNOB[0], KNOB[1], 5.4, DECK_H + 1.2, DECK_H + 6.2, 30, P), { tone: "lo" }));
  out.push(L(k.lineOnTop([KNOB[0], KNOB[1]], [KNOB[0], KNOB[1] - 5.4], DECK_H + 6.2, P), { tone: "hi" }));
  out.push(D([at([KNOB[0], KNOB[1], DECK_H + 6.2])], { size: 0.55, tone: "hi" }));
  return out.join("");
}

// ---- wires lying on the plate: each container to the deck, and docker.sock into flask ----
function wires() {
  const out = [];
  for (const [, x] of CONTAINERS) {
    const cx = x + BOX.w / 2 - 12;
    out.push(k.wireSvg(at([cx, BOX.y, 8]), at([cx, DECK.y + DECK.d, 8]), { via: [at([cx, BOX.y - 4, 0.6]), at([cx, DECK.y + DECK.d + 4, 0.6])], tone: "lo" }));
  }
  const sx = SOCK.x + 6, fx = CONTAINERS[1][1] + BOX.w - 8;
  out.push(k.wireSvg(at([sx, SOCK.y, 6]), at([fx, BOX.y, 6]), { via: [at([sx, SOCK.y - 3, 0.6]), at([sx, BOX.y - 8, 0.6]), at([fx, BOX.y - 8, 0.6]), at([fx, BOX.y - 3, 0.6])], tone: "mid" }));
  return out.join("");
}

// ---- a shipping container ----
function container(x) {
  const plan = { x, y: BOX.y, w: BOX.w, d: BOX.d, r: 1.2 };
  const out = [`<path class="iso-halo" d="${k.haloOf(plan, 0, 1, P)}"/>`];
  out.push(S(slab(k.insetPlan(plan, -1.2), 0, PLINTH_H, 2), { tone: "lo" }));
  out.push(S(slab(plan, PLINTH_H, BOX_H, 2, 0.5), { tone: "mid" }));
  const ribs = [];
  for (let rx = x + 4; rx <= x + BOX.w - 4; rx += 4) ribs.push(k.segment([rx, BOX.y + BOX.d, PLINTH_H + 2], [rx, BOX.y + BOX.d, BOX_TOP - 2], P));
  for (let ry = BOX.y + 4; ry <= BOX.y + BOX.d - 4; ry += 6) ribs.push(k.segment([x + BOX.w, ry, PLINTH_H + 2], [x + BOX.w, ry, BOX_TOP - 2], P));
  out.push(L(ribs.join(""), { tone: "faint" }));
  // door seam and lock bars on the end face
  const mid = BOX.y + BOX.d / 2;
  out.push(L(k.segment([x + BOX.w, mid, PLINTH_H], [x + BOX.w, mid, BOX_TOP], P), { tone: "lo" }));
  for (const y of [mid - 5, mid + 5]) out.push(S(k.slabOf({ x: x + BOX.w, y: y - 0.7, w: 1.2, d: 1.4, r: 0.3 }, PLINTH_H + 3, BOX_H - 6, P, 2), { tone: "mid", crease: "none" }));
  out.push(L(k.sideSeam(plan, PLINTH_H + 2, P, 2) + k.sideSeam(plan, BOX_TOP - 2, P, 2), { tone: "faint" }));
  // corner castings
  out.push(D([[x + 1.5, BOX.y + BOX.d, BOX_TOP - 1.5], [x + BOX.w, BOX.y + BOX.d, BOX_TOP - 1.5], [x + BOX.w, BOX.y + BOX.d, PLINTH_H + 1.5], [x + 1.5, BOX.y + BOX.d, PLINTH_H + 1.5]].map(at), { size: 0.55 }));
  return out.join("");
}
function lid(x) {
  const plan = { x: x - 0.6, y: BOX.y - 0.6, w: BOX.w + 1.2, d: BOX.d + 1.2, r: 1.4 };
  return [
    S(slab(plan, BOX_TOP, LID_H, 2, 0.4), { tone: "hi", crease: "lo" }),
    L(k.planOutline(k.insetPlan(plan, 3), BOX_TOP + LID_H, P, 2), { tone: "faint" }),
    D(k.corners(plan, 2.4).map(([px, py]) => at([px, py, BOX_TOP + LID_H])), { size: 0.4 }),
  ].join("");
}

// ---- the docker.sock pillar: the Docker Engine API, the way to the host ----
function socket() {
  const out = [`<path class="iso-halo" d="${k.haloOf(SOCK, 0, 1, P)}"/>`];
  out.push(S(slab(k.insetPlan(SOCK, -1.4), 0, 2.4, 2), { tone: "lo" }));
  out.push(S(slab(SOCK, 2.4, SOCK_H - 2.4, 2, 0.5), { tone: "mid" }));
  out.push(L(k.sideSeam(SOCK, SOCK_H - 3, P, 2), { tone: "faint" }));
  const c = [SOCK.x + SOCK.w / 2, SOCK.y + SOCK.d, PORT_Z];
  out.push(L(k.sideRing(c, 5.2, "y", P), { tone: "lo" }));
  out.push(D([[c[0] - 6.4, c[1], c[2] + 6.4], [c[0] + 6.4, c[1], c[2] + 6.4], [c[0] - 6.4, c[1], c[2] - 6.4], [c[0] + 6.4, c[1], c[2] - 6.4]].map(at), { size: 0.45 }));
  return out.join("");
}
const port = () => `<path data-part="port" class="iso-line" data-tone="mid" d="${k.sideRing([SOCK.x + SOCK.w / 2, SOCK.y + SOCK.d, PORT_Z], 3, "y", P)}"/>`;

// ---- rails, carriage, striker ----
function rails() {
  const out = [];
  for (const y of RAILS) {
    out.push(S(slab({ x: RAIL_FROM, y, w: RAIL_TO - RAIL_FROM, d: RAIL_D, r: 1 }, 0, RAIL_H, 3, 0.4), { tone: "mid" }));
    out.push(D([RAIL_FROM + 6, (RAIL_FROM + RAIL_TO) / 2, RAIL_TO - 6].map((x) => at([x, y + RAIL_D / 2, RAIL_H])), { size: 0.4 }));
  }
  for (const x of [RAIL_FROM - 5, RAIL_TO]) {
    out.push(S(slab({ x, y: RAILS[0] - 3, w: 5, d: RAILS[1] - RAILS[0] + RAIL_D + 6, r: 1.2 }, 0, 8, 3, 0.5), { tone: "mid" }));
    out.push(D([at([x + 2.5, RAILS[0], 8]), at([x + 2.5, RAILS[1] + RAIL_D, 8])], { size: 0.45 }));
  }
  return out.join("");
}
function carriage() {
  const plan = { x: -CART.w / 2, y: CART.y, w: CART.w, d: CART.d, r: 2 };
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(plan, 3), CART_Z, 0.1, P)}" style="filter:blur(3px)"/>`];
  out.push(S(slab(plan, CART_Z, CART_H, 3, 0.5), { tone: "mid" }));
  out.push(D(k.corners(plan, 3).map(([x, y]) => at([x, y, CART_Z + CART_H])), { size: 0.4, tone: "lo" }));
  const housing = { x: -HOUSING.w / 2, y: HOUSING.y, w: HOUSING.w, d: HOUSING.d, r: 1.5 };
  out.push(S(slab(housing, HOUSING_Z, HOUSING_H, 3, 0.5), { tone: "mid" }));
  out.push(L(k.sideSeam(housing, HOUSING_Z + 4, P, 3), { tone: "faint" }));
  // the coil that fires the ram, seen as a wound band on the housing top
  out.push(S(k.cylinder(0, HOUSING.y + HOUSING.d / 2, 4, HOUSING_Z + HOUSING_H, 3, P, 24), { tone: "mid" }));
  out.push(L(k.knurl(0, HOUSING.y + HOUSING.d / 2, 4, HOUSING_Z + HOUSING_H, HOUSING_Z + HOUSING_H + 3, 20, P), { tone: "lo" }));
  // handle
  const hx = CART.w / 2 - 6;
  out.push(S(slab({ x: hx - 2, y: CART.y + CART.d - 1, w: 4, d: 4, r: 1 }, CART_Z + 0.5, 3, 2), { tone: "mid", crease: "none" }));
  out.push(S(k.cylinder(hx, CART.y + CART.d + 4, 3, CART_Z, 5, P, 20), { tone: "mid" }));
  out.push(L(k.knurl(hx, CART.y + CART.d + 4, 3, CART_Z, CART_Z + 5, 18, P), { tone: "lo" }));
  return out.join("");
}
// the ram is rebuilt each frame (its length changes); this is the shared builder
const ramPaths = (ext) => k.slabOf({ x: -RAM.w / 2, y: HOUSING.y - RAM_REST - ext, w: RAM.w, d: RAM_REST + ext + 0.6, r: 0.8 }, RAM.z + HOUSING_Z - 4, RAM.h, P, 2, 0.3);

const needle = (x, p) => {
  const a = -Math.PI * 0.75 + p * Math.PI * 1.5;
  return k.lineOnTop([x - Math.sin(a) * 2.6, DIAL_Y + Math.cos(a) * 2.6], [x + Math.sin(a) * (DIAL_R - 3), DIAL_Y - Math.cos(a) * (DIAL_R - 3)], DIAL_TOP + 0.2, P);
};
const paperPaths = (h) => k.slabOf(PAPER, PRINTER_TOP, Math.max(0.01, h), P, 2);

const svg = k.figureSvg({
  width: WIDTH, height: HEIGHT,
  label: "A test bench for container attacks. A striker carriage on two rails stops in front of a target and drives a ram into it: the flask container, the redis container, or the docker.sock pillar that leads to the host. The breached container's lid lifts. On the deck behind, three agent dials (scanner, monitor, network) swing together, then the reporter dial swings and the printer feeds out a report.",
  body: [
    base(),
    deck(),
    `<g data-part="paper">${S(paperPaths(0), { tone: "hi", crease: "lo" })}</g>`,
    `<g data-part="lines"></g>`,
    ...AGENTS.map(([name, x]) => `<path data-part="needle-${name}" class="iso-line" data-tone="${name === "reporter" ? "lit" : "hi"}" data-free="both" d="${needle(x, 0)}" style="stroke-width:1"/>`),
    wires(),
    ...CONTAINERS.map(([, x], i) => `<g data-part="box-${i}">${container(x)}<g data-part="lid-${i}">${lid(x)}</g></g>`),
    `<g data-part="sock">${socket()}${port()}</g>`,
    rails(),
    `<g data-part="ram" transform="${k.translateAlong(P, [PARK, 0, 0])}">${S(ramPaths(0), { tone: "hi", lit: true })}</g>`,
    `<g data-part="carriage" transform="${k.translateAlong(P, [PARK, 0, 0])}">${carriage()}</g>`,
  ],
});

const live = `
const P = ${JSON.stringify(P)};
const ATTACKS = ${JSON.stringify(ATTACKS)};
const AGENTS = ${JSON.stringify(AGENTS)};
const PARK = ${PARK}, RAM_REACH = ${RAM_REACH}, LIFT = 7, PAPER_STEP = 5.5, PAPER_MAX = 27;
const DIAL_Y = ${DIAL_Y}, DIAL_R = ${DIAL_R}, DIAL_TOP = ${DIAL_TOP};
const PAPER = ${JSON.stringify(PAPER)}, PRINTER_TOP = ${PRINTER_TOP}, RAM = ${JSON.stringify(RAM)}, HOUSING = ${JSON.stringify(HOUSING)}, HOUSING_Z = ${HOUSING_Z}, RAM_REST = ${RAM_REST};
const ramPaths = ${ramPaths.toString().replace(/k\./g, "")};
const needle = ${needle.toString().replace(/k\./g, "")};
const paperPaths = ${paperPaths.toString().replace(/k\./g, "")};
const stage = document.querySelector(".iso-stage"), svg = stage.querySelector("svg");
const $ = (name) => svg.querySelector('[data-part="' + name + '"]');
const cart = $("carriage"), ram = $("ram"), paper = $("paper"), lines = $("lines"), portRing = $("port");
const lids = [0, 1, 2].map((i) => $("lid-" + i));
// painter's slot: travelling, the short ram is in front of the whole row; extended, it sits just after its target
const slots = [$("box-0"), $("box-1"), $("box-2"), $("sock")];
let slot = null;
const place = (after) => { if (slot !== after) { after.after(ram); slot = after; } };
const needles = AGENTS.map(([name]) => $("needle-" + name));
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const span = (t, a, b) => ease((t - a) / (b - a));
// one attack cycle, in seconds: move, strike, the three agents in parallel, the reporter, retract
const T = { move: 1.0, strike: 1.35, agents: [2.5, 2.75, 3.0], report: 3.8, back: 4.3, end: 5.4 };
let index = 0, clock = 0, from = PARK, x = PARK, reports = 0, tape = 0, frame = 0, last = 0, visible = false, touring = true, idle = 0;
function solid(paths, tone, lit) { return solidSvg(paths, { tone, crease: "lo", lit }); }
function draw(t) {
  const a = ATTACKS[index];
  x = from + (a.x - from) * span(t, 0, T.move);
  const strike = span(t, T.move, T.strike) * (1 - span(t, T.report, T.back));
  place(t < T.move || t >= T.back ? slots[3] : slots[a.box >= 0 ? a.box : 3]);
  cart.setAttribute("transform", translateAlong(P, [x, 0, 0]));
  ram.setAttribute("transform", translateAlong(P, [x, 0, 0]));
  ram.innerHTML = solid(ramPaths(strike * RAM_REACH), "hi", true);
  const hit = span(t, T.strike - 0.05, T.strike + 0.25) * (1 - span(t, T.back, T.back + 0.5));
  lids.forEach((lid, i) => lid.setAttribute("transform", translateAlong(P, [0, 0, i === a.box ? hit * LIFT : 0])));
  portRing.setAttribute("data-tone", a.box < 0 && hit > 0.5 ? "lit" : "mid");
  const p = T.agents.map((done) => span(t, T.strike, done) * (1 - span(t, T.end - 0.5, T.end)));
  const r = span(t, T.agents[2], T.report) * (1 - span(t, T.end - 0.5, T.end));
  [...p, r].forEach((v, i) => needles[i].setAttribute("d", needle(AGENTS[i][1], v)));
  const h = Math.min(PAPER_MAX, tape + PAPER_STEP * span(t, T.agents[2] + 0.2, T.report));
  paper.innerHTML = solid(paperPaths(h), "hi");
  const rows = [];
  for (let z = PRINTER_TOP + h - 3; z > PRINTER_TOP + 1.5; z -= 2.2) rows.push(segment([PAPER.x + 3, PAPER.y + PAPER.d, z], [PAPER.x + PAPER.w - 3 - ((z * 7) % 9), PAPER.y + PAPER.d, z], P));
  lines.innerHTML = rows.length ? '<path class="iso-line" data-tone="lo" data-free="both" d="' + rows.join("") + '"/>' : "";
  let state = "moving";
  if (t >= T.move) state = "striking";
  if (t >= T.strike) state = "scanner, monitor, network running";
  if (t >= T.agents[2]) state = "reporter writing";
  if (t >= T.report) state = "report " + (reports + 1) + " filed";
  const text = a.name + " → " + a.hits + " · " + state;
  if (readout.textContent !== text) readout.textContent = text;
  stage.setAttribute("aria-valuenow", String(index + 1));
  stage.setAttribute("aria-valuetext", text);
}
function next(to) {
  from = x; clock = 0;
  if (to !== undefined) index = to; else index = (index + 1) % ATTACKS.length;
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now; clock += dt;
  if (clock >= T.end) {
    reports += 1; tape = Math.min(PAPER_MAX, tape + PAPER_STEP); if (tape >= PAPER_MAX) tape = 0;
    if (touring) next(); else clock = T.end;
  }
  draw(clock);
  frame = visible && (touring || clock < T.end) ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
const pick = (i) => {
  if (i === index && clock < T.end) return;
  touring = false; next(i);
  if (still.matches) return draw(T.report + 0.1); // reduced motion: show the finished attack, no motion
  clearTimeout(idle);
  idle = setTimeout(() => { touring = true; next(); run(); }, 6000); // resume on a fresh cycle so the last report is not counted twice
  run();
};
new IntersectionObserver((e) => { visible = e[e.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
stage.addEventListener("pointermove", (e) => {
  const box = svg.getBoundingClientRect();
  pick(Math.max(0, Math.min(ATTACKS.length - 1, Math.floor(((e.clientX - box.left) / box.width) * ATTACKS.length))));
});
stage.addEventListener("keydown", (e) => {
  let to = null;
  if (e.key === "ArrowRight" || e.key === "ArrowUp") to = (index + 1) % ATTACKS.length;
  if (e.key === "ArrowLeft" || e.key === "ArrowDown") to = (index + ATTACKS.length - 1) % ATTACKS.length;
  if (to === null) return;
  e.preventDefault(); pick(to);
});
if (still.matches) { from = ATTACKS[0].x; draw(T.report + 0.1); } else draw(0);
`;

const body = k.plateHtml({
  fig: "Fig 3",
  title: "Container Sentinel",
  hint: "Hover across to pick an attack",
  readout: "nsenter escape → flask-target · moving",
  keys: [
    { mark: "lit", label: "The ram: one of five real attacks from src/attacks" },
    { mark: "raised", label: "Sandbox, left to right: nginx-target, flask-target (privileged, socket mounted), redis-target, then the docker.sock pillar" },
    { mark: "edge", label: "Agent dials: scanner, monitor and network run together, then the reporter" },
  ],
  caption:
    "Each attack runs for real against a deliberately weak container. nsenter hits the privileged flask container, the Redis attack hits redis:5.0, and the socket escape, AuthZ bypass and runc CVE go through docker.sock to the host. Then the scanner, monitor and network agents run in parallel, and the reporter writes up their findings.",
  body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="Container Sentinel: arrow keys pick an attack" aria-valuemin="1" aria-valuemax="5" aria-valuenow="1">${svg}</div>`,
});

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, k.pageHtml({ title: "Container Sentinel", theme: "light", body: EMBED + body, script: kitScript() + live }));
console.log("wrote", OUT);
