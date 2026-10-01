/* Shuohan Wang — site interactions
   Scroll reveals, parallax hero, nav state. No dependencies. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    // Stagger siblings that appear together (hero, skill groups, cards)
    revealEls.forEach(function (el) {
      var siblings = Array.prototype.filter.call(
        el.parentElement.children,
        function (c) { return c.classList && c.classList.contains("reveal"); }
      );
      var idx = siblings.indexOf(el);
      el.style.setProperty("--d", Math.min(idx, 5) * 90 + "ms");
      io.observe(el);
    });
  }

  /* ---------- Nav state on scroll ---------- */
  var nav = document.getElementById("siteNav");
  function onScrollNav() {
    nav.classList.toggle("scrolled", window.scrollY > 10);
  }
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ---------- Hero parallax ---------- */
  var heroBg = document.querySelector(".hero-bg");
  var heroPhoto = document.querySelector(".hero-photo");
  var hero = document.querySelector(".hero");

  if (!reduceMotion && hero) {
    var ticking = false;

    function render() {
      ticking = false;
      var y = window.scrollY;
      var heroBottom = hero.offsetTop + hero.offsetHeight;
      if (y < heroBottom) {
        if (heroBg) heroBg.style.transform = "translateY(" + y * 0.22 + "px)";
        if (heroPhoto) heroPhoto.style.transform = "translateY(" + y * -0.045 + "px)";
      }
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(render);
        }
      },
      { passive: true }
    );

    // Gentle pointer parallax on the hero (desktop, fine pointers only)
    var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (fine && heroBg) {
      hero.addEventListener("mousemove", function (e) {
        var cx = (e.clientX / window.innerWidth - 0.5) * 2;
        var cy = (e.clientY / window.innerHeight - 0.5) * 2;
        heroBg.style.backgroundPosition =
          15 + cx * 1.5 + "% " + (8 + cy * 1.5) + "%, " +
          88 - cx * 1.5 + "% " + (18 - cy * 1.5) + "%, " +
          "50% 110%, 0 0";
      });
    }
  }
})();
