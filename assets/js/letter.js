/* Love letter: envelope opens, letter types itself out, "open when" notes appear */
(function () {
  const S = window.SITE || {};
  const paragraphs = S.letter && S.letter.length ? S.letter : ["Dear you, 💗"];
  const openWhen = S.openWhen || [];

  const envelope = document.getElementById("envelope");
  const letter = document.getElementById("letter");
  const hint = document.getElementById("envHint");
  const section = document.getElementById("openWhenSection");
  const replyRow = document.getElementById("replyRow");
  const grid = document.getElementById("miniGrid");
  let opened = false;

  // Build the "open when" cards
  openWhen.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card mini";
    card.tabIndex = 0;
    const t = document.createElement("div");
    t.className = "t";
    t.textContent = "💌 " + item.title;
    const note = document.createElement("p");
    note.className = "note";
    note.textContent = item.note;
    card.appendChild(t);
    card.appendChild(note);
    const toggle = () => card.classList.toggle("open");
    card.addEventListener("click", toggle);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });
    grid.appendChild(card);
  });

  function writeParagraph(i) {
    if (i >= paragraphs.length) { finish(); return; }
    const p = document.createElement("p");
    letter.appendChild(p);
    window.typeText(p, paragraphs[i], 22, () => setTimeout(() => writeParagraph(i + 1), 350));
  }

  function finish() {
    const from = document.createElement("p");
    from.className = "from";
    from.textContent = "With all my warmth, " + (S.from || "your friend") + " 🌸";
    letter.appendChild(from);
    section.style.display = "block";
    replyRow.style.display = "block";
    const r = letter.getBoundingClientRect();
    window.burst(r.left + r.width / 2, r.bottom, 24, "💗");
  }

  function openEnvelope() {
    if (opened) return;
    opened = true;
    envelope.classList.add("open");
    hint.textContent = "Take your time. Read it slowly. 💗";
    setTimeout(() => {
      envelope.style.display = "none";
      letter.classList.add("show");
      writeParagraph(0);
    }, 1000);
  }

  envelope.addEventListener("click", openEnvelope);
  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEnvelope(); }
  });

  const hugBack = document.getElementById("hugBack");
  hugBack.addEventListener("click", () => {
    const r = hugBack.getBoundingClientRect();
    window.burst(r.left + r.width / 2, r.top + r.height / 2, 30, "💗");
    hugBack.textContent = "Hug delivered 🥹 (it's a big one)";
  });
})();
