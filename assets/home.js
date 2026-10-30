/* Home page: section counts, the Avengers countdown and the mini poster stacks. */
(function () {
  document.querySelectorAll("[data-c]").forEach(el => (el.textContent = SITE.count(el.dataset.c) + " titles"));
  document.getElementById("c-all").textContent = TITLES.length + " titles";
  document.querySelectorAll(".toc-posters").forEach(el => (el.innerHTML = el.dataset.ids.split(",").map(id => SITE.posterImg(id, "")).join("")));

  // Each film counts down to "out", reads "Out now" while it's in cinemas, and hands over
  // to the next film on its "gone" date (roughly when it leaves cinemas). Edit dates here.
  const FILMS = [
    {t: "Avengers: Doomsday", out: "2026-12-18", gone: "2027-06-01", when: "18 December 2026",
      soon: `<a href="multiverse.html">See who's coming back</a>`,
      now: `Next up is Secret Wars in December 2027. <a href="multiverse.html">See the road to Secret Wars</a>`},
    {t: "Avengers: Secret Wars", out: "2027-12-17", gone: "2028-06-01", when: "17 December 2027",
      soon: `Doomsday has left cinemas, so catch up on it first. <a href="multiverse.html">See the road to Secret Wars</a>`,
      now: `It closes the Multiverse Saga. <a href="multiverse.html">See how the timelines meet</a>`}
  ];
  const dayNo = s => { const [y, m, d] = s.split("-"); return Date.UTC(y, m - 1, d) / 864e5; };
  const now = new Date(), today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 864e5;
  const n = document.getElementById("days"), label = document.getElementById("days-label");
  const f = FILMS.find(f => today < dayNo(f.gone));
  if (!f) {
    n.textContent = "Complete";
    label.innerHTML = 'The Multiverse Saga is over, from Iron Man to Secret Wars. <a href="mcu.html">Watch the MCU in story order</a>';
  } else {
    const days = dayNo(f.out) - today;
    if (days > 0) {
      n.textContent = days;
      label.innerHTML = `${days === 1 ? "day" : "days"} until <b>${f.t}</b>, in cinemas ${f.when}. ${f.soon}`;
    } else {
      n.textContent = "Out now";
      label.innerHTML = `<b>${f.t}</b> is in cinemas. ${f.now}`;
    }
  }
})();
