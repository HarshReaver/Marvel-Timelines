/* Home page: section counts, the Doomsday countdown and the mini poster stacks. */
(function () {
  document.querySelectorAll("[data-c]").forEach(el => (el.textContent = SITE.count(el.dataset.c) + " titles"));
  document.getElementById("c-all").textContent = TITLES.length + " titles";
  document.querySelectorAll(".toc-posters").forEach(el => (el.innerHTML = el.dataset.ids.split(",").map(id => SITE.posterImg(id, "")).join("")));
  const days = Math.ceil((new Date("2026-12-18T00:00:00") - new Date()) / 864e5);
  const n = document.getElementById("days"), label = document.getElementById("days-label");
  if (days > 0) n.textContent = days;
  else { n.textContent = "Out now"; label.innerHTML = '<b>Avengers: Doomsday</b> is in cinemas. Next up is Secret Wars in December 2027. <a href="multiverse.html">See the road to Secret Wars</a>'; }
})();
