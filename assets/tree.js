/* Vertical timeline trees. Each page gets a story-order tree and a release-order tree,
   split into collapsible sections at every label.
   A tree is a list of rows:
     {id}                     one title on the spine (side extras from `af` hang off it)
     {lbl, sub, c}            starts a new collapsible section
     {fork:[{n,s,c}]}         the spine splits into lanes
     {lanes:[id|virtual|null], c:[colors], n:[names]}   one row across the lanes
   A "virtual" entry is an inline object {v:1, t, y, ty, pl, d, c} for moments that aren't a title of their own. */
(function () {
  const host = document.getElementById("tree");
  if (!host) return;
  const {T, BY, ADJ, TYPE, sortRel, tagsHTML, page, fromHash, posterImg, imgClass, epsText, wpLink} = window.SITE;
  const C = window.GROUP_COLORS;
  const RED = "#c0392b", BLUE = "#2471a3", GOLD = "#d9a520", GREY = "#8d8fa3", PURPLE = "#8e44ad", SLATE = "#5b6b80";
  const get = id => typeof id === "object" ? id : BY[id];
  const color = x => x.v ? x.c : (page === "mcu" && x.ph ? C[x.ph] : C[x.g]) || "#888";
  const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  /* ---------- one node ---------- */
  function node(x, sides, num) {
    const links = x.v ? [] : ADJ[x.id], eps = x.v ? "" : epsText(x);
    return `<article class="node${x.v ? " no-img" : imgClass(x.id)}${x.up ? " is-up" : ""}"${x.v ? "" : ` id="n-${x.id}"`} style="--gc:${color(x)}">
      ${x.v ? "" : posterImg(x.id)}
      <div class="n-body">
        <div class="n-meta"><span>${num ? `<b class="n-num">#${num}</b>` : ""}${x.y}${x.set ? ` · story year ${x.set}` : ""}</span><span>${TYPE[x.ty]} · ${x.pl}${eps ? ` · ${eps}` : ""}</span></div>
        <h3 class="n-title">${x.t}</h3>${x.v ? "" : tagsHTML(x)}
        <p>${x.d}</p>
        ${links.length ? `<ul class="n-links">${links.map(e => `<li><button data-open="${e.id}">${BY[e.id].t}</button> ${e.note}</li>`).join("")}</ul>` : ""}
        ${x.v ? "" : wpLink(x)}
      </div>
      ${sides && sides.length ? `<div class="sides"><div class="sides-h">Optional extras, watch any time after this</div>${sides.map(s => node(s)).join("")}</div>` : ""}
    </article>`;
  }

  /* ---------- rows ---------- */
  function rowHTML(r, num) {
    if (r.fork) return `<div class="t-fork" style="--n:${r.fork.length}">${r.fork.map(f => `<div style="--gc:${f.c}"><b>${f.n}</b>${f.s ? `<small>${f.s}</small>` : ""}</div>`).join("")}</div>`;
    if (r.group) {
      // one grid per run of lane rows: side by side on wide screens, and on phones each lane
      // stacks as a block (all of lane A, then lane B) instead of alternating A, B, A, B
      const seen = new Set();
      return `<div class="t-lanes" style="--n:${r.group[0].lanes.length}">${r.group.map((row, j) => row.lanes.map((id, i) => {
        const first = id && !seen.has(i) && seen.add(i);
        return `<div class="t-cell${id ? "" : " empty"}${first ? " first" : ""}" style="--gc:${row.c[i]};--r:${j + 1};--l:${i + 1};--o:${i * 100 + j}">${id ? `<div class="lane-tag">${row.n[i]}</div>${node(get(id))}` : ""}</div>`;
      }).join("")).join("")}</div>`;
    }
    const x = get(r.id);
    return `<div class="t-row" style="--gc:${color(x)}">${node(x, r.sides, num)}</div>`;
  }
  const ids = list => list.map(id => ({id}));
  const groupLanes = rows => rows.reduce((out, r) => {
    const last = out[out.length - 1];
    if (r.lanes && last && last.group) last.group.push(r); else out.push(r.lanes ? {group: [r]} : r);
    return out;
  }, []);
  const lanes = (cols, colors, names) => {
    const n = Math.max(...cols.map(c => c.length));
    return Array.from({length: n}, (_, i) => ({lanes: cols.map(c => c[i] || null), c: colors, n: names}));
  };

  // release order: everything sorted by release, with a new section whenever the key changes
  function releaseRows(items, key, labelColor) {
    const rows = [];
    let last;
    items.slice().sort(sortRel).forEach(x => {
      const k = key(x);
      if (k !== last) rows.push({lbl: k, c: labelColor ? labelColor(k) : "var(--ink)"});
      last = k;
      rows.push({id: x.id});
    });
    return rows;
  }
  const decade = x => Math.floor(x.y / 10) * 10 + "s";

  // story order from `so`, with `af` extras as side branches, then upcoming and standalone titles.
  // An upcoming title with `so` waits in "Coming next" and joins its story spot once released.
  function storyRows(items, labelsAt) {
    const sides = {};
    items.filter(x => x.af).forEach(x => (sides[x.af] = sides[x.af] || []).push(x));
    const rows = [];
    items.filter(x => x.so != null && !x.up).sort((a, b) => a.so - b.so).forEach(x => {
      if (labelsAt[x.so]) rows.push(labelsAt[x.so]);
      rows.push({id: x.id, sides: sides[x.id]});
    });
    const up = items.filter(x => x.up), rest = items.filter(x => x.so == null && !x.af && !x.up);
    if (up.length) rows.push({lbl: "Coming next", sub: "Not out yet", c: "var(--accent)"}, ...ids(up.sort(sortRel).map(x => x.id)));
    if (rest.length) rows.push({lbl: "Outside the main story", sub: "Watch any time"}, ...ids(rest.map(x => x.id)));
    return rows;
  }

  /* ---------- page specs ---------- */
  const STONES = {"Phase 1": "Space Stone", "Phase 2": "Mind Stone", "Phase 3": "Reality Stone", "Phase 4": "Power Stone", "Phase 5": "Time Stone", "Phase 6": "Soul Stone"};
  const SPECS = {
    mcu: {
      numbered: true,
      items: () => T.filter(x => x.pg === "mcu" || x.ph),
      release: items => releaseRows(items, x => x.ph || x.g, k => C[k]).map(r => r.lbl ? {...r, sub: STONES[r.lbl]} : r),
      story: items => storyRows(items, {
        1: {lbl: "1943–1995 · Before the heroes", c: C["Phase 1"]},
        3: {lbl: "2010–2012 · Assembling the Avengers", c: C["Phase 1"]},
        8: {lbl: "2013–2015 · After the Battle of New York", c: C["Phase 2"]},
        15: {lbl: "2016–2018 · Civil War", c: C["Phase 3"]},
        22: {lbl: "2018–2023 · The Infinity War", sub: "Half of all life disappears for five years", c: C["Phase 3"]},
        24: {lbl: "2023–2025 · After the Blip", sub: "The multiverse cracks open", c: C["Phase 4"]},
        40: {lbl: "2025–2027 · Toward Doomsday", c: C["Phase 5"]},
        57: {lbl: "The end of the Multiverse Saga", c: C["Phase 6"]}
      })
    },
    xmen: {
      items: () => T.filter(x => x.pg === "xmen" || x.id === "dw"),
      release: items => releaseRows(items, decade),
      story: () => [
        {lbl: "Shared history", sub: "Before 1973, the same in both timelines", c: SLATE},
        {id: "fc"}, {id: "dofp"},
        {lbl: "After 1973 · Two timelines", sub: "Logan's mission splits history in two", c: BLUE},
        {fork: [{n: "A · Original timeline", s: "Erased when Logan changes 1973", c: RED}, {n: "B · Revised timeline", s: "The reality Logan creates", c: BLUE}]},
        ...lanes([["origins", "xm1", "xm2", "xm3", "tw",
          {v: 1, t: "Days of Future Past: the 2023 future", y: 2014, ty: "F", pl: "Theatrical (Fox)", set: 2023, c: RED,
            d: "Sentinels built from Mystique's DNA hunt mutants and the humans who help them. The last X-Men hide in a Chinese monastery, and Kitty sends Logan's mind back to 1973. When he succeeds, this future and everything above it in this column is erased."}],
          ["apoc", "dph", "dp1", "dp2", "nm", "logan"]], [RED, BLUE], ["Original timeline", "Revised timeline"]),
        {lbl: "Into the multiverse", sub: "The revised timeline's Deadpool crosses into the MCU", c: PURPLE},
        {id: "dw"}, {id: "doomsday"},
        {lbl: "TV & animation", sub: "Separate continuities, watch any time", c: C["TV & animation"]},
        ...ids(["xmtas", "x97", "x97s2", "wxm", "genx", "legion", "gifted"])
      ]
    },
    street: {
      numbered: true,
      items: () => T.filter(x => x.pg === "street" || ["hawkeye", "shehulk", "echo"].includes(x.id)),
      release: items => releaseRows(items, decade),
      story: () => [
        {lbl: "Marvel Television on ABC", sub: "Began inside the MCU, then drifted away", c: C["Marvel Television (ABC)"]},
        ...ids(["carter", "aos", "inhumans"]),
        {lbl: "Netflix: the Defenders saga", sub: "2015–2019 · Hell's Kitchen and Harlem", c: C["Netflix Defenders Saga"]},
        ...ids(["ddnet", "jj", "lc", "if", "def", "pun"]),
        {lbl: "Hulu & Freeform", sub: "Teen shows, standalone", c: C["Hulu & Freeform"]},
        ...ids(["runaways", "cloak", "helstrom"]),
        {lbl: "Back in the MCU", sub: "Netflix's characters return", c: "var(--accent)"},
        ...ids(["hawkeye", "shehulk", "echo", "ddba", "ddba2", "olk", "bnd"])
      ]
    },
    spider: {
      items: () => T.filter(x => x.pg === "spider" || x.id === "yfnsm"),
      release: items => releaseRows(items, decade),
      story: () => [
        {lbl: "Four separate Spider-worlds", sub: "Each began on its own", c: "var(--ink)"},
        {fork: [{n: "Raimi", s: "Tobey Maguire", c: C["Raimi trilogy"]}, {n: "Webb", s: "Andrew Garfield", c: C["The Amazing Spider-Man"]},
          {n: "MCU", s: "Tom Holland", c: GOLD}, {n: "Sony", s: "Venom", c: GREY}]},
        ...lanes([["sm1", "sm2", "sm3"], ["asm1", "asm2"], ["homec", "ffh"], ["venom1", "venom2"]], [C["Raimi trilogy"], C["The Amazing Spider-Man"], GOLD, GREY], ["Raimi", "Webb", "MCU", "Sony"]),
        {lbl: "2021 · The worlds collide", sub: "Strange's spell pulls Spider-Men and villains from the Raimi and Webb films into the MCU", c: "var(--accent)"},
        {id: "nwh"},
        {fork: [{n: "MCU", s: "After everyone forgets Peter", c: GOLD}, {n: "Sony", s: "After the crossover", c: GREY}]},
        ...lanes([["bnd"], ["morbius", "venom3", "kraven", "mw"]], [GOLD, GREY], ["MCU", "Sony"]),
        {lbl: "Animated & other universes", sub: "Separate continuities", c: C["Spider-Verse & animation"]},
        ...ids(["itsv", "atsv", "btsv", "spidernoir", "yfnsm", "smtas", "specspidey", "ultimate", "spidey", "asm77"])
      ]
    },
    legacy: {
      storyName: "By franchise",
      items: () => T.filter(x => x.pg === "legacy" || x.id === "dw"),
      release: items => releaseRows(items, decade),
      story: () => [
        {lbl: "Blade", c: C.Blade}, ...ids(["blade1", "blade2", "blade3", "bladetv"]),
        {lbl: "Daredevil & Elektra", c: C["Daredevil & Elektra"]}, ...ids(["dd03", "elektra"]),
        {lbl: "Fantastic Four", c: C["Fantastic Four"]}, ...ids(["ff05", "ff07", "ff15"]),
        {lbl: "Hulk", c: C.Hulk}, ...ids(["hulk77", "hulk03"]),
        {lbl: "Ghost Rider", c: C["Ghost Rider"]}, ...ids(["gr", "gr2"]),
        {lbl: "Punisher", c: C.Punisher}, ...ids(["pun89", "pun04", "punwz"]),
        {lbl: "One-offs", c: C["Early oddities"]}, ...ids(["hd", "cap90", "nickfury", "manthing"]),
        {lbl: "Where they turned up again", sub: "Blade, Elektra and Johnny Storm return in the Void", c: PURPLE}, {id: "dw"}
      ]
    }
  };

  /* ---------- sections ---------- */
  function sectionize(rows) {
    const secs = [];
    let cur = {rows: []};
    rows.forEach(r => {
      if (!r.lbl) return cur.rows.push(r);
      if (cur.lbl || cur.rows.length) secs.push(cur);
      cur = {...r, id: "sec-" + slug(r.lbl), rows: []};
    });
    secs.push(cur);
    return secs;
  }
  const countTitles = rows => rows.reduce((n, r) => n + (r.lanes ? r.lanes.filter(x => x && typeof x !== "object").length
    : r.id ? 1 + (r.sides ? r.sides.length : 0) : 0), 0);
  const titlesText = rows => { const n = countTitles(rows); return n + (n === 1 ? " title" : " titles"); };

  /* ---------- controls + draw ---------- */
  const spec = SPECS[page];
  const items = spec.items();
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  let view = store.get("view-" + page, "story");
  let secs = [];
  const bar = document.createElement("div");
  bar.className = "controls t-controls";
  host.before(bar);
  // Slide the bar away while scrolling down (more room on phones), bring it back on any scroll up.
  let lastY = scrollY;
  addEventListener("scroll", () => {
    const y = scrollY, d = y - lastY;
    if (Math.abs(d) < 8) return;
    const stuck = bar.getBoundingClientRect().top <= parseFloat(getComputedStyle(bar).top) + 1;
    bar.classList.toggle("away", d > 0 && stuck && y > 200);
    lastY = y;
  }, {passive: true});

  function setOpen(sec, open, save = true) {
    sec.classList.toggle("closed", !open);
    sec.querySelector(".s-head").setAttribute("aria-expanded", open);
    const chip = bar.querySelector(`[data-sec="${sec.id}"]`);
    if (chip) chip.setAttribute("aria-pressed", open);
    if (save) store.set(`open-${page}-${view}`, [...host.querySelectorAll(".t-sec:not(.closed):not(.bare)")].map(s => s.id));
  }
  window.TREE = {open: sec => setOpen(sec, true)};

  function draw() {
    const rows = view === "story" ? spec.story(items) : spec.release(items);
    secs = sectionize(rows);
    const labelled = secs.filter(s => s.lbl);
    const saved = store.get(`open-${page}-${view}`, null);
    const isOpen = s => saved ? saved.includes(s.id) : s === labelled[0];
    let num = 0;
    const numbered = spec.numbered && view === "story";
    host.innerHTML = secs.map(s => {
      const lanesHere = s.rows.some(r => r.lanes || r.fork);
      const body = groupLanes(s.rows).map(r => rowHTML(r, numbered && r.id ? ++num : 0)).join("");
      const bodyHTML = `<div class="sec-body${lanesHere ? " has-lanes" : ""}" id="${s.id || "sec-top"}-b">${body}</div>`;
      if (!s.lbl) return `<section class="t-sec bare">${bodyHTML}</section>`;
      const open = isOpen(s);
      return `<section class="t-sec${open ? "" : " closed"}" id="${s.id}" style="--gc:${s.c || "var(--ink)"}">
        <button class="s-head" aria-expanded="${open}" aria-controls="${s.id}-b"><span class="s-name">${s.lbl}</span>
          <span class="s-count">${titlesText(s.rows)}</span><span class="s-chev" aria-hidden="true"></span></button>
        ${s.sub ? `<p class="s-sub">${s.sub}</p>` : ""}${bodyHTML}</section>`;
    }).join("");
    bar.innerHTML = `<div class="t-bar-top">
        <div class="seg" role="group" aria-label="Order">
          <button data-v="story" aria-pressed="${view === "story"}">${spec.storyName || "Story order"}</button>
          <button data-v="release" aria-pressed="${view === "release"}">Release order</button></div>
        <div class="seg" role="group" aria-label="Sections"><button data-all="1">Open<span class="wide-only"> all</span></button><button data-all="0">Close<span class="wide-only"> all</span></button></div>
        <span class="count">${items.length} titles · ${labelled.length} sections</span></div>
      <nav class="t-jump" aria-label="Jump to a section">${labelled.map(s =>
        `<button data-sec="${s.id}" aria-pressed="${isOpen(s)}" style="--gc:${s.c || "var(--ink)"}">${s.lbl}</button>`).join("")}</nav>`;
  }

  bar.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.v) { view = b.dataset.v; store.set("view-" + page, view); draw(); return; }
    if (b.dataset.all) { host.querySelectorAll(".t-sec:not(.bare)").forEach(s => setOpen(s, b.dataset.all === "1", false)); setOpen(host.querySelector(".t-sec:not(.bare)"), b.dataset.all === "1"); return; }
    if (b.dataset.sec) {
      const sec = document.getElementById(b.dataset.sec);
      const opening = sec.classList.contains("closed");
      setOpen(sec, opening);
      if (opening) sec.scrollIntoView({behavior: "smooth", block: "start"});
    }
  });
  // The section buttons scroll sideways without a scrollbar; let a mouse wheel move them too.
  bar.addEventListener("wheel", e => {
    const j = e.target.closest(".t-jump");
    if (!j || j.scrollWidth <= j.clientWidth || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    j.scrollLeft += e.deltaY;
    e.preventDefault();
  }, {passive: false});
  host.addEventListener("click", e => {
    const h = e.target.closest(".s-head");
    if (h) setOpen(h.parentElement, h.parentElement.classList.contains("closed"));
  });
  draw();
  fromHash();
})();
