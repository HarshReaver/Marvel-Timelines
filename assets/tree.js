/* Vertical timeline trees. Each page gets a release-order tree and a story-order tree.
   A tree is a list of rows:
     {id}                     one title on the spine (side extras from `af` hang off it)
     {lbl, sub, c}            section label on the spine
     {fork:[{n,s,c}]}         the spine splits into lanes
     {lanes:[id|virtual|null], c:[colors]}   one row across the lanes
   A "virtual" entry is an inline object {v:1, t, y, ty, pl, d, c} for moments that aren't a title of their own. */
(function () {
  const host = document.getElementById("tree");
  if (!host) return;
  const {T, BY, ADJ, TYPE, sortRel, logoImg, tagsHTML, page, fromHash} = window.SITE;
  const C = window.GROUP_COLORS;
  const RED = "#c0392b", BLUE = "#2471a3", GOLD = "#d9a520", GREY = "#8d8fa3", PURPLE = "#8e44ad", SLATE = "#5b6b80";
  const get = id => typeof id === "object" ? id : BY[id];
  const color = x => x.v ? x.c : (page === "mcu" && x.ph ? C[x.ph] : C[x.g]) || "#888";

  /* ---------- one node ---------- */
  function node(x, sides) {
    const links = x.v ? [] : ADJ[x.id];
    return `<article class="node${x.up ? " is-up" : ""}${x.bad ? " is-bad" : ""}"${x.v ? "" : ` id="n-${x.id}"`} style="--gc:${color(x)}">
      <div class="n-meta"><span>${x.y}${x.set ? ` · story year ${x.set}` : ""}</span><span>${TYPE[x.ty]} · ${x.pl}</span></div>
      ${x.logo ? `<div class="n-logo">${logoImg(x.logo)}</div>` : ""}
      <h3 class="n-title">${x.t}</h3>${x.v ? "" : tagsHTML(x)}
      <p>${x.d}</p>
      ${links.length ? `<ul class="n-links">${links.map(e => `<li><button data-open="${e.id}">${BY[e.id].t}</button> ${e.note}</li>`).join("")}</ul>` : ""}
      ${sides && sides.length ? `<div class="sides"><div class="sides-h">Optional: watch any time after this</div>${sides.map(s => node(s)).join("")}</div>` : ""}
    </article>`;
  }

  /* ---------- rows ---------- */
  function render(rows) {
    return rows.map(r => {
      if (r.lbl) return `<div class="t-lbl" style="--gc:${r.c || "var(--ink)"}"><span>${r.lbl}</span>${r.sub ? `<small>${r.sub}</small>` : ""}</div>`;
      if (r.fork) return `<div class="t-fork" style="--n:${r.fork.length}">${r.fork.map(f => `<div style="--gc:${f.c}"><b>${f.n}</b>${f.s ? `<small>${f.s}</small>` : ""}</div>`).join("")}</div>`;
      if (r.lanes) return `<div class="t-lanes" style="--n:${r.lanes.length}">${r.lanes.map((id, i) =>
        `<div class="t-cell${id ? "" : " empty"}" style="--gc:${r.c[i]}">${id ? `<div class="lane-tag">${r.n[i]}</div>${node(get(id))}` : ""}</div>`).join("")}</div>`;
      const x = get(r.id);
      return `<div class="t-row" style="--gc:${color(x)}">${node(x, r.sides)}</div>`;
    }).join("");
  }
  const ids = list => list.map(id => ({id}));
  const lanes = (cols, colors, names) => {
    const n = Math.max(...cols.map(c => c.length));
    return Array.from({length: n}, (_, i) => ({lanes: cols.map(c => c[i] || null), c: colors, n: names}));
  };

  // release order: everything on the page sorted by release, with a label whenever the key changes
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

  // story order from `so`, with `af` extras as side branches, then upcoming and standalone titles
  function storyRows(items, labelsAt) {
    const sides = {};
    items.filter(x => x.af).forEach(x => (sides[x.af] = sides[x.af] || []).push(x));
    const rows = [];
    items.filter(x => x.so != null).sort((a, b) => a.so - b.so).forEach(x => {
      if (labelsAt[x.so]) rows.push(labelsAt[x.so]);
      rows.push({id: x.id, sides: sides[x.id]});
    });
    const up = items.filter(x => x.up && x.so == null), rest = items.filter(x => x.so == null && !x.af && !x.up);
    if (up.length) rows.push({lbl: "Coming next", sub: "Not out yet", c: "var(--accent)"}, ...ids(up.sort(sortRel).map(x => x.id)));
    if (rest.length) rows.push({lbl: "Outside the main story", sub: "Watch any time"}, ...ids(rest.map(x => x.id)));
    return rows;
  }

  /* ---------- page specs ---------- */
  const STONES = {"Phase 1": "Space Stone", "Phase 2": "Mind Stone", "Phase 3": "Reality Stone", "Phase 4": "Power Stone", "Phase 5": "Time Stone", "Phase 6": "Soul Stone"};
  const SPECS = {
    mcu: {
      items: () => T.filter(x => x.pg === "mcu" || x.ph),
      release: items => releaseRows(items, x => x.ph || x.g, k => C[k]).map(r => r.lbl ? {...r, sub: STONES[r.lbl]} : r),
      story: items => storyRows(items, {
        1: {lbl: "1943–1995 · Before the heroes", c: C["Phase 1"]},
        3: {lbl: "2010–2012 · Assembling the Avengers", c: C["Phase 1"]},
        8: {lbl: "2013–2015 · After the Battle of New York", c: C["Phase 2"]},
        15: {lbl: "2016–2018 · Civil War", c: C["Phase 3"]},
        22: {lbl: "2018–2023 · The Infinity War", sub: "Half of all life disappears for five years", c: C["Phase 3"]},
        24: {lbl: "2023–2025 · After the Blip", sub: "The multiverse cracks open", c: C["Phase 4"]},
        40: {lbl: "2025–2027 · Toward Doomsday", c: C["Phase 5"]}
      })
    },
    xmen: {
      items: () => T.filter(x => x.pg === "xmen" || x.id === "dw"),
      release: items => releaseRows(items, decade),
      story: () => [
        {lbl: "Shared history", sub: "Before 1973, the same in both timelines", c: SLATE},
        {id: "fc"}, {id: "dofp"},
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

  /* ---------- toggle + draw ---------- */
  const spec = SPECS[page];
  const items = spec.items();
  let view = "story";
  try { view = localStorage.getItem("view-" + page) || "story"; } catch (e) {}
  const bar = document.createElement("div");
  bar.className = "controls t-controls";
  bar.innerHTML = `<div class="seg" role="group" aria-label="Order">
      <button data-v="story">${spec.storyName || "Story order"}</button><button data-v="release">Release order</button></div>
    <span class="count">${items.length} titles · scroll down the line</span>`;
  host.before(bar);
  const draw = () => {
    bar.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.dataset.v === view));
    host.innerHTML = render(view === "story" ? spec.story(items) : spec.release(items));
  };
  bar.addEventListener("click", e => {
    const b = e.target.closest("button[data-v]");
    if (!b) return;
    view = b.dataset.v;
    try { localStorage.setItem("view-" + page, view); } catch (e) {}
    draw();
  });
  draw();
  fromHash();
})();
