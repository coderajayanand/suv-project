/* Shared behaviour: name injection, nav highlight, floating hearts, click bursts, typewriter */
(function () {
  const S = window.SITE || {};
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Fill in her name wherever data-her is used
  document.querySelectorAll("[data-her]").forEach((el) => { el.textContent = S.her || "Suveccha"; });
  document.querySelectorAll("[data-from]").forEach((el) => { el.textContent = S.from || ""; });

  // Highlight current page in the nav
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach((a) => {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });

  // Floating background hearts
  const layer = document.getElementById("hearts");
  const glyphs = ["💗", "💖", "🌸", "✨", "🥟", "💕", "🌷"];
  function spawn() {
    if (!layer) return;
    const el = document.createElement("span");
    el.className = "float-heart";
    el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.fontSize = 14 + Math.random() * 22 + "px";
    el.style.animationDuration = 7 + Math.random() * 7 + "s";
    el.style.setProperty("--sway", (Math.random() * 80 - 40) + "px");
    layer.appendChild(el);
    setTimeout(() => el.remove(), 15000);
  }
  if (!reduce) {
    for (let i = 0; i < 6; i++) setTimeout(spawn, i * 300);
    setInterval(spawn, 1100);
  }

  // Burst of emojis at a point (also used by pages)
  window.burst = function (x, y, count, glyph) {
    if (reduce) return;
    const list = glyph ? [glyph] : glyphs;
    for (let i = 0; i < (count || 10); i++) {
      const el = document.createElement("span");
      el.className = "burst";
      el.textContent = list[Math.floor(Math.random() * list.length)];
      el.style.left = x + "px";
      el.style.top = y + "px";
      el.style.fontSize = 16 + Math.random() * 16 + "px";
      const angle = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * 90;
      el.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      el.style.setProperty("--dy", Math.sin(angle) * dist + "px");
      el.style.setProperty("--rot", Math.random() * 200 - 100 + "deg");
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1000);
    }
  };

  // Tiny sparkle wherever she taps (not on the game canvas)
  document.addEventListener("click", (e) => {
    if (e.target.closest("canvas")) return;
    window.burst(e.clientX, e.clientY, 5);
  });

  // Typewriter helper: typeText(element, text, speedMs, onDone)
  window.typeText = function (el, text, speed, done) {
    if (reduce) { el.textContent = text; if (done) done(); return; }
    let i = 0;
    el.textContent = "";
    (function tick() {
      el.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(tick, speed || 35);
      else if (done) done();
    })();
  };
})();
