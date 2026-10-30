# Marvel Timelines

An interactive, unofficial guide to every Marvel screen timeline: the MCU, Fox's X-Men, the Netflix street-level shows, Sony's Spider-Man films, the 2000s one-offs from other studios, and how they come together on the road to **Avengers: Doomsday** and **Secret Wars**.

It's a plain static site (HTML, CSS and vanilla JavaScript) with no build step and no dependencies, so GitHub Pages can host it directly.

## Pages

| Page | What's on it | Theme |
|---|---|---|
| `index.html` | Home: section index, Doomsday countdown, connection rules | Comic-book newsprint |
| `mcu.html` | Vertical tree of Phases 1–6, in story order or release order | One Infinity Stone colour per phase |
| `xmen.html` | Vertical tree that forks at the 1973 split into the original and revised timelines | Blue and gold, X-Men film lettering |
| `street-level.html` | Netflix Defenders, ABC / Hulu / Freeform shows, Daredevil: Born Again | Hell's Kitchen noir |
| `spider-verse.html` | Four parallel Spider-worlds that merge at No Way Home, plus the animated Spider-Verse | Misregistered print |
| `legacy.html` | Blade, Hulk (2003), Daredevil, Elektra, Fantastic Four, Ghost Rider, Punisher | Video-rental shelf |
| `multiverse.html` | Universe lanes merging into Doomsday, with case files for each crossover | TVA case files |
| `catalog.html` | Every title, with filters for section, format, connections and search | Newsprint |
| `about.html` | Scope, connection rules, credits | Newsprint |

## Features

- **Vertical timeline trees** on every section page, with a **Story order / Release order** switch. Story order is a curated watch order: optional extras (What If...?, specials) hang off the title they follow, and unreleased titles sit under "Coming next".
- **Everything on the page**: every node shows the plot summary (spoilers included), year, platform and what it connects to, so there's no need to click around.
- **Collapsible sections**: every tree is split into sections you can open or close, with jump buttons and Open all / Close all.
- **Adapts to zoom and screen size**: one column on phones, two columns around a centre spine on wide screens, three when you zoom out further.
- **Posters and title cards** for 138 titles, shown from Wikipedia, plus season and episode counts from Wikidata.
- **Studio credits strip** at the top of each page (Marvel Studios, 20th Century Fox, Sony Pictures, Netflix, Disney+ and others), and a poster wall behind every header.
- **Type**: Antonio for display, Hanken Grotesk for body text, built to the [Hallmark](https://github.com/nutlope/hallmark) rules (no kicker lines, no tracked-caps labels, no decorative monospace).
- **Deep links**: every title has its own URL, for example `mcu.html#t=eg` for Endgame or `spider-verse.html#t=nwh` for No Way Home.
- **Filters** on every list: format (film, series, animated, special), search, and "Doomsday road only".
- **Honest connections**: titles are only connected when they share a story, are major releases others build on, or feed into Doomsday or Secret Wars. Everything else is marked *Standalone*.

## Project structure

```
├── index.html            home
├── mcu.html  xmen.html  street-level.html  spider-verse.html
├── legacy.html  multiverse.html  catalog.html  about.html
└── assets/
    ├── style.css         shared layout and one theme per page (body[data-theme])
    ├── data.js           every title, its summary and its connections
    ├── app.js            nav, footer, detail dialog, catalog grid
    ├── tree.js           the vertical trees and the story/release switch
    ├── media.js          generated: Wikipedia poster/title card, seasons and episodes per title
    ├── home.js           home page countdown and section counts
    └── logos/            studio and network logos from Wikimedia Commons
```

## Adding or editing a title

Everything comes from `assets/data.js`. Add an object to `TITLES`:

```js
{id:"bnd", t:"Spider-Man: Brand New Day", y:2026, ty:"F", pl:"Theatrical",
 pg:"spider", g:"MCU Spider-Man", ph:"Phase 6",
 d:"Full summary shown on the tree.",
 l:[["nwh","How it connects"]],   // reverse links are added automatically
 mv:0, up:0}
```

| Field | Meaning |
|---|---|
| `ty` | `F` film, `S` series, `A` animated, `X` special |
| `pg` | page the title lives on: `mcu`, `xmen`, `street`, `spider`, `legacy`, `other` |
| `g` | group heading on that page |
| `ph` | MCU phase, for MCU titles that live on another page (they also appear on the MCU page) |
| `set` | in-story year (leave it out if unclear) |
| `so` | position in the MCU story order |
| `af` | id of the title an optional extra hangs off in story order |
| `logo` | key from `LOGOS` to show the official logo on the node |
| `bad` | a warning label, e.g. Ironheart's "Do not watch: worst show ever 💩" |
| `mv` | `1` if it's on the road to Doomsday / Secret Wars |
| `up` | `1` if not yet released |

Linking to an `id` that doesn't exist logs a warning in the browser console. The story trees for X-Men, Street Level, Spider-Verse and the 2000s era are laid out by hand in `assets/tree.js` (`SPECS`), so add new titles there too.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

## Deploy on GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then save.
4. The site will be live at `https://<your-username>.github.io/<repo-name>/` within a minute or two.
5. After editing anything in `assets/`, raise the `?v=` number on the script and style links in the pages (for example `?v=2` to `?v=3`) so visitors get the new files instead of an old saved copy.

## Links

- Live site: https://harshreaver.github.io/Marvel-Timelines/
- LinkedIn: https://www.linkedin.com/in/harsh-verma007/

## Disclaimer

Unofficial fan project, not affiliated with or endorsed by Marvel Studios, The Walt Disney Company, Sony Pictures or 20th Century Studios. All titles, characters, posters and logos belong to their owners. Posters and title cards are shown from Wikipedia, and logos come from Wikimedia Commons.

Data is current to **October 2026**.

---

Created by **Harsh Verma**.
