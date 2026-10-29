/* Marvel Timelines: shared nav, footer, connection graph, detail dialog and the catalog grid. */
(function () {
  const T = window.TITLES, BY = Object.fromEntries(T.map(x => [x.id, x]));
  const TYPE = {F: "Film", S: "Series", A: "Animated", X: "Special"};
  const page = document.body.dataset.page || "";

  // two-way connection graph
  const ADJ = {};
  T.forEach(x => (ADJ[x.id] = []));
  T.forEach(x => (x.l || []).forEach(([to, note]) => {
    if (!BY[to]) return console.warn("Unknown link", x.id, "→", to);
    ADJ[x.id].push({id: to, note});
    if (!ADJ[to].some(e => e.id === x.id)) ADJ[to].push({id: x.id, note});
  }));
  const sortRel = (a, b) => a.y - b.y || T.indexOf(a) - T.indexOf(b);
  const logoImg = (k, cls = "") => {
    const L = window.LOGOS[k];
    return L ? `<img class="logo ${L.dark ? "logo-dark" : ""} ${cls}" src="assets/logos/${L.f}" alt="" loading="lazy">` : "";
  };

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
  const foot = document.getElementById("site-foot");
  if (foot) foot.outerHTML = `<footer class="foot"><div class="wrap">
    <span>Created by <b>Harsh Verma</b></span>
    <span>Unofficial fan project, not affiliated with Marvel Studios, Disney, Sony or Fox. Logos via Wikimedia Commons.</span>
    <span>${T.length} titles · updated Oct 2026</span></div></footer>`;

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
    const home = window.PAGES[x.pg];
    dlg.innerHTML = `<div class="dlg-top"><div class="kicker">${home.name} · ${x.g}</div>
        <h3 id="dlg-title">${x.t}</h3>${tagsHTML(x)}
        <button class="dlg-x" aria-label="Close" onclick="this.closest('dialog').close()">×</button></div>
      <div class="dlg-body">
        <dl class="facts"><dt>Released</dt><dd>${x.y}${x.up ? " (planned)" : ""}</dd>
          <dt>Format</dt><dd>${TYPE[x.ty]}</dd><dt>Where</dt><dd>${x.pl}</dd>
          ${x.set ? `<dt>Story year</dt><dd>${x.set}</dd>` : ""}</dl>
        <p>${x.d}</p>
        ${links.length ? `<div class="kicker" style="margin-bottom:6px">Connected to (${links.length})</div>
          <ul class="links">${links.map(e => `<li><button data-open="${e.id}">${BY[e.id].t} <small>(${BY[e.id].y})</small></button><span>${e.note}</span></li>`).join("")}</ul>`
        : `<div class="solo-note">Standalone. It has no story links to other titles.</div>`}
        ${x.pg !== page && x.pg !== "other" ? `<a class="go" href="${home.file}#t=${x.id}">Open on the ${home.name} page →</a>` : ""}
      </div>`;
    if (!dlg.open) dlg.showModal();
    history.replaceState(null, "", "#t=" + id);
  }
  function tagsHTML(x) {
    return `<span class="tags">${x.bad ? `<span class="tag bad">${x.bad}</span>` : ""}${x.up ? '<span class="tag up">Upcoming</span>' : ""}${x.mv ? '<span class="tag mv">Doomsday road</span>' : ""}</span>`;
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-open]");
    if (!b) return;
    e.preventDefault();
    // on a tree page, jump to the node if it's there; otherwise open the dialog
    const node = !dlg.open && document.getElementById("n-" + b.dataset.open);
    if (node) reveal(node, "smooth");
    else openTitle(b.dataset.open);
  });
  const fromHash = () => {
    const m = location.hash.match(/^#t=([\w-]+)/);
    if (!m) return;
    const node = document.getElementById("n-" + m[1]);
    if (node) reveal(node, "auto"); else openTitle(m[1]);
  };
  window.addEventListener("hashchange", fromHash);
  function reveal(node, behavior) {
    const sec = node.closest(".t-sec.closed");
    if (sec && window.TREE) window.TREE.open(sec);
    node.scrollIntoView({behavior, block: "center"});
    node.classList.remove("flash"); void node.offsetWidth; node.classList.add("flash");
  }

  window.SITE = {T, BY, ADJ, TYPE, sortRel, logoImg, tagsHTML, openTitle, page,
    count: pg => T.filter(x => x.pg === pg).length, fromHash};

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
    const draw = () => {
      const items = T.filter(x => (st.pg === "all" || x.pg === st.pg) && (st.ty === "all" || x.ty === st.ty)
        && (!st.mv || x.mv) && (!st.linked || ADJ[x.id].length)
        && (!st.q || (x.t + " " + x.d + " " + x.pl).toLowerCase().includes(st.q))).sort(sortRel);
      const groups = new Map();
      items.forEach(x => { const k = Math.floor(x.y / 10) * 10 + "s"; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(x); });
      list.innerHTML = items.length ? [...groups].map(([g, xs]) => `<section class="group">
        <div class="group-head"><h2>${g}</h2><span class="bar"></span><small>${xs.length} title${xs.length > 1 ? "s" : ""}</small></div>
        <div class="grid">${xs.map(card).join("")}</div></section>`).join("") : '<p class="empty">Nothing matches those filters.</p>';
      ctl.querySelector(".count").textContent = `${items.length} of ${T.length} shown`;
    };
    const card = x => {
      const n = ADJ[x.id].length;
      return `<article class="card" style="--gc:${window.GROUP_COLORS[x.g] || ""}">
        <span class="yr"><span>${x.y}</span><span>${TYPE[x.ty]} · ${x.pl}</span></span>
        <h3 class="tt">${x.t}</h3>${tagsHTML(x)}<p class="cd">${x.d}</p>
        <button class="more" data-open="${x.id}">${n ? `${n} connection${n > 1 ? "s" : ""} →` : "Standalone"}</button></article>`;
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
