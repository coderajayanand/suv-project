/* Home page: typed intro, hug button, cheer-o-meter, toss-the-stress-away */
(function () {
  const S = window.SITE || {};

  // ---- Typed intro (types a line, pauses, then the next) ----
  const lines = [
    "I heard today was a tough one.",
    "So I made you a tiny corner of the internet.",
    "Nothing to do here but smile. And maybe eat momos. 🥟"
  ];
  const typedEl = document.getElementById("typed");
  let li = 0;
  function nextLine() {
    window.typeText(typedEl, lines[li], 40, () => {
      li = (li + 1) % lines.length;
      setTimeout(nextLine, 2200);
    });
  }
  nextLine();

  // ---- Hug button ----
  const hugBtn = document.getElementById("hugBtn");
  hugBtn.addEventListener("click", (e) => {
    const r = hugBtn.getBoundingClientRect();
    window.burst(r.left + r.width / 2, r.top + r.height / 2, 22, "💗");
    hugBtn.textContent = "Hug received 🥹 Sending it back!";
    setTimeout(() => (hugBtn.textContent = "Send me a hug 🤗"), 2500);
  });

  // ---- Cheer-o-meter ----
  const fill = document.getElementById("meterFill");
  const msg = document.getElementById("cheerMsg");
  const cheerBtn = document.getElementById("cheerBtn");
  const cheers = S.cheers && S.cheers.length ? S.cheers : ["You're wonderful. 💗"];
  let level = 0;
  let idx = 0;

  cheerBtn.addEventListener("click", () => {
    if (level >= 100) {
      level = 0;
      fill.style.width = "0%";
      msg.textContent = "Reset! Go again, you deserve it.";
      cheerBtn.textContent = "Tap for a dose of cheer";
      return;
    }
    level = Math.min(100, level + 12 + Math.floor(Math.random() * 6));
    fill.style.width = level + "%";
    msg.textContent = cheers[idx % cheers.length];
    idx++;
    if (level >= 100) {
      msg.textContent = "Fully charged! Doctor's orders: momos, immediately. 🥟";
      cheerBtn.textContent = "Go again 💗";
      const r = cheerBtn.getBoundingClientRect();
      window.burst(r.left + r.width / 2, r.top, 30, "🥟");
    }
  });

  // ---- Toss the bad day ----
  const zone = document.getElementById("binZone");
  const input = document.getElementById("stressInput");
  const tossBtn = document.getElementById("tossBtn");
  const tossMsg = document.getElementById("tossMsg");
  const tossReplies = [
    "Gone. Poof. Not your problem anymore. 🌸",
    "Binned! That one doesn't get a second thought.",
    "Swish! Nothing but net. Now, momos? 🥟",
    "Deleted from your day. You're allowed to rest now. 💗"
  ];
  let tossCount = 0;

  function toss() {
    const text = input.value.trim();
    if (!text) {
      tossMsg.textContent = "Type something first. Even a small annoyance counts. 😄";
      return;
    }
    const paper = document.createElement("div");
    paper.className = "paper";
    paper.textContent = text;
    // Aim at the bin: distance from paper's left to the bin on the right
    const tx = Math.max(120, zone.clientWidth - 150);
    paper.style.setProperty("--tx", tx + "px");
    zone.appendChild(paper);
    input.value = "";
    requestAnimationFrame(() => requestAnimationFrame(() => paper.classList.add("toss")));
    setTimeout(() => {
      paper.remove();
      tossMsg.textContent = tossReplies[tossCount++ % tossReplies.length];
      const br = zone.getBoundingClientRect();
      window.burst(br.right - 40, br.bottom - 30, 10, "✨");
    }, 1400);
  }
  tossBtn.addEventListener("click", toss);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") toss(); });
})();
