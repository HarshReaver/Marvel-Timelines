/* Marvel Timelines: shared nav, footer, poster walls, connection graph, detail dialog and the catalog grid. */
(function () {
  const T = window.TITLES, BY = Object.fromEntries(T.map(x => [x.id, x]));
  const MEDIA = window.MEDIA || {};
  const TYPE = {F: "Film", S: "Series", A: "Animated", X: "Special"};
  const page = document.body.dataset.page || "";
  const REPO_URL = "https://github.com/HarshReaver/Marvel-Timelines";
  const LINKEDIN = "https://www.linkedin.com/in/harsh-verma007/";
  const INSTAGRAM = "https://www.instagram.com/harsvrrrr/";
  const EMAIL = ["harshkrish2323", "gmail.com"].join("@"); // put together here so it isn't in the page source for spam bots

  // an upcoming title counts as released from its `rel` date, on the visitor's own calendar
  const now = new Date(), pad = n => String(n).padStart(2, "0");
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  T.forEach(x => { if (x.up && x.rel && today >= x.rel) x.up = 0; });

  // visitor stats with GoatCounter (no cookies), counted only on the live site so local previews stay out
  if (["marvel.harver.in", "harshreaver.github.io"].includes(location.hostname)) {
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
  const ALWAYS_DARK = ["mcu", "street", "spider", "legacy", "tva"];
  const MODE_BUTTON = `<button class="mode" type="button" aria-label="Dark theme" title="Dark theme">
      <svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
      <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
    </button>`;
  const nav = document.getElementById("site-nav");
  if (nav) nav.outerHTML = `<header class="nav"><div class="wrap">
    <a class="mark" href="index.html"><img src="assets/logos/marvel.svg" alt="Marvel"><span>Timelines</span></a>
    <ul>${NAV.map(([h, l, k]) => `<li><a href="${h}"${k === page ? ' aria-current="page"' : ""}>${l}</a></li>`).join("")}</ul>
    ${ALWAYS_DARK.includes(page) ? "" : MODE_BUTTON}
  </div></header>`;
  // Dark theme button. The choice is saved in the browser; the small script in each page head
  // applies it before the page draws, so there is no flash of the light theme.
  const modeBtn = document.querySelector(".nav .mode");
  if (modeBtn) {
    const root = document.documentElement;
    modeBtn.setAttribute("aria-pressed", root.dataset.mode === "dark");
    modeBtn.addEventListener("click", () => {
      const dark = root.dataset.mode !== "dark";
      if (dark) root.dataset.mode = "dark"; else delete root.dataset.mode;
      modeBtn.setAttribute("aria-pressed", dark);
      try { localStorage.setItem("mode", dark ? "dark" : "light"); } catch (e) {}
    });
  }
  const OFFICIAL = [["https://www.marvel.com", "marvel.svg", "Marvel"], ["https://www.disneyplus.com", "disney-plus.svg", "Disney+"],
    ["https://www.netflix.com", "netflix.svg", "Netflix"], ["https://www.sonypictures.com", "sony-pictures.svg", "Sony Pictures"],
    ["https://www.primevideo.com", "prime-video.svg", "Prime Video"], ["https://www.hulu.com", "hulu.svg", "Hulu"]];
  // footer contact icons: [link, label, 24×24 icon]
  const icon = (body, stroke) => `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" ${stroke ? 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' : 'fill="currentColor"'}>${body}</svg>`;
  const SOCIAL = [
    [REPO_URL, "Source on GitHub", icon('<path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.4-.5-1.6.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"/>')],
    [LINKEDIN, "Harsh Verma on LinkedIn", icon('<path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.3zM5.3 7.4a2.1 2.1 0 1 1 0-4.1 2.1 2.1 0 0 1 0 4.1zm1.8 13.1H3.6V9h3.5v11.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z"/>')],
    [INSTAGRAM, "Instagram @harsvrrrr", icon('<rect x="2" y="2" width="20" height="20" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none"/>', 1)],
    [`mailto:${EMAIL}?subject=Marvel%20Timelines`, `Email ${EMAIL}`, icon('<rect x="2" y="4" width="20" height="16" rx="2.5"/><path d="m3 6.5 9 6.5 9-6.5"/>', 1)]];
  const foot = document.getElementById("site-foot");
  if (foot) foot.outerHTML = `<footer class="foot"><div class="wrap">
    <div class="foot-grid">
      <div><h4>Marvel Timelines</h4>
        <p>Created by <b>Harsh Verma</b>. A fan-made guide to how every Marvel film and series fits together.</p>
        <p>Unofficial. Not affiliated with Marvel Studios, Disney, Sony, Netflix or 20th Century Studios.</p></div>
      <div><h4>Contact</h4>
        <div class="foot-social">${SOCIAL.map(([u, label, svg]) => `<a href="${u}"${u.startsWith("mailto") ? "" : ' target="_blank" rel="noopener"'} aria-label="${label}" title="${label}">${svg}</a>`).join("")}</div></div>
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
    const st = {ty: "all", q: "", mv: false, linked: false, pg: "all", ch: ""};
    // character name → ids of the titles they appear in (rules in data.js)
    const CH = {};
    Object.entries(window.CHARACTERS || {}).forEach(([name, r]) => {
      CH[name] = new Set(T.filter(x => (r.add || []).includes(x.id) || (r.re.test(x.t + " " + x.d) && !(r.not || []).includes(x.id))).map(x => x.id));
    });
    const ctl = document.createElement("div");
    ctl.className = "controls";
    ctl.innerHTML = `<div class="seg" role="group" aria-label="Format">${[["all", "All"], ["F", "Films"], ["S", "Series"], ["A", "Animated"], ["X", "Specials"]]
        .map(([v, l]) => `<button data-ty="${v}" aria-pressed="${v === "all"}">${l}</button>`).join("")}</div>
      <select data-pg aria-label="Section"><option value="all">All sections</option>${Object.entries(window.PAGES).map(([k, p]) => `<option value="${k}">${k === "other" ? "Other animation" : p.name}</option>`).join("")}</select>
      <select data-ch aria-label="Character"><option value="">All characters</option>${Object.keys(CH).sort().map(n => `<option value="${n}">${n} (${CH[n].size})</option>`).join("")}</select>
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
        && (!st.mv || x.mv) && (!st.linked || ADJ[x.id].length) && (!st.ch || CH[st.ch].has(x.id))
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
      if (e.target.matches("[data-ch]")) st.ch = e.target.value;
      draw();
    });
    draw();
  }
  if (!document.getElementById("tree")) fromHash();
})();
