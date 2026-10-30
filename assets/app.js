/* Marvel Timelines: shared nav, footer, poster walls, connection graph, detail dialog and the catalog grid. */
(function () {
  const T = window.TITLES, BY = Object.fromEntries(T.map(x => [x.id, x]));
  const MEDIA = window.MEDIA || {};
  const TYPE = {F: "Film", S: "Series", A: "Animated", X: "Special"};
  const page = document.body.dataset.page || "";
  const SITE_URL = "https://harshreaver.github.io/Marvel-Timelines/";
  const REPO_URL = "https://github.com/HarshReaver/Marvel-Timelines";
  const LINKEDIN = "https://www.linkedin.com/in/harsh-verma007/";

  // an upcoming title counts as released from its `rel` date, on the visitor's own calendar
  const now = new Date(), pad = n => String(n).padStart(2, "0");
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  T.forEach(x => { if (x.up && x.rel && today >= x.rel) x.up = 0; });

  // visitor stats with GoatCounter (no cookies), counted only on the live site so local previews stay out
  if (location.hostname === "harshreaver.github.io") {
    const gc = document.createElement("script");
    gc.async = true; gc.src = "https://gc.zgo.at/count.js";
    gc.dataset.goatcounter = "https://marvel-timelines.goatcounter.com/count";
    document.head.appendChild(gc);
  }

  // two-way connection graph
  const ADJ = {};
  T.forEach(x => (ADJ[x.id] = []));
  T.forEach(x => (x.l || []).forEach(([to, note]) => {
    if (!BY[to]) return console.warn("Unknown link", x.id, "→", to);
    ADJ[x.id].push({id: to, note});
    if (!ADJ[to].some(e => e.id === x.id)) ADJ[to].push({id: x.id, note});
  }));
  const sortRel = (a, b) => a.y - b.y || T.indexOf(a) - T.indexOf(b);

  // poster or title card from Wikipedia; "wide" means a landscape title card
  const media = id => MEDIA[id] || {};
  const isWide = id => { const m = media(id); return !!(m.img && m.w > m.h); };
  const posterImg = (id, cls = "n-poster") => {
    const m = media(id);
    return m.img ? `<img class="${cls}" src="${m.img}" width="${m.w}" height="${m.h}" alt="" loading="lazy" referrerpolicy="no-referrer">` : "";
  };
  const imgClass = id => media(id).img ? (isWide(id) ? " wide-img" : "") : " no-img";
  const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
  const epsText = x => {
    const m = media(x.id);
    if (x.ty === "F" || x.ty === "X" || !m.e) return "";
    return m.s && m.s > 1 ? `${plural(m.s, "season")}, ${plural(m.e, "episode")}` : plural(m.e, "episode");
  };
  const wpLink = x => media(x.id).wp ? `<a class="n-wp" href="https://en.wikipedia.org/wiki/${encodeURIComponent(media(x.id).wp.replace(/ /g, "_"))}" target="_blank" rel="noopener">Wikipedia</a>` : "";
  const tagsHTML = x => `<span class="tags">${x.bad ? `<span class="tag bad">${x.bad}</span>` : ""}${x.up ? '<span class="tag up">Upcoming</span>' : ""}${x.mv ? '<span class="tag mv">Doomsday road</span>' : ""}</span>`;

  /* ---------- nav + footer ---------- */
  const NAV = [["index.html", "Home", "home"], ["mcu.html", "MCU", "mcu"], ["xmen.html", "X-Men", "xmen"],
    ["street-level.html", "Street Level", "street"], ["spider-verse.html", "Spider-Verse", "spider"],
    ["legacy.html", "2000s Era", "legacy"], ["multiverse.html", "Multiverse", "tva"],
    ["catalog.html", "Catalog", "catalog"], ["about.html", "About", "about"]];
  const nav = document.getElementById("site-nav");
  if (nav) nav.outerHTML = `<header class="nav"><div class="wrap">
    <a class="mark" href="index.html"><img src="assets/logos/marvel.svg" alt="Marvel"><span>Timelines</span></a>
    <ul>${NAV.map(([h, l, k]) => `<li><a href="${h}"${k === page ? ' aria-current="page"' : ""}>${l}</a></li>`).join("")}</ul>
  </div></header>`;
  const OFFICIAL = [["https://www.marvel.com", "marvel.svg", "Marvel"], ["https://www.disneyplus.com", "disney-plus.svg", "Disney+"],
    ["https://www.netflix.com", "netflix.svg", "Netflix"], ["https://www.sonypictures.com", "sony-pictures.svg", "Sony Pictures"],
    ["https://www.primevideo.com", "prime-video.svg", "Prime Video"], ["https://www.hulu.com", "hulu.svg", "Hulu"]];
  const foot = document.getElementById("site-foot");
  if (foot) foot.outerHTML = `<footer class="foot"><div class="wrap">
    <div class="foot-grid">
      <div><h4>Marvel Timelines</h4>
        <p>Created by <b>Harsh Verma</b>. A fan-made guide to how every Marvel film and series fits together.</p>
        <p>Unofficial. Not affiliated with Marvel Studios, Disney, Sony, Netflix or 20th Century Studios.</p></div>
      <div><h4>Project</h4>
        <a href="${SITE_URL}">Live site</a><a href="${REPO_URL}" target="_blank" rel="noopener">Source on GitHub</a>
        <a href="${LINKEDIN}" target="_blank" rel="noopener">Harsh Verma on LinkedIn</a></div>
      <div><h4>Official sites</h4>
        ${OFFICIAL.map(([u, , n]) => `<a href="${u}" target="_blank" rel="noopener">${n}</a>`).join("")}</div>
    </div>
    <div class="foot-logos">${OFFICIAL.map(([u, f, n]) => `<a href="${u}" target="_blank" rel="noopener"><img src="assets/logos/${f}" alt="${n}"></a>`).join("")}</div>
    <p class="foot-note">Posters and title cards are shown from Wikipedia, and logos come from Wikimedia Commons. All titles, characters and artwork belong to their owners. ${T.length} titles, updated October 2026.</p>
  </div></footer>`;

  // poster walls behind page headers: <div class="poster-wall" data-ids="a,b,c">
  document.querySelectorAll(".poster-wall").forEach(w => {
    w.innerHTML = w.dataset.ids.split(",").filter(id => media(id).img).map(id => posterImg(id, isWide(id) ? "w2" : "")).join("");
    w.setAttribute("aria-hidden", "true");
  });

  /* ---------- dialog (connections in detail) ---------- */
  const dlg = document.createElement("dialog");
  dlg.setAttribute("aria-labelledby", "dlg-title");
  document.body.appendChild(dlg);
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => history.replaceState(null, "", location.pathname + location.search));

  function openTitle(id) {
    const x = BY[id];
    if (!x) return;
    const links = ADJ[id].slice().sort((a, b) => sortRel(BY[a.id], BY[b.id]));
    const home = window.PAGES[x.pg], eps = epsText(x);
    dlg.innerHTML = `<div class="dlg-top${isWide(id) ? " wide" : ""}">${posterImg(id)}
        <div><h3 id="dlg-title">${x.t}</h3>
        <div class="dlg-where">${x.y}${x.up ? " (planned)" : ""} · ${TYPE[x.ty]} · ${x.pl}${eps ? " · " + eps : ""}${x.set ? ` · story year ${x.set}` : ""}</div>${tagsHTML(x)}</div>
        <button class="dlg-x" aria-label="Close" onclick="this.closest('dialog').close()">×</button></div>
      <div class="dlg-body">
        <p>${x.d}</p>
        ${links.length ? `<p class="dlg-h">Connected to ${plural(links.length, "title")}</p>
          <ul class="links">${links.map(e => `<li><button data-open="${e.id}">${BY[e.id].t} (${BY[e.id].y})</button><span>${e.note}</span></li>`).join("")}</ul>`
        : `<div class="solo-note">Standalone. It has no story links to other titles.</div>`}
        ${wpLink(x)}${x.pg !== page && x.pg !== "other" ? ` · <a class="go" href="${home.file}#t=${x.id}">Open it on the ${home.name} page</a>` : ""}
      </div>`;
    if (!dlg.open) dlg.showModal();
    history.replaceState(null, "", "#t=" + id);
  }
  function reveal(node, behavior) {
    const sec = node.closest(".t-sec.closed");
    if (sec && window.TREE) window.TREE.open(sec);
    node.scrollIntoView({behavior, block: "center"});
    node.classList.remove("flash"); void node.offsetWidth; node.classList.add("flash");
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-open]");
    if (!b) return;
    e.preventDefault();
    // on a tree page, jump to the title if it's there; otherwise open the dialog
    const node = !dlg.open && document.getElementById("n-" + b.dataset.open);
    if (node) reveal(node, "smooth"); else openTitle(b.dataset.open);
  });
  const fromHash = () => {
    const m = location.hash.match(/^#t=([\w-]+)/);
    if (!m) return;
    const node = document.getElementById("n-" + m[1]);
    if (node) reveal(node, "auto"); else openTitle(m[1]);
  };
  window.addEventListener("hashchange", fromHash);

  window.SITE = {T, BY, ADJ, TYPE, sortRel, tagsHTML, openTitle, page, fromHash, posterImg, imgClass, epsText, wpLink,
    count: pg => T.filter(x => x.pg === pg).length};

  /* ---------- catalog grid ---------- */
  const list = document.getElementById("list");
  if (list) {
    const st = {ty: "all", q: "", mv: false, linked: false, pg: "all"};
    const ctl = document.createElement("div");
    ctl.className = "controls";
    ctl.innerHTML = `<div class="seg" role="group" aria-label="Format">${[["all", "All"], ["F", "Films"], ["S", "Series"], ["A", "Animated"], ["X", "Specials"]]
        .map(([v, l]) => `<button data-ty="${v}" aria-pressed="${v === "all"}">${l}</button>`).join("")}</div>
      <select data-pg aria-label="Section"><option value="all">All sections</option>${Object.entries(window.PAGES).map(([k, p]) => `<option value="${k}">${k === "other" ? "Other animation" : p.name}</option>`).join("")}</select>
      <input type="search" placeholder="Search titles or plots" aria-label="Search">
      <label><input type="checkbox" data-mv> Doomsday road only</label>
      <label><input type="checkbox" data-linked> Connected only</label>
      <span class="count"></span>`;
    list.before(ctl);
    const card = x => {
      const n = ADJ[x.id].length, eps = epsText(x);
      return `<article class="card${imgClass(x.id)}">${posterImg(x.id)}<div>
        <div class="yr">${x.y} · ${TYPE[x.ty]} · ${x.pl}${eps ? " · " + eps : ""}</div>
        <h3 class="tt">${x.t}</h3>${tagsHTML(x)}<p class="cd">${x.d}</p>
        <button class="more" data-open="${x.id}">${n ? `See ${plural(n, "connection")}` : "Standalone"}</button></div></article>`;
    };
    const draw = () => {
      const items = T.filter(x => (st.pg === "all" || x.pg === st.pg) && (st.ty === "all" || x.ty === st.ty)
        && (!st.mv || x.mv) && (!st.linked || ADJ[x.id].length)
        && (!st.q || (x.t + " " + x.d + " " + x.pl).toLowerCase().includes(st.q))).sort(sortRel);
      const groups = new Map();
      items.forEach(x => { const k = Math.floor(x.y / 10) * 10 + "s"; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(x); });
      list.innerHTML = items.length ? [...groups].map(([g, xs]) => `<section class="group">
        <div class="group-head"><h2>${g}</h2><span class="bar"></span><small>${plural(xs.length, "title")}</small></div>
        <div class="grid">${xs.map(card).join("")}</div></section>`).join("") : '<p class="empty">Nothing matches those filters.</p>';
      ctl.querySelector(".count").textContent = `${items.length} of ${T.length} shown`;
    };
    ctl.addEventListener("click", e => {
      const b = e.target.closest("button[data-ty]");
      if (!b) return;
      st.ty = b.dataset.ty;
      b.parentNode.querySelectorAll("button").forEach(o => o.setAttribute("aria-pressed", o === b));
      draw();
    });
    ctl.addEventListener("input", e => {
      if (e.target.type === "search") st.q = e.target.value.trim().toLowerCase();
      if (e.target.matches("[data-mv]")) st.mv = e.target.checked;
      if (e.target.matches("[data-linked]")) st.linked = e.target.checked;
      if (e.target.matches("[data-pg]")) st.pg = e.target.value;
      draw();
    });
    draw();
  }
  if (!document.getElementById("tree")) fromHash();
})();
