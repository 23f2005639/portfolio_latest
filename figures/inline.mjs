// the kit as inline source for a standalone figure page (exports stripped)
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const KIT = join(dirname(fileURLToPath(import.meta.url)), "kit");
export const kitScript = () => readFileSync(join(KIT, "iso-kit.mjs"), "utf8").replace(/^export /gm, "");

// inside the portfolio's iframe: no page margins, the site's white and Arial
export const EMBED = `<script>if (self !== top) document.documentElement.classList.add("embed")</script><style>.embed body{display:flow-root;background:#fff;font-family:Arial,"Helvetica Neue",Helvetica,sans-serif}.embed .iso-page{width:100%;margin:0}@media (max-width:640px){.embed .iso-plate{padding:48px 12px 70px}.embed .iso-plate-corner[data-corner="hint"]{bottom:18px}}</style>`;
