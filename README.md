# Marvel Timelines

An interactive, unofficial guide to every Marvel screen timeline: the MCU, Fox's X-Men, the Netflix street-level shows, Sony's Spider-Man films, the 2000s one-offs from other studios, and how they come together on the road to **Avengers: Doomsday** and **Secret Wars**.

It's a plain static site (HTML, CSS and vanilla JavaScript) with no build step and no dependencies, so GitHub Pages can host it directly.

## Pages

| Page | What's on it | Theme |
|---|---|---|
| `index.html` | Home: section index, Doomsday countdown, connection rules | Comic-book newsprint |
| `mcu.html` | Phases 1–6, release order or story order | One Infinity Stone colour per phase |
| `xmen.html` | Fox X-Men timeline tree (the 1973 split) plus every X-Men title | Blue and gold |
| `street-level.html` | Netflix Defenders, ABC / Hulu / Freeform shows, Daredevil: Born Again | Hell's Kitchen noir |
| `spider-verse.html` | Raimi, Webb, Holland, Venom, Sony's spin-offs, animated Spider-Verse | Misregistered print |
| `legacy.html` | Blade, Hulk (2003), Daredevil, Elektra, Fantastic Four, Ghost Rider, Punisher | Video-rental shelf |
| `multiverse.html` | Universe lanes merging into Doomsday, with case files for each crossover | TVA case files |
| `catalog.html` | Every title, with filters for section, format, connections and search | Newsprint |
| `about.html` | Scope, connection rules, credits | Newsprint |

## Features

- **Click any title** to open its entry: release year, format, platform, story year, a summary and the titles it connects to. Connected titles open in the same panel, so you can follow a chain across universes.
- **Deep links**: every title has its own URL, for example `mcu.html#t=eg` for Endgame or `spider-verse.html#t=nwh` for No Way Home.
- **Filters** on every list: format (film, series, animated, special), search, and "Doomsday road only".
- **Story order** on the MCU page sorts by in-story year, from 1943 to the present.
- **Honest connections**: titles are only connected when they share a story, are major releases others build on, or feed into Doomsday or Secret Wars. Everything else is marked *Standalone*.

## Project structure

```
├── index.html            home
├── mcu.html  xmen.html  street-level.html  spider-verse.html
├── legacy.html  multiverse.html  catalog.html  about.html
└── assets/
    ├── style.css         shared layout and one theme per page (body[data-theme])
    ├── data.js           every title and its connections
    └── app.js            nav, footer, lists, filters, detail dialog
```

## Adding or editing a title

Everything comes from `assets/data.js`. Add an object to `TITLES`:

```js
{id:"bnd", t:"Spider-Man: Brand New Day", y:2026, ty:"F", pl:"Theatrical",
 pg:"spider", g:"MCU Spider-Man", ph:"Phase 6",
 n:"One-line summary.",
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
| `mv` | `1` if it's on the road to Doomsday / Secret Wars |
| `up` | `1` if not yet released |

Linking to an `id` that doesn't exist logs a warning in the browser console.

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

## Disclaimer

Unofficial fan project, not affiliated with or endorsed by Marvel Studios, The Walt Disney Company, Sony Pictures or 20th Century Studios. All titles and characters belong to their owners. The site uses text and diagrams only, with no posters or stills.

Data is current to **October 2026**.

---

Created by **Harsh Verma**.
