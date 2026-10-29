/*
  Every title in the guide.
  id   unique key            t   title            y   release year
  ty   F film · S series · A animated · X special
  pl   where it premiered    pg  page it lives on (mcu, xmen, street, spider, legacy, other)
  g    group on that page    set in-story year (only where it is clear)
  n    one-line summary
  l    connections: [[otherId, "how they connect"], ...]  (reverse links are added automatically)
  ph   MCU phase, for titles that live on another page but are MCU canon
  mv   1 = on the road to Avengers: Doomsday / Secret Wars
  up   1 = not released yet (as of Oct 2026)
  Titles with no connections are kept but shown as "Standalone".
*/
window.PAGES = {
  mcu:    {file:"mcu.html",          name:"MCU Timeline"},
  xmen:   {file:"xmen.html",         name:"X-Men Timeline"},
  street: {file:"street-level.html", name:"Street Level & Marvel TV"},
  spider: {file:"spider-verse.html", name:"Spider-Verse"},
  legacy: {file:"legacy.html",       name:"2000s Era"},
  other:  {file:"catalog.html",      name:"Catalog"}
};

window.GROUP_COLORS = { // key order = order of groups on each page
  "Phase 1":"#2f6fdb","Phase 2":"#e6c229","Phase 3":"#c2302b","Phase 4":"#8a4fd0","Phase 5":"#2e9e5b","Phase 6":"#e07b24",
  "Original trilogy era":"#c0392b","Prequel era":"#2471a3","Deadpool & Logan":"#8e44ad","TV & animation":"#7f8c8d",
  "Marvel Television (ABC)":"#c98a2b","Netflix Defenders Saga":"#b3141b","Hulu & Freeform":"#6e6a66","Back in the MCU":"#e8e2d8",
  "Raimi trilogy":"#e2231a","The Amazing Spider-Man":"#2f7bff","MCU Spider-Man":"#f2c230","Sony's Spider-Man Universe":"#8d8fa3","Spider-Verse":"#ff3d8b",
  "Early oddities":"#2bb3a6","Blade":"#b21f1f","Daredevil & Elektra":"#8a1538","Hulk":"#3f8f3a","Punisher":"#8f8f8f","Fantastic Four":"#2f6fdb","Ghost Rider":"#f08a24",
  "Adult animation":"#6e6a66"
};

window.TITLES = [
/* ================= MCU — PHASE 1 ================= */
{id:"im",t:"Iron Man",y:2008,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 1",set:2008,l:[["im2","Direct sequel"],["av1","Fury's Avengers Initiative pays off"]],
 n:"Tony Stark builds the suit and ends with \"I am Iron Man.\" Nick Fury's post-credits scene starts the Avengers Initiative."},
{id:"ih",t:"The Incredible Hulk",y:2008,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 1",set:2010,
 n:"Bruce Banner on the run from General Ross. Ross and Samuel Sterns (the Leader) come back years later.",
 l:[["bnw","Ross is now President; Samuel Sterns returns as the villain"]]},
{id:"im2",t:"Iron Man 2",y:2010,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 1",set:2010,
 n:"Natasha Romanoff debuts. Coulson finds Thor's hammer in New Mexico in the post-credits scene.",l:[["thor","Post-credits teases Mjolnir"]]},
{id:"thor",t:"Thor",y:2011,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 1",set:2010,
 n:"Thor is banished to Earth. Loki is introduced, and the Tesseract appears in the post-credits scene.",l:[["av1","Loki and the Tesseract lead into The Avengers"]]},
{id:"cafa",t:"Captain America: The First Avenger",y:2011,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 1",set:1943,
 n:"Steve Rogers fights HYDRA in WWII, loses Bucky, and wakes up in the present day.",l:[["tws","Bucky returns as the Winter Soldier"],["carter","Peggy Carter's story continues after the war"]]},
{id:"av1",t:"The Avengers",y:2012,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 1",set:2012,
 n:"The team forms to stop Loki's Chitauri invasion of New York. First look at Thanos.",l:[["aos","Coulson's apparent death sets up Agents of S.H.I.E.L.D."]]},

/* ================= PHASE 2 ================= */
{id:"im3",t:"Iron Man 3",y:2013,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 2",set:2012,n:"Tony deals with panic attacks after New York and faces the fake Mandarin.",l:[["shang","The real Mandarin, Wenwu, finally appears"]]},
{id:"tdw",t:"Thor: The Dark World",y:2013,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 2",set:2013,n:"Thor fights the Dark Elves over the Aether, later revealed as the Reality Stone."},
{id:"tws",t:"Captain America: The Winter Soldier",y:2014,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 2",set:2014,
 n:"HYDRA is revealed inside S.H.I.E.L.D., and Bucky is back as a brainwashed assassin.",l:[["aos","S.H.I.E.L.D. collapses in the series in the same week"],["cw","Bucky's past sets off Civil War"]]},
{id:"gotg",t:"Guardians of the Galaxy",y:2014,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 2",set:2014,n:"A team of misfits forms around the Power Stone. First proper look at Thanos."},
{id:"aou",t:"Avengers: Age of Ultron",y:2015,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 2",set:2015,n:"Tony's AI Ultron goes rogue. Introduces Vision and Wanda, and Sokovia is destroyed.",l:[["cw","Sokovia's destruction leads to the Accords"]]},
{id:"antman",t:"Ant-Man",y:2015,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 2",set:2015,n:"Scott Lang takes on the suit. Introduces the Quantum Realm.",l:[["quant","The Quantum Realm becomes the setting"]]},

/* ================= PHASE 3 ================= */
{id:"cw",t:"Captain America: Civil War",y:2016,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 3",set:2016,
 n:"The Sokovia Accords split the Avengers. Spider-Man and Black Panther make their debuts.",l:[["homec","Tom Holland's Spider-Man debuts here"],["bp","T'Challa debuts here"]]},
{id:"ds",t:"Doctor Strange",y:2016,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 3",set:2016,n:"Stephen Strange learns the mystic arts and protects the Time Stone.",l:[["mom","Strange returns to face the multiverse"]]},
{id:"gotg2",t:"Guardians of the Galaxy Vol. 2",y:2017,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 3",set:2014,n:"Peter Quill meets his father, Ego, a living planet."},
{id:"homec",t:"Spider-Man: Homecoming",y:2017,ty:"F",pl:"Theatrical",pg:"spider",g:"MCU Spider-Man",ph:"Phase 3",set:2016,
 n:"Peter Parker, mentored by Tony Stark, takes on the Vulture. Made jointly by Sony and Marvel Studios.",l:[["ffh","Direct sequel"]]},
{id:"rag",t:"Thor: Ragnarok",y:2017,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 3",set:2017,n:"Asgard is destroyed; Thor and Hulk team up on Sakaar."},
{id:"bp",t:"Black Panther",y:2018,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 3",set:2016,n:"T'Challa becomes king of Wakanda and faces Killmonger.",l:[["wf","Sequel after Chadwick Boseman's death"]]},
{id:"iw",t:"Avengers: Infinity War",y:2018,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 3",set:2018,n:"Thanos collects all six Infinity Stones and wipes out half of all life with a snap.",l:[["eg","Direct continuation"]]},
{id:"aw",t:"Ant-Man and the Wasp",y:2018,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 3",set:2018,n:"The Quantum Realm tech here is what makes Endgame's time heist possible.",l:[["eg","Scott escapes the Quantum Realm after five years"]]},
{id:"cm",t:"Captain Marvel",y:2019,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 3",set:1995,n:"Carol Danvers in 1995, alongside a young Nick Fury and the Skrulls.",l:[["marvels","Carol teams up with Monica and Kamala"],["si","The Skrull refugees' story continues"]]},
{id:"eg",t:"Avengers: Endgame",y:2019,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 3",set:2023,
 n:"A time heist undoes the snap. Tony sacrifices himself, and a 2012 Loki escapes with the Tesseract.",l:[["loki1","2012 Loki's escape creates the branch the TVA catches"],["wv","Wanda grieves Vision"],["fws","Steve hands Sam the shield"]]},
{id:"ffh",t:"Spider-Man: Far From Home",y:2019,ty:"F",pl:"Theatrical",pg:"spider",g:"MCU Spider-Man",ph:"Phase 3",set:2024,
 n:"Mysterio's illusions. Ends with Peter's identity being revealed to the world.",l:[["nwh","The identity reveal causes No Way Home"]]},

/* ================= PHASE 4 ================= */
{id:"wv",t:"WandaVision",y:2021,ty:"S",pl:"Disney+",pg:"mcu",g:"Phase 4",set:2023,n:"Wanda's grief rewrites a town as sitcoms. She becomes the Scarlet Witch.",l:[["mom","Wanda hunts her sons across the multiverse"],["agatha","Agatha's own series"]]},
{id:"fws",t:"The Falcon and the Winter Soldier",y:2021,ty:"S",pl:"Disney+",pg:"mcu",g:"Phase 4",set:2024,n:"Sam Wilson accepts the shield. Introduces Valentina.",l:[["bnw","Sam's first film as Captain America"],["thunderbolts","Valentina, John Walker and Bucky return"]]},
{id:"loki1",t:"Loki (Season 1)",y:2021,ty:"S",pl:"Disney+",pg:"mcu",g:"Phase 4",mv:1,
 n:"The TVA polices the Sacred Timeline. When He Who Remains is killed, the multiverse branches out of control.",l:[["mom","A branching multiverse"],["loki2","Direct continuation"]]},
{id:"whatif1",t:"What If...? (Season 1)",y:2021,ty:"A",pl:"Disney+",pg:"mcu",g:"Phase 4",mv:1,n:"The Watcher shows alternate versions of MCU events. Captain Carter later appears in Multiverse of Madness.",l:[["mom","Captain Carter appears in live action"],["mz","Marvel Zombies grew out of episode 5"]]},
{id:"bw",t:"Black Widow",y:2021,ty:"F",pl:"Theatrical / Disney+",pg:"mcu",g:"Phase 4",set:2016,n:"Natasha's past in the Red Room. Introduces Yelena Belova.",l:[["hawkeye","Yelena goes after Clint"],["thunderbolts","Yelena leads the team"]]},
{id:"shang",t:"Shang-Chi and the Legend of the Ten Rings",y:2021,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 4",set:2024,mv:1,n:"Shang-Chi faces his father, Wenwu. Simu Liu is in the announced Doomsday cast."},
{id:"eternals",t:"Eternals",y:2021,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 4",set:2024,n:"Immortal beings who were sent to protect Earth find out the Celestials' real plan.",l:[["bnw","The Celestial left in the ocean becomes Celestial Island"]]},
{id:"hawkeye",t:"Hawkeye",y:2021,ty:"S",pl:"Disney+",pg:"mcu",g:"Phase 4",set:2024,n:"Clint trains Kate Bishop. Vincent D'Onofrio's Kingpin returns from the Netflix shows.",l:[["echo","Maya Lopez debuts here"],["ddnet","Kingpin is the same actor and character"]]},
{id:"nwh",t:"Spider-Man: No Way Home",y:2021,ty:"F",pl:"Theatrical",pg:"spider",g:"MCU Spider-Man",ph:"Phase 4",set:2024,mv:1,
 n:"A spell gone wrong pulls in Tobey Maguire's and Andrew Garfield's Spider-Men and their villains. Matt Murdock appears.",
 l:[["sm1","Tobey Maguire's Spider-Man, Green Goblin and Doc Ock"],["sm3","Sandman returns"],["asm2","Andrew Garfield's Spider-Man and Electro"],["asm1","The Lizard returns"],["venom2","Eddie Brock is briefly pulled into the MCU"],["ddnet","Charlie Cox's Matt Murdock"],["bnd","Next chapter of Peter's story"]]},
{id:"mom",t:"Doctor Strange in the Multiverse of Madness",y:2022,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 4",set:2024,mv:1,
 n:"Strange visits Earth-838's Illuminati: Patrick Stewart's Xavier, John Krasinski's Reed Richards and Captain Carter.",l:[["xm1","Patrick Stewart returns as a Xavier variant"]]},
{id:"mk",t:"Moon Knight",y:2022,ty:"S",pl:"Disney+",pg:"mcu",g:"Phase 4",n:"Marc Spector and Steven Grant share a body and serve the Egyptian god Khonshu."},
{id:"msm",t:"Ms. Marvel",y:2022,ty:"S",pl:"Disney+",pg:"mcu",g:"Phase 4",mv:1,n:"Kamala Khan's powers awaken. She's revealed to be a mutant, the first mutant confirmed in the main MCU.",l:[["marvels","Kamala joins Carol and Monica"],["x97","The mutant reveal plays the X-Men '97 theme"]]},
{id:"thor4",t:"Thor: Love and Thunder",y:2022,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 4",n:"Thor faces Gorr the God Butcher. Jane Foster becomes the Mighty Thor."},
{id:"shehulk",t:"She-Hulk: Attorney at Law",y:2022,ty:"S",pl:"Disney+",pg:"mcu",g:"Phase 4",n:"Jennifer Walters, lawyer and Hulk. Charlie Cox's Daredevil appears.",l:[["ddba","Matt Murdock's MCU return builds toward Born Again"]]},
{id:"wbn",t:"Werewolf by Night",y:2022,ty:"X",pl:"Disney+",pg:"mcu",g:"Phase 4",n:"A black-and-white Halloween special: monster hunters, Jack Russell and Man-Thing."},
{id:"wf",t:"Black Panther: Wakanda Forever",y:2022,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 4",mv:1,n:"Wakanda mourns T'Challa and meets Namor. Introduces Riri Williams. Several cast members are in Doomsday.",l:[["ironheart","Riri's own series"],["eow","Wakandan history explored in animation"]]},
{id:"gotghs",t:"The Guardians of the Galaxy Holiday Special",y:2022,ty:"X",pl:"Disney+",pg:"mcu",g:"Phase 4",n:"A short Christmas special that sets up Vol. 3.",l:[["gotg3","Sets the stage for Vol. 3"]]},

/* ================= PHASE 5 ================= */
{id:"quant",t:"Ant-Man and the Wasp: Quantumania",y:2023,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 5",mv:1,n:"Introduces Kang the Conqueror. Marvel later dropped the Kang storyline in favour of Doctor Doom."},
{id:"si",t:"Secret Invasion",y:2023,ty:"S",pl:"Disney+",pg:"mcu",g:"Phase 5",n:"Nick Fury uncovers Skrulls disguised as world leaders."},
{id:"gotg3",t:"Guardians of the Galaxy Vol. 3",y:2023,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 5",n:"Rocket's origin and the end of this Guardians lineup."},
{id:"loki2",t:"Loki (Season 2)",y:2023,ty:"S",pl:"Disney+",pg:"mcu",g:"Phase 5",mv:1,n:"Loki takes up the throne at the end of time and holds the multiverse together. Tom Hiddleston is in the Doomsday cast.",l:[["dw","The TVA returns in Deadpool & Wolverine"]]},
{id:"whatif2",t:"What If...? (Season 2)",y:2023,ty:"A",pl:"Disney+",pg:"mcu",g:"Phase 5",n:"More multiverse stories, including Captain Carter.",l:[["whatif1","Continues the series"]]},
{id:"marvels",t:"The Marvels",y:2023,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 5",mv:1,
 n:"Carol, Monica and Kamala swap places. Post-credits: Monica wakes up in a world with Kelsey Grammer's Beast.",l:[["xm3","Kelsey Grammer's Beast from The Last Stand"]]},
{id:"echo",t:"Echo",y:2024,ty:"S",pl:"Disney+ / Hulu",pg:"mcu",g:"Phase 5",n:"Maya Lopez faces Kingpin back home. Includes a Daredevil fight scene.",l:[["ddba","Kingpin's story continues into Born Again"]]},
{id:"dw",t:"Deadpool & Wolverine",y:2024,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 5",set:2024,mv:1,
 n:"Fox's Deadpool joins the MCU. The TVA's Void brings back Fox-era heroes: Blade, Elektra, Johnny Storm, Gambit and X-23.",
 l:[["dp2","Same Deadpool, from Earth-10005"],["logan","Logan's death dooms Earth-10005 (the anchor being)"],["blade1","Wesley Snipes returns as Blade"],["elektra","Jennifer Garner returns as Elektra"],["ff05","Chris Evans returns as Johnny Storm"],["doomsday","Channing Tatum's Gambit is in the announced Doomsday cast"]]},
{id:"agatha",t:"Agatha All Along",y:2024,ty:"S",pl:"Disney+",pg:"mcu",g:"Phase 5",n:"Agatha Harkness and a coven walk the Witches' Road. Billy Maximoff returns."},
{id:"whatif3",t:"What If...? (Season 3)",y:2024,ty:"A",pl:"Disney+",pg:"mcu",g:"Phase 5",n:"The final season of the anthology.",l:[["whatif2","Concludes the series"]]},
{id:"yfnsm",t:"Your Friendly Neighborhood Spider-Man",y:2025,ty:"A",pl:"Disney+",pg:"mcu",g:"Phase 5",n:"An alternate take on Peter's first year, with Norman Osborn as mentor."},
{id:"bnw",t:"Captain America: Brave New World",y:2025,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 5",mv:1,n:"Sam's first film as Cap. President Ross turns into Red Hulk, and adamantium is found on Celestial Island."},
{id:"ddba",t:"Daredevil: Born Again",y:2025,ty:"S",pl:"Disney+",pg:"street",g:"Back in the MCU",ph:"Phase 5",
 n:"Charlie Cox, Vincent D'Onofrio and Jon Bernthal return. The Netflix stories are now MCU history.",l:[["ddnet","Revival of the Netflix series"],["pun","Frank Castle returns"],["ddba2","Season 2"]]},
{id:"thunderbolts",t:"Thunderbolts*",y:2025,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 5",mv:1,n:"Yelena, Bucky, Red Guardian, Ghost, John Walker and Sentry end up as the \"New Avengers.\" The team is in the Doomsday cast."},
{id:"ironheart",t:"Ironheart",y:2025,ty:"S",pl:"Disney+",pg:"mcu",g:"Phase 5",n:"Riri Williams builds her armour and faces the Hood. Ends with a Mephisto deal."},

/* ================= PHASE 6 ================= */
{id:"ff",t:"The Fantastic Four: First Steps",y:2025,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 6",mv:1,
 n:"A retro-future Earth-828. The family faces Galactus and the Silver Surfer, and the post-credits scene teases Doom.",l:[["doomsday","The Fantastic Four join the Avengers"],["ff05","The earlier Fox take on the team"]]},
{id:"eow",t:"Eyes of Wakanda",y:2025,ty:"A",pl:"Disney+",pg:"mcu",g:"Phase 6",n:"Animated stories of Wakandan warriors recovering vibranium through history."},
{id:"mz",t:"Marvel Zombies",y:2025,ty:"A",pl:"Disney+",pg:"mcu",g:"Phase 6",n:"An adult animated miniseries set in a zombie-overrun universe."},
{id:"wm",t:"Wonder Man",y:2026,ty:"S",pl:"Disney+",pg:"mcu",g:"Phase 6",n:"Simon Williams, an actor with powers, tries to land a superhero role. Trevor Slattery returns.",l:[["im3","Ben Kingsley's Trevor Slattery"]]},
{id:"ddba2",t:"Daredevil: Born Again (Season 2)",y:2026,ty:"S",pl:"Disney+",pg:"street",g:"Back in the MCU",ph:"Phase 6",n:"Matt Murdock's fight against Mayor Fisk continues."},
{id:"bnd",t:"Spider-Man: Brand New Day",y:2026,ty:"F",pl:"Theatrical",pg:"spider",g:"MCU Spider-Man",ph:"Phase 6",n:"Tom Holland's fourth solo film. Peter's new life after the world forgot who he is."},
{id:"doomsday",t:"Avengers: Doomsday",y:2026,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 6",mv:1,up:1,
 n:"Release date 18 Dec 2026. Robert Downey Jr. plays Doctor Doom. The announced cast includes Avengers, Wakandans, Thunderbolts, the Fantastic Four and the Fox X-Men.",
 l:[["xm1","Patrick Stewart, Ian McKellen, James Marsden and Rebecca Romijn are in the announced cast"],["xm2","Alan Cumming's Nightcrawler is in the announced cast"],["thunderbolts","The New Avengers are in the cast"],["sw","Leads into Secret Wars"]]},
{id:"sw",t:"Avengers: Secret Wars",y:2027,ty:"F",pl:"Theatrical",pg:"mcu",g:"Phase 6",mv:1,up:1,n:"Planned for Dec 2027. The finale of the Multiverse Saga."},

/* ================= FOX X-MEN ================= */
{id:"xm1",t:"X-Men",y:2000,ty:"F",pl:"Theatrical (Fox)",pg:"xmen",g:"Original trilogy era",set:2000,mv:1,n:"Logan and Rogue join Xavier's school and stop Magneto's mutation machine.",l:[["xm2","Direct sequel"]]},
{id:"xm2",t:"X2",y:2003,ty:"F",pl:"Theatrical (Fox)",pg:"xmen",g:"Original trilogy era",mv:1,n:"William Stryker attacks the school. Jean seemingly dies at Alkali Lake.",l:[["xm3","Jean returns as the Phoenix"]]},
{id:"xm3",t:"X-Men: The Last Stand",y:2006,ty:"F",pl:"Theatrical (Fox)",pg:"xmen",g:"Original trilogy era",set:2006,mv:1,n:"A mutant cure, and the Phoenix kills Scott and Xavier. Logan has to kill Jean.",l:[["tw","Logan haunted by Jean"]]},
{id:"origins",t:"X-Men Origins: Wolverine",y:2009,ty:"F",pl:"Theatrical (Fox)",pg:"xmen",g:"Original trilogy era",set:1979,n:"Logan's past: Victor, Weapon X, adamantium, and the first Deadpool.",l:[["xm1","Logan arrives with no memories"]]},
{id:"fc",t:"X-Men: First Class",y:2011,ty:"F",pl:"Theatrical (Fox)",pg:"xmen",g:"Prequel era",set:1962,n:"Young Charles and Erik during the Cuban Missile Crisis. Charles is paralysed and Erik becomes Magneto.",l:[["dofp","Direct sequel"]]},
{id:"tw",t:"The Wolverine",y:2013,ty:"F",pl:"Theatrical (Fox)",pg:"xmen",g:"Original trilogy era",n:"Logan in Japan loses his healing for a while. Post-credits: Xavier and Magneto warn him of a threat.",l:[["dofp","Post-credits leads straight into DOFP"]]},
{id:"dofp",t:"X-Men: Days of Future Past",y:2014,ty:"F",pl:"Theatrical (Fox)",pg:"xmen",g:"Prequel era",set:1973,
 n:"Logan's mind goes back to 1973 to stop Mystique from killing Trask. This splits the X-Men timeline in two.",l:[["apoc","The revised timeline continues"]]},
{id:"dp1",t:"Deadpool",y:2016,ty:"F",pl:"Theatrical (Fox)",pg:"xmen",g:"Deadpool & Logan",set:2016,n:"Wade Wilson becomes Deadpool. Colossus and Negasonic Teenage Warhead appear.",l:[["dp2","Direct sequel"]]},
{id:"apoc",t:"X-Men: Apocalypse",y:2016,ty:"F",pl:"Theatrical (Fox)",pg:"xmen",g:"Prequel era",set:1983,n:"En Sabah Nur awakens. Jean's Phoenix power shows itself.",l:[["dph","Jean's Phoenix arc"]]},
{id:"logan",t:"Logan",y:2017,ty:"F",pl:"Theatrical (Fox)",pg:"xmen",g:"Deadpool & Logan",set:2029,n:"An ageing Logan protects Laura (X-23). Xavier and Logan die.",l:[["apoc","Placed in the revised timeline (debated)"]]},
{id:"dp2",t:"Deadpool 2",y:2018,ty:"F",pl:"Theatrical (Fox)",pg:"xmen",g:"Deadpool & Logan",set:2018,n:"Cable arrives from the future, and X-Force is (briefly) formed."},
{id:"dph",t:"Dark Phoenix",y:2019,ty:"F",pl:"Theatrical (Fox)",pg:"xmen",g:"Prequel era",set:1992,n:"Jean absorbs a cosmic force and kills Mystique."},
{id:"nm",t:"The New Mutants",y:2020,ty:"F",pl:"Theatrical (Fox / 20th Century)",pg:"xmen",g:"Prequel era",n:"Teens held by the Essex Corporation. Only loosely tied to the films.",l:[["dph","Loose tie through the Essex Corporation"]]},
{id:"xmtas",t:"X-Men: The Animated Series",y:1992,ty:"A",pl:"Fox Kids",pg:"xmen",g:"TV & animation",n:"The classic cartoon. Its theme song and Xavier's yellow chair keep showing up in the MCU.",l:[["x97","X-Men '97 continues this series"],["mom","Earth-838 Xavier's yellow hover-chair"]]},
{id:"x97",t:"X-Men '97",y:2024,ty:"A",pl:"Disney+",pg:"xmen",g:"TV & animation",n:"A direct continuation of the 1992 cartoon, picking up after Xavier's departure."},
{id:"legion",t:"Legion",y:2017,ty:"S",pl:"FX",pg:"xmen",g:"TV & animation",n:"David Haller, Xavier's son, in a surreal series not tied to the films."},
{id:"gifted",t:"The Gifted",y:2017,ty:"S",pl:"Fox",pg:"xmen",g:"TV & animation",n:"A family on the run in a world where the X-Men have disappeared. Not tied to the films."},

/* ================= STREET LEVEL ================= */
{id:"ddnet",t:"Daredevil",y:2015,ty:"S",pl:"Netflix",pg:"street",g:"Netflix Defenders Saga",n:"Matt Murdock, a blind lawyer and vigilante, against Wilson Fisk in Hell's Kitchen. Three seasons.",l:[["def","Matt joins the Defenders"],["pun","Frank Castle debuts in Season 2"],["ddba","Continued in Born Again"]]},
{id:"jj",t:"Jessica Jones",y:2015,ty:"S",pl:"Netflix",pg:"street",g:"Netflix Defenders Saga",n:"A PI with super strength faces Kilgrave, the man who controlled her.",l:[["lc","Luke Cage debuts here"],["def","Jessica joins the Defenders"]]},
{id:"lc",t:"Luke Cage",y:2016,ty:"S",pl:"Netflix",pg:"street",g:"Netflix Defenders Saga",n:"Bulletproof hero of Harlem.",l:[["def","Luke joins the Defenders"]]},
{id:"if",t:"Iron Fist",y:2017,ty:"S",pl:"Netflix",pg:"street",g:"Netflix Defenders Saga",n:"Danny Rand returns to New York with the power of the Iron Fist and fights the Hand.",l:[["def","Danny joins the Defenders"]]},
{id:"def",t:"The Defenders",y:2017,ty:"S",pl:"Netflix",pg:"street",g:"Netflix Defenders Saga",n:"Daredevil, Jessica, Luke and Danny team up against the Hand."},
{id:"pun",t:"The Punisher",y:2017,ty:"S",pl:"Netflix",pg:"street",g:"Netflix Defenders Saga",n:"Jon Bernthal's Frank Castle gets his own two-season series."},
{id:"aos",t:"Agents of S.H.I.E.L.D.",y:2013,ty:"S",pl:"ABC",pg:"street",g:"Marvel Television (ABC)",n:"Coulson, alive again, leads a S.H.I.E.L.D. team. Seven seasons that drift away from the films over time."},
{id:"carter",t:"Agent Carter",y:2015,ty:"S",pl:"ABC",pg:"street",g:"Marvel Television (ABC)",set:1946,n:"Peggy Carter at the SSR after the war. Howard Stark and Jarvis feature."},
{id:"inhumans",t:"Inhumans",y:2017,ty:"S",pl:"ABC",pg:"street",g:"Marvel Television (ABC)",n:"Attilan's royal family stranded in Hawaii. One season."},
{id:"runaways",t:"Runaways",y:2017,ty:"S",pl:"Hulu",pg:"street",g:"Hulu & Freeform",n:"Teens find out their parents are supervillains.",l:[["cloak","Season 3 crossover"]]},
{id:"cloak",t:"Cloak & Dagger",y:2018,ty:"S",pl:"Freeform",pg:"street",g:"Hulu & Freeform",n:"Two New Orleans teens bound by light and darkness powers."},
{id:"helstrom",t:"Helstrom",y:2020,ty:"S",pl:"Hulu",pg:"street",g:"Hulu & Freeform",n:"Siblings hunt demons. One season."},

/* ================= SPIDER-MAN & SONY ================= */
{id:"sm1",t:"Spider-Man",y:2002,ty:"F",pl:"Theatrical (Sony)",pg:"spider",g:"Raimi trilogy",n:"Tobey Maguire's Peter Parker against the Green Goblin.",l:[["sm2","Direct sequel"]]},
{id:"sm2",t:"Spider-Man 2",y:2004,ty:"F",pl:"Theatrical (Sony)",pg:"spider",g:"Raimi trilogy",n:"Doc Ock, and Peter nearly giving up the mask.",l:[["sm3","Direct sequel"],["nwh","Doc Ock returns"]]},
{id:"sm3",t:"Spider-Man 3",y:2007,ty:"F",pl:"Theatrical (Sony)",pg:"spider",g:"Raimi trilogy",n:"The symbiote, Sandman and Venom."},
{id:"asm1",t:"The Amazing Spider-Man",y:2012,ty:"F",pl:"Theatrical (Sony)",pg:"spider",g:"The Amazing Spider-Man",n:"A reboot with Andrew Garfield, against the Lizard.",l:[["asm2","Direct sequel"]]},
{id:"asm2",t:"The Amazing Spider-Man 2",y:2014,ty:"F",pl:"Theatrical (Sony)",pg:"spider",g:"The Amazing Spider-Man",n:"Electro and Green Goblin, and Gwen Stacy's death. No third film was made."},
{id:"venom1",t:"Venom",y:2018,ty:"F",pl:"Theatrical (Sony)",pg:"spider",g:"Sony's Spider-Man Universe",n:"Tom Hardy's Eddie Brock bonds with the symbiote.",l:[["venom2","Direct sequel"]]},
{id:"venom2",t:"Venom: Let There Be Carnage",y:2021,ty:"F",pl:"Theatrical (Sony)",pg:"spider",g:"Sony's Spider-Man Universe",n:"Carnage. In the mid-credits scene Eddie is pulled into the MCU.",l:[["venom3","Direct sequel"]]},
{id:"morbius",t:"Morbius",y:2022,ty:"F",pl:"Theatrical (Sony)",pg:"spider",g:"Sony's Spider-Man Universe",n:"A living vampire. Michael Keaton's Vulture shows up from the MCU after No Way Home.",l:[["homec","Michael Keaton's Vulture crosses over"]]},
{id:"venom3",t:"Venom: The Last Dance",y:2024,ty:"F",pl:"Theatrical (Sony)",pg:"spider",g:"Sony's Spider-Man Universe",n:"Eddie and Venom's final film, against Knull's hunters."},
{id:"mw",t:"Madame Web",y:2024,ty:"F",pl:"Theatrical (Sony)",pg:"spider",g:"Sony's Spider-Man Universe",n:"A paramedic who can see the future. Standalone."},
{id:"kraven",t:"Kraven the Hunter",y:2024,ty:"F",pl:"Theatrical (Sony)",pg:"spider",g:"Sony's Spider-Man Universe",n:"Origin of the hunter. The last film in Sony's universe."},
{id:"itsv",t:"Spider-Man: Into the Spider-Verse",y:2018,ty:"A",pl:"Theatrical (Sony)",pg:"spider",g:"Spider-Verse",n:"Miles Morales meets Spider-People from other dimensions. Won the Oscar for Best Animated Feature.",l:[["atsv","Direct sequel"],["noir","Nicolas Cage voiced Spider-Noir here"]]},
{id:"atsv",t:"Spider-Man: Across the Spider-Verse",y:2023,ty:"A",pl:"Theatrical (Sony)",pg:"spider",g:"Spider-Verse",n:"The Spider-Society and canon events. Donald Glover cameos in live action as the Prowler.",l:[["homec","Donald Glover played Aaron Davis in Homecoming"],["btsv","Part two"]]},
{id:"btsv",t:"Spider-Man: Beyond the Spider-Verse",y:2027,ty:"A",pl:"Theatrical (Sony)",pg:"spider",g:"Spider-Verse",up:1,n:"Planned for June 2027. Finishes Miles's story."},
{id:"noir",t:"Spider-Noir",y:2026,ty:"S",pl:"MGM+ / Prime Video",pg:"spider",g:"Spider-Verse",n:"A live-action series with Nicolas Cage as a 1930s Spider-Man."},
{id:"smtas",t:"Spider-Man: The Animated Series",y:1994,ty:"A",pl:"Fox Kids",pg:"spider",g:"Spider-Verse",n:"The 90s cartoon that ran alongside X-Men: TAS."},

/* ================= 2000s ERA & OTHER STUDIOS ================= */
{id:"hd",t:"Howard the Duck",y:1986,ty:"F",pl:"Theatrical (Universal)",pg:"legacy",g:"Early oddities",n:"The first theatrical Marvel film. A famous flop."},
{id:"pun89",t:"The Punisher",y:1989,ty:"F",pl:"Home video (New World)",pg:"legacy",g:"Punisher",n:"Dolph Lundgren as Frank Castle."},
{id:"blade1",t:"Blade",y:1998,ty:"F",pl:"Theatrical (New Line)",pg:"legacy",g:"Blade",n:"Wesley Snipes as the vampire hunter. Its success helped start the modern superhero boom.",l:[["blade2","Direct sequel"]]},
{id:"blade2",t:"Blade II",y:2002,ty:"F",pl:"Theatrical (New Line)",pg:"legacy",g:"Blade",n:"Directed by Guillermo del Toro. Blade teams up with vampires against the Reapers.",l:[["blade3","Direct sequel"]]},
{id:"blade3",t:"Blade: Trinity",y:2004,ty:"F",pl:"Theatrical (New Line)",pg:"legacy",g:"Blade",n:"Blade against Dracula, with the Nightstalkers."},
{id:"dd03",t:"Daredevil",y:2003,ty:"F",pl:"Theatrical (Fox)",pg:"legacy",g:"Daredevil & Elektra",n:"Ben Affleck as Matt Murdock, with Jennifer Garner's Elektra and Colin Farrell's Bullseye.",l:[["elektra","Spin-off"]]},
{id:"hulk03",t:"Hulk",y:2003,ty:"F",pl:"Theatrical (Universal)",pg:"legacy",g:"Hulk",n:"Ang Lee's take, with Eric Bana. Not part of the MCU; The Incredible Hulk (2008) is a reboot."},
{id:"pun04",t:"The Punisher",y:2004,ty:"F",pl:"Theatrical (Lionsgate)",pg:"legacy",g:"Punisher",n:"Thomas Jane as Frank Castle, against John Travolta."},
{id:"elektra",t:"Elektra",y:2005,ty:"F",pl:"Theatrical (Fox)",pg:"legacy",g:"Daredevil & Elektra",n:"Jennifer Garner's assassin against the Hand."},
{id:"ff05",t:"Fantastic Four",y:2005,ty:"F",pl:"Theatrical (Fox)",pg:"legacy",g:"Fantastic Four",n:"Ioan Gruffudd, Jessica Alba, Chris Evans and Michael Chiklis. Doom is played by Julian McMahon.",l:[["ff07","Direct sequel"]]},
{id:"ff07",t:"Fantastic Four: Rise of the Silver Surfer",y:2007,ty:"F",pl:"Theatrical (Fox)",pg:"legacy",g:"Fantastic Four",n:"The Silver Surfer and a cloud-like Galactus."},
{id:"gr",t:"Ghost Rider",y:2007,ty:"F",pl:"Theatrical (Sony)",pg:"legacy",g:"Ghost Rider",n:"Nicolas Cage as Johnny Blaze.",l:[["gr2","Sequel"]]},
{id:"punwz",t:"Punisher: War Zone",y:2008,ty:"F",pl:"Theatrical (Lionsgate)",pg:"legacy",g:"Punisher",n:"Ray Stevenson as Frank Castle, against Jigsaw."},
{id:"gr2",t:"Ghost Rider: Spirit of Vengeance",y:2012,ty:"F",pl:"Theatrical (Sony)",pg:"legacy",g:"Ghost Rider",n:"Cage returns as Johnny Blaze in Eastern Europe."},
{id:"ff15",t:"Fantastic Four",y:2015,ty:"F",pl:"Theatrical (Fox)",pg:"legacy",g:"Fantastic Four",n:"Josh Trank's reboot with Miles Teller. Standalone."},

/* ================= ADULT ANIMATION ================= */
{id:"modok",t:"M.O.D.O.K.",y:2021,ty:"A",pl:"Hulu",pg:"other",g:"Adult animation",n:"Stop-motion comedy about the villain's midlife crisis."},
{id:"hitmonkey",t:"Hit-Monkey",y:2021,ty:"A",pl:"Hulu",pg:"other",g:"Adult animation",n:"A Japanese snow monkey becomes an assassin."}
];
