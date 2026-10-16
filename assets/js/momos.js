/* Momo Catch: a tiny canvas game */
(function () {
  const stage = document.getElementById("stage");
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const overlay = document.getElementById("overlay");
  const startBtn = document.getElementById("startBtn");
  const ovTitle = document.getElementById("ovTitle");
  const ovText = document.getElementById("ovText");
  const legend = document.getElementById("legend");
  const couponSlot = document.getElementById("couponSlot");
  const scoreEl = document.getElementById("score");
  const timeEl = document.getElementById("time");

  const GAME_SECONDS = 30;
  const WIN_SCORE = 12;

  let W = 360, H = 470;
  const plate = { x: W / 2, w: 96, vx: 0 };
  let items = [], pops = [];
  let score = 0, timeLeft = GAME_SECONDS, spawnTimer = 0;
  let running = false, last = 0, best = 0;

  function resize() {
    const w = Math.min(stage.clientWidth || 360, 520);
    const dpr = window.devicePixelRatio || 1;
    W = w;
    H = Math.round(w * 1.3);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    plate.x = Math.min(Math.max(plate.x, plate.w / 2), W - plate.w / 2);
    if (!running) draw();
  }
  window.addEventListener("resize", resize);

  function plateY() { return H - 56; }

  // ---- input ----
  function setPlateFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (W / rect.width);
    plate.x = Math.min(Math.max(x, plate.w / 2), W - plate.w / 2);
  }
  canvas.addEventListener("pointermove", setPlateFromEvent);
  canvas.addEventListener("pointerdown", setPlateFromEvent);

  const keys = {};
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") { keys[e.key] = true; e.preventDefault(); }
  });
  window.addEventListener("keyup", (e) => { keys[e.key] = false; });

  // ---- game logic ----
  function spawn() {
    const r = Math.random();
    let type = "momo";
    if (r > 0.9) type = "heart";
    else if (r > 0.72) type = "book";
    const elapsed = GAME_SECONDS - timeLeft;
    items.push({
      type,
      x: 24 + Math.random() * (W - 48),
      y: -30,
      speed: 120 + Math.random() * 80 + elapsed * 5,
      rot: Math.random() * 6,
      spin: (Math.random() - 0.5) * 3
    });
  }

  function addPop(x, y, text, color) {
    pops.push({ x, y, text, color, life: 0.8 });
  }

  function update(dt) {
    // keyboard movement
    const move = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0);
    if (move) plate.x = Math.min(Math.max(plate.x + move * 420 * dt, plate.w / 2), W - plate.w / 2);

    timeLeft -= dt;
    if (timeLeft <= 0) { timeLeft = 0; endGame(); return; }

    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      spawn();
      const elapsed = GAME_SECONDS - timeLeft;
      spawnTimer = Math.max(0.28, 0.75 - elapsed * 0.014);
    }

    const py = plateY();
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      it.y += it.speed * dt;
      it.rot += it.spin * dt;

      const caught = it.y > py - 14 && it.y < py + 22 && Math.abs(it.x - plate.x) < plate.w / 2 + 8;
      if (caught) {
        if (it.type === "momo") { score += 1; addPop(it.x, py - 20, "+1", "#ff6b9d"); }
        else if (it.type === "heart") { score += 3; addPop(it.x, py - 20, "+3 💗", "#e0446f"); }
        else { score = Math.max(0, score - 2); addPop(it.x, py - 20, "−2 😖", "#8a6a7a"); }
        scoreEl.textContent = score;
        items.splice(i, 1);
      } else if (it.y > H + 30) {
        items.splice(i, 1);
      }
    }

    for (let i = pops.length - 1; i >= 0; i--) {
      pops[i].life -= dt;
      pops[i].y -= 40 * dt;
      if (pops[i].life <= 0) pops.splice(i, 1);
    }
    timeEl.textContent = Math.ceil(timeLeft);
  }

  // ---- drawing ----
  function drawEmoji(ch, x, y, size, rot) {
    ctx.save();
    ctx.translate(x, y);
    if (rot) ctx.rotate(rot);
    ctx.font = size + "px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // soft background dots
    ctx.fillStyle = "rgba(255,143,171,0.12)";
    for (let i = 0; i < 14; i++) {
      ctx.beginPath();
      ctx.arc((i * 83) % W, (i * 127) % H, 14 + (i % 3) * 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // items
    items.forEach((it) => {
      const ch = it.type === "momo" ? "🥟" : it.type === "heart" ? "💗" : "📒";
      drawEmoji(ch, it.x, it.y, it.type === "heart" ? 30 : 36, it.rot);
    });

    // plate
    const py = plateY();
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ff8fab";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(plate.x, py + 8, plate.w / 2, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ffe5ec";
    ctx.beginPath();
    ctx.ellipse(plate.x, py + 6, plate.w / 2 - 14, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    drawEmoji("🥟", plate.x, py - 4, 24, 0);

    // pops
    pops.forEach((p) => {
      ctx.globalAlpha = Math.max(0, p.life / 0.8);
      ctx.fillStyle = p.color;
      ctx.font = "700 20px Quicksand, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(p.text, p.x, p.y);
      ctx.globalAlpha = 1;
    });
  }

  function loop(ts) {
    if (!running) return;
    const dt = Math.min(0.05, (ts - last) / 1000);
    last = ts;
    update(dt);
    if (running) { draw(); requestAnimationFrame(loop); }
  }

  function startGame() {
    items = []; pops = [];
    score = 0; timeLeft = GAME_SECONDS; spawnTimer = 0.3;
    scoreEl.textContent = "0";
    timeEl.textContent = String(GAME_SECONDS);
    overlay.classList.add("hide");
    running = true;
    last = performance.now();
    requestAnimationFrame(loop);
  }

  function endGame() {
    running = false;
    draw();
    best = Math.max(best, score);
    legend.style.display = "none";
    couponSlot.innerHTML = "";

    if (score >= WIN_SCORE) {
      ovTitle.textContent = "Momo master! 🏆";
      ovText.textContent = "You caught " + score + " momos. Your reward is waiting:";
      couponSlot.innerHTML =
        '<div class="coupon"><strong>🎟️ One Plate of Momos</strong>' +
        "Valid today, tomorrow, and forever.<br>Screenshot this and claim it!</div>";
      const r = overlay.getBoundingClientRect();
      window.burst(r.left + r.width / 2, r.top + r.height / 3, 34, "🥟");
    } else {
      ovTitle.textContent = "So close! 💗";
      ovText.textContent =
        "You caught " + score + ". Try again for the coupon, or just go and eat momos anyway. You deserve them regardless.";
    }
    startBtn.textContent = "Play again 🥟";
    overlay.classList.remove("hide");
  }

  startBtn.addEventListener("click", startGame);
  resize();
  draw();
})();
