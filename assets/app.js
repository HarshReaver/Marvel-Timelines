/* Marvel Timelines: shared nav, title lists, filters and the detail dialog. */
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

  /* ---------- nav + footer ---------- */
  const NAV = [["index.html", "Home", "home"], ["mcu.html", "MCU", "mcu"], ["xmen.html", "X-Men", "xmen"],
    ["street-level.html", "Street Level", "street"], ["spider-verse.html", "Spider-Verse", "spider"],
    ["legacy.html", "2000s Era", "legacy"], ["multiverse.html", "Multiverse", "tva"],
    ["catalog.html", "Catalog", "catalog"], ["about.html", "About", "about"]];
  const nav = document.getElementById("site-nav");
  if (nav) nav.outerHTML = `<header class="nav"><div class="wrap">
    <a class="mark" href="index.html">MARVEL<b>//</b>TIMELINES</a>
    <ul>${NAV.map(([h, l, k]) => `<li><a href="${h}"${k === page ? ' aria-current="page"' : ""}>${l}</a></li>`).join("")}</ul>
  </div></header>`;
  const foot = document.getElementById("site-foot");
  if (foot) foot.outerHTML = `<footer class="foot"><div class="wrap">
    <span>Created by <b>Harsh Verma</b></span>
    <span>Unofficial fan project, not affiliated with Marvel Studios, Disney, Sony or Fox.</span>
    <span>${T.length} titles · updated Oct 2026</span></div></footer>`;

  /* ---------- dialog ---------- */
  const dlg = document.createElement("dialog");
  dlg.setAttribute("aria-labelledby", "dlg-title");
  document.body.appendChild(dlg);
  dlg.addEventListener("click", e => {
    if (e.target === dlg) dlg.close();
    const b = e.target.closest("[data-open]");
    if (b) openTitle(b.dataset.open);
  });
  dlg.addEventListener("close", () => history.replaceState(null, "", location.pathname + location.search));

  function openTitle(id) {
    const x = BY[id];
    if (!x) return;
    const links = ADJ[id].slice().sort((a, b) => sortRel(BY[a.id], BY[b.id]));
    const home = window.PAGES[x.pg];
    const tags = [x.mv ? '<span class="tag mv">Doomsday road</span>' : "", x.up ? '<span class="tag up">Upcoming</span>' : ""].join(" ");
    dlg.innerHTML = `<div class="dlg-top"><div class="kicker">${home.name} · ${x.g}</div>
        <h3 id="dlg-title">${x.t}</h3>${tags}
        <button class="dlg-x" aria-label="Close" onclick="this.closest('dialog').close()">×</button></div>
      <div class="dlg-body">
        <dl class="facts"><dt>Released</dt><dd>${x.y}${x.up ? " (planned)" : ""}</dd>
          <dt>Format</dt><dd>${TYPE[x.ty]}</dd><dt>Where</dt><dd>${x.pl}</dd>
          ${x.set ? `<dt>Story year</dt><dd>${x.set}</dd>` : ""}</dl>
        <p>${x.n}</p>
        ${links.length ? `<div class="kicker" style="margin-bottom:6px">Connected to (${links.length})</div>
          <ul class="links">${links.map(e => `<li><button data-open="${e.id}">${BY[e.id].t} <small>(${BY[e.id].y})</small></button><span>${e.note}</span></li>`).join("")}</ul>`
        : `<div class="solo-note">Standalone. No story links to other titles, so it isn't connected on any map.</div>`}
        ${x.pg !== page && x.pg !== "other" ? `<a class="go" href="${home.file}#t=${x.id}">Open on the ${home.name} page →</a>` : ""}
      </div>`;
    if (!dlg.open) dlg.showModal();
    history.replaceState(null, "", "#t=" + id);
  }
  window.openTitle = openTitle;
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-open]");
    if (b && !dlg.contains(b)) { e.preventDefault(); openTitle(b.dataset.open); }
  });
  const fromHash = () => { const m = location.hash.match(/^#t=([\w-]+)/); if (m) openTitle(m[1]); };
  window.addEventListener("hashchange", fromHash);

  /* ---------- lists ---------- */
  const card = (x, extra = "", gc) => {
    const n = ADJ[x.id].length;
    return `<button class="card" data-open="${x.id}" style="--gc:${gc || window.GROUP_COLORS[x.g] || ""}">
      <span class="yr"><span>${x.y}${x.set && extra === "story" ? ` · set ${x.set}` : ""}</span><span>${TYPE[x.ty]}</span></span>
      <span class="tt">${x.t}</span><span class="mt">${x.pl}</span>
      <span class="tags">${x.up ? '<span class="tag up">Upcoming</span>' : ""}${x.mv ? '<span class="tag mv">Doomsday road</span>' : ""}
      ${n ? `<span class="tag">${n} link${n > 1 ? "s" : ""}</span>` : '<span class="tag solo">Standalone</span>'}</span></button>`;
  };

  const list = document.getElementById("list");
  if (list) {
    const pgs = (list.dataset.pg || "all").split(",");
    const story = list.dataset.story === "1", catalog = pgs[0] === "all", also = list.dataset.also === "ph";
    const inPage = x => catalog || pgs.includes(x.pg) || (also && x.ph);
    const grp = x => (also && x.ph) || x.g;
    const st = {ty: "all", q: "", mv: false, linked: false, sort: "release", pg: "all"};
    const ctl = document.createElement("div");
    ctl.className = "controls";
    ctl.innerHTML = `<div class="seg" role="group" aria-label="Format">${[["all", "All"], ["F", "Films"], ["S", "Series"], ["A", "Animated"], ["X", "Specials"]]
        .map(([v, l]) => `<button data-ty="${v}" aria-pressed="${v === "all"}">${l}</button>`).join("")}</div>
      ${story ? `<div class="seg" role="group" aria-label="Order"><button data-sort="release" aria-pressed="true">Release order</button><button data-sort="story" aria-pressed="false">Story order</button></div>` : ""}
      ${catalog ? `<select data-pg aria-label="Section"><option value="all">All sections</option>${Object.entries(window.PAGES).map(([k, p]) => `<option value="${k}">${k === "other" ? "Other / adult animation" : p.name}</option>`).join("")}</select>` : ""}
      <input type="search" placeholder="Search titles or notes" aria-label="Search">
      <label><input type="checkbox" data-mv> Doomsday road only</label>
      ${catalog ? '<label><input type="checkbox" data-linked> Connected only</label>' : ""}
      <span class="count"></span>`;
    list.before(ctl);

    const draw = () => {
      let items = T.filter(x => inPage(x)
        && (st.pg === "all" || x.pg === st.pg)
        && (st.ty === "all" || x.ty === st.ty)
        && (!st.mv || x.mv) && (!st.linked || ADJ[x.id].length)
        && (!st.q || (x.t + " " + x.n + " " + x.pl).toLowerCase().includes(st.q)));
      const groups = new Map();
      if (st.sort === "story") {
        items.filter(x => x.set).sort((a, b) => a.set - b.set || a.y - b.y).forEach(x => push(groups, "In-story order", x));
        items.filter(x => !x.set).sort(sortRel).forEach(x => push(groups, "No fixed story year", x));
      } else if (catalog) {
        items.sort(sortRel).forEach(x => push(groups, Math.floor(x.y / 10) * 10 + "s", x));
      } else {
        const order = Object.keys(window.GROUP_COLORS);
        items.sort((a, b) => order.indexOf(grp(a)) - order.indexOf(grp(b)) || sortRel(a, b)).forEach(x => push(groups, grp(x), x));
      }
      list.innerHTML = items.length ? [...groups].map(([g, xs]) => `<section class="group" style="--gc:${window.GROUP_COLORS[g] || "var(--ink)"}" id="${slug(g)}">
        <div class="group-head"><h2>${g}</h2><span class="bar"></span><small>${xs.length} title${xs.length > 1 ? "s" : ""}</small></div>
        <div class="grid">${xs.map(x => card(x, st.sort, window.GROUP_COLORS[grp(x)])).join("")}</div></section>`).join("")
        : '<p class="empty">Nothing matches those filters.</p>';
      ctl.querySelector(".count").textContent = `${items.length} of ${T.filter(inPage).length} shown`;
    };
    ctl.addEventListener("click", e => {
      const b = e.target.closest("button");
      if (!b) return;
      const key = b.dataset.ty ? "ty" : "sort";
      st[key] = b.dataset[key];
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
  function push(m, k, v) { if (!m.has(k)) m.set(k, []); m.get(k).push(v); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-"); }

  // stat helpers for the home page
  window.SITE = {count: pg => T.filter(x => x.pg === pg).length, BY, ADJ};
  fromHash();
})();
