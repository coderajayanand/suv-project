/* Report card: tap to read remarks, stamp on scroll, re-evaluation button */
(function () {
  // Tap a subject to open its remark
  document.querySelectorAll(".subject button").forEach((btn) => {
    btn.addEventListener("click", () => btn.parentElement.classList.toggle("open"));
  });

  // Stamp slams down when the remarks come into view
  const stamp = document.getElementById("stamp");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          setTimeout(() => stamp.classList.add("show"), 400);
          io.disconnect();
        }
      });
    }, { threshold: 0.6 });
    io.observe(stamp.parentElement);
  } else {
    stamp.classList.add("show");
  }

  // Re-evaluation: every request makes the grades even better
  const grades = document.querySelectorAll(".grade");
  const btn = document.getElementById("reevalBtn");
  const msg = document.getElementById("reevalMsg");
  const replies = [
    "The board reviewed it. Grades went UP. Suspicious, but fine.",
    "Second review: the board says it was too strict earlier.",
    "Third review: the board is now just fans.",
    "Fourth review: an emergency meeting was held. More pluses were added.",
    "Fifth review: the grading scale has officially broken. 💗",
    "Maximum reached. The board has run out of pluses (and stopped pretending to be neutral)."
  ];
  let pluses = 1;
  let n = 0;

  btn.addEventListener("click", () => {
    if (pluses < 8) pluses++;
    grades.forEach((g) => {
      g.textContent = "A" + "+".repeat(pluses);
      g.classList.add("pop");
      setTimeout(() => g.classList.remove("pop"), 300);
    });
    msg.textContent = replies[Math.min(n++, replies.length - 1)];
    const r = btn.getBoundingClientRect();
    window.burst(r.left + r.width / 2, r.top, 14, "⭐");
  });
})();
