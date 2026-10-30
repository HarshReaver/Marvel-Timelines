// Search and sharing metadata for every page, built from assets/data.js and assets/media.js.
// Run after adding or editing titles:   node tools/build-seo.mjs
// It rewrites each page's <title>, description, the plain-HTML title list inside the tree/catalog container and the block between <!-- seo:start --> and <!-- seo:end -->,
// and regenerates sitemap.xml and llms.txt. Nothing else in the pages is touched.
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {fileURLToPath} from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://marvel.harver.in/";
const AUTHOR = {"@type": "Person", name: "Harsh Verma", url: "https://www.linkedin.com/in/harsh-verma007/",
  sameAs: ["https://www.linkedin.com/in/harsh-verma007/", "https://github.com/HarshReaver"]};
const today = new Date().toISOString().slice(0, 10);

const box = {window: {}};
vm.createContext(box);
for (const f of ["assets/data.js", "assets/media.js"]) vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), box);
const {TITLES, MEDIA} = box.window;

// file, search title, description, which titles the page lists
const PAGES = [
  {file: "index.html", title: "Marvel Timelines: Every MCU, X-Men & Spider-Man Watch Order",
    desc: "An unofficial guide to every Marvel screen timeline: the MCU, Fox X-Men, Netflix, Sony Spider-Man, the 2000s films and the road to Avengers: Doomsday, in story and release order.",
    pick: () => false},
  {file: "mcu.html", title: "MCU Timeline: Watch Order in Story & Release Order",
    desc: "Every Marvel Cinematic Universe film and series as a vertical timeline, in story order or release order, with full plot summaries and how each title connects.",
    pick: x => x.pg === "mcu" || x.ph},
  {file: "xmen.html", title: "X-Men Movies in Order: Both Fox Timelines Explained",
    desc: "The Fox X-Men films as a vertical tree: the 1973 split in Days of Future Past, the original and revised timelines, Deadpool, Logan and the jump into the MCU.",
    pick: x => x.pg === "xmen"},
  {file: "street-level.html", title: "Daredevil, Punisher & Marvel Netflix Shows in Order",
    desc: "Netflix's Daredevil, Jessica Jones, Luke Cage, Iron Fist, The Defenders and The Punisher, Marvel's ABC, Hulu and Freeform shows, and Daredevil: Born Again, in watch order.",
    pick: x => x.pg === "street"},
  {file: "spider-verse.html", title: "Spider-Man Movies in Order: Every Spider-Verse Timeline",
    desc: "Every Spider-Man on screen: Raimi, Webb, Holland, Sony's Venom films and spin-offs, and the animated Spider-Verse, shown as a tree of separate universes.",
    pick: x => x.pg === "spider" || x.id === "yfnsm"},
  {file: "legacy.html", title: "2000s Marvel Movies: Blade, Hulk, Ghost Rider & More",
    desc: "Marvel films from other studios before and alongside the MCU: Blade, Hulk, Daredevil, Elektra, Fantastic Four, Ghost Rider and the Punisher films.",
    pick: x => x.pg === "legacy"},
  {file: "multiverse.html", title: "Road to Avengers: Doomsday & Secret Wars Explained",
    desc: "How separate Marvel film universes cross over: No Way Home, Multiverse of Madness, Deadpool & Wolverine, and on to Avengers: Doomsday and Secret Wars.",
    pick: x => x.mv},
  {file: "catalog.html", title: "Every Marvel Movie & Series: Full Catalog with Filters",
    desc: "Every Marvel film and series in one list, with filters for section, format and connections, plus seasons, episodes and plot summaries.",
    pick: () => true},
  {file: "about.html", title: "About Marvel Timelines",
    desc: "What Marvel Timelines covers, how connections are decided, and who made it.", pick: () => false}
];

const url = p => SITE + (p.file === "index.html" ? "" : p.file);
const esc = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const abs = img => !img ? undefined : /^https?:/.test(img) ? img.split("?")[0] : SITE + img;
const kind = x => x.ty === "S" || (x.ty === "A" && MEDIA[x.id]?.e) ? "TVSeries" : "Movie";
const home = Object.fromEntries(PAGES.map(p => [p.file, p]));
const pageOf = x => ({mcu: "mcu.html", xmen: "xmen.html", street: "street-level.html", spider: "spider-verse.html", legacy: "legacy.html"})[x.pg] || "catalog.html";

function itemList(p, list) {
  return {"@type": "ItemList", name: p.title, numberOfItems: list.length, itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: list.map((x, i) => {
      const m = MEDIA[x.id] || {};
      const item = {"@type": kind(x), name: x.t, datePublished: String(x.y), description: x.d,
        url: SITE + pageOf(x) + "#t=" + x.id, image: abs(m.img)};
      if (item["@type"] === "TVSeries" && m.s) item.numberOfSeasons = m.s;
      if (item["@type"] === "TVSeries" && m.e) item.numberOfEpisodes = m.e;
      if (m.wp) item.sameAs = "https://en.wikipedia.org/wiki/" + encodeURIComponent(m.wp.replace(/ /g, "_"));
      return {"@type": "ListItem", position: i + 1, item};
    })};
}

function jsonLd(p) {
  const website = {"@type": "WebSite", "@id": SITE + "#website", url: SITE, name: "Marvel Timelines", inLanguage: "en",
    description: home["index.html"].desc, author: AUTHOR, publisher: AUTHOR};
  const graph = [website];
  if (p.file === "index.html") {
    graph.push({"@type": "ItemList", name: "Marvel Timelines sections", itemListElement: PAGES.filter(q => q.file !== "index.html")
      .map((q, i) => ({"@type": "ListItem", position: i + 1, name: q.title, url: url(q)}))});
  } else {
    const list = TITLES.filter(p.pick).sort((a, b) => a.y - b.y);
    const page = {"@type": list.length ? "CollectionPage" : "AboutPage", "@id": url(p), url: url(p), name: p.title,
      description: p.desc, inLanguage: "en", isPartOf: {"@id": SITE + "#website"}, author: AUTHOR, dateModified: today,
      breadcrumb: {"@type": "BreadcrumbList", itemListElement: [
        {"@type": "ListItem", position: 1, name: "Home", item: SITE},
        {"@type": "ListItem", position: 2, name: p.title, item: url(p)}]}};
    if (list.length) page.mainEntity = itemList(p, list);
    graph.push(page);
  }
  return JSON.stringify({"@context": "https://schema.org", "@graph": graph}).replace(/<\//g, "<\\/");
}

// Plain-HTML copy of each page's titles inside the tree/catalog container. Crawlers that don't run JavaScript
// (most AI crawlers, SEO tools) read it; in a browser the scripts replace it with the interactive tree at once.
const TYPE = {F: "Film", S: "Series", A: "Animated", X: "Special"};
function staticList(list) {
  if (!list.length) return "";
  const eps = x => { const m = MEDIA[x.id] || {}; return x.ty !== "F" && x.ty !== "X" && m.e ? ` · ${m.s > 1 ? m.s + " seasons, " : ""}${m.e} episodes` : ""; };
  return `<!-- static:start --><div class="static-list"><h2>All ${list.length} titles in release order</h2><ol>${list.map(x =>
    `<li><h3>${esc(x.t)} (${x.y})</h3><p>${TYPE[x.ty]} · ${esc(x.pl)}${eps(x)}</p><p>${esc(x.d)}</p></li>`).join("")}</ol></div><!-- static:end -->`;
}

for (const p of PAGES) {
  const file = path.join(ROOT, p.file);
  let html = fs.readFileSync(file, "utf8");
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(p.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(p.desc)}">`)
    .replace(/\n?<!-- seo:start[\s\S]*?<!-- seo:end -->/g, "")
    .replace(/(<div id="(?:tree|list)"[^>]*>)(?:<!-- static:start -->[\s\S]*?<!-- static:end -->)?(<\/div>)/,
      (_, open, close) => open + staticList(TITLES.filter(p.pick).sort((a, b) => a.y - b.y)) + close);
  const block = `
<!-- seo:start (generated by tools/build-seo.mjs, do not edit by hand) -->
<link rel="canonical" href="${url(p)}">
<link rel="icon" href="favicon.png" type="image/png"><link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="author" content="Harsh Verma">
<meta property="og:type" content="website"><meta property="og:site_name" content="Marvel Timelines">
<meta property="og:title" content="${esc(p.title)}"><meta property="og:description" content="${esc(p.desc)}">
<meta property="og:url" content="${url(p)}"><meta property="og:image" content="${SITE}assets/share.jpg">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${jsonLd(p)}</script>
<!-- seo:end -->`;
  html = html.replace("</head>", block + "\n</head>");
  fs.writeFileSync(file, html);
}

fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(p => `  <url><loc>${url(p)}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`);

// llms.txt: a plain summary that AI assistants and crawlers read without running the site's JavaScript
const count = p => TITLES.filter(p.pick).length;
fs.writeFileSync(path.join(ROOT, "llms.txt"), `# Marvel Timelines

> ${home["index.html"].desc} Made by Harsh Verma. Unofficial fan guide, ${TITLES.length} titles, updated ${today}.

Each section shows a vertical timeline you can switch between story order (a sensible watch order) and release order,
with full plot summaries, seasons and episodes for series, and only genuine story connections between titles.

## Sections

${PAGES.filter(p => p.file !== "index.html").map(p => `- [${p.title}](${url(p)})${count(p) ? ` (${count(p)} titles)` : ""}: ${p.desc}`).join("\n")}

## Titles

${TITLES.slice().sort((a, b) => a.y - b.y).map(x => `- ${x.t} (${x.y}): ${SITE}${pageOf(x)}#t=${x.id}`).join("\n")}
`);
console.log(`Updated ${PAGES.length} pages, sitemap.xml and llms.txt for ${TITLES.length} titles.`);
