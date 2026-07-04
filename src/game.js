import {
  COURT,
  clamp,
  circleIntersectsRect,
  isGameOver,
  racketBounds,
  scoreForOutOfBounds
} from "./physics.js";

const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");
const playerScoreEl = document.querySelector("#playerScore");
const aiScoreEl = document.querySelector("#aiScore");
const matchStateEl = document.querySelector("#matchState");
const rallyStateEl = document.querySelector("#rallyState");
const serveButton = document.querySelector("#serveButton");
const resetButton = document.querySelector("#resetButton");

const keys = new Set();
const state = {
  playerScore: 0,
  aiScore: 0,
  playerX: COURT.width / 2,
  aiX: COURT.width / 2,
  serving: true,
  winner: null,
  lastScorer: null,
  shuttle: {
    x: COURT.width / 2,
    y: COURT.playerY - 42,
    vx: 0,
    vy: 0,
    radius: COURT.shuttleRadius
  }
};

function resetShuttle(server = "player") {
  state.serving = true;
  const serveFromPlayer = server !== "ai";
  state.shuttle.x = serveFromPlayer ? state.playerX : state.aiX;
  state.shuttle.y = serveFromPlayer ? COURT.playerY - 42 : COURT.aiY + 42;
  state.shuttle.vx = 0;
  state.shuttle.vy = 0;
  rallyStateEl.textContent = serveFromPlayer ? "Your serve" : "AI serve";
}

function serve() {
  if (state.winner) {
    resetMatch();
    return;
  }

  if (!state.serving) {
    return;
  }

  const aiServe = state.lastScorer === "ai";
  state.serving = false;
  state.shuttle.vx = aiServe ? (Math.random() - 0.5) * 4 : (Math.random() - 0.5) * 3;
  state.shuttle.vy = aiServe ? 5.4 : -6.2;
  rallyStateEl.textContent = "Rally in play";
}

function resetMatch() {
  state.playerScore = 0;
  state.aiScore = 0;
  state.playerX = COURT.width / 2;
  state.aiX = COURT.width / 2;
  state.winner = null;
  state.lastScorer = null;
  resetShuttle("player");
  syncHud();
}

function syncHud() {
  playerScoreEl.textContent = String(state.playerScore);
  aiScoreEl.textContent = String(state.aiScore);

  if (state.winner) {
    matchStateEl.textContent = state.winner === "player" ? "You win the match" : "AI wins the match";
    rallyStateEl.textContent = "Press Reset or Serve";
  } else {
    matchStateEl.textContent = "First to 11 wins";
  }
}

function awardPoint(winner) {
  if (winner === "player") {
    state.playerScore += 1;
  } else {
    state.aiScore += 1;
  }

  state.lastScorer = winner;
  if (isGameOver(state.playerScore, state.aiScore)) {
    state.winner = winner;
  }

  resetShuttle(winner);
  syncHud();
}

function updatePlayer() {
  const speed = 8.2;
  if (keys.has("ArrowLeft") || keys.has("a")) {
    state.playerX -= speed;
  }
  if (keys.has("ArrowRight") || keys.has("d")) {
    state.playerX += speed;
  }

  state.playerX = clamp(
    state.playerX,
    COURT.marginX + COURT.racketWidth / 2,
    COURT.width - COURT.marginX - COURT.racketWidth / 2
  );
}

function updateAi() {
  const target = state.shuttle.y < COURT.netY || state.shuttle.vy < 0 ? state.shuttle.x : COURT.width / 2;
  state.aiX += clamp(target - state.aiX, -5.1, 5.1);
  state.aiX = clamp(
    state.aiX,
    COURT.marginX + COURT.racketWidth / 2,
    COURT.width - COURT.marginX - COURT.racketWidth / 2
  );
}

function returnFromRacket(owner) {
  const shuttle = state.shuttle;
  const racketX = owner === "player" ? state.playerX : state.aiX;
  const offset = clamp((shuttle.x - racketX) / (COURT.racketWidth / 2), -1, 1);
  shuttle.vx = offset * 6.4;
  shuttle.vy = owner === "player" ? -7.4 : 6.7;
  shuttle.y += owner === "player" ? -8 : 8;
  rallyStateEl.textContent = owner === "player" ? "Nice return" : "AI returned";
}

function updateShuttle() {
  const shuttle = state.shuttle;

  if (state.serving) {
    shuttle.x = state.lastScorer === "ai" ? state.aiX : state.playerX;
    shuttle.y = state.lastScorer === "ai" ? COURT.aiY + 42 : COURT.playerY - 42;
    return;
  }

  shuttle.x += shuttle.vx;
  shuttle.y += shuttle.vy;
  shuttle.vx *= 0.997;

  if (shuttle.x < COURT.marginX || shuttle.x > COURT.width - COURT.marginX) {
    shuttle.vx *= -0.82;
    shuttle.x = clamp(shuttle.x, COURT.marginX, COURT.width - COURT.marginX);
  }

  const playerRect = racketBounds(state.playerX, COURT.playerY);
  const aiRect = racketBounds(state.aiX, COURT.aiY);

  if (shuttle.vy > 0 && circleIntersectsRect(shuttle, playerRect)) {
    returnFromRacket("player");
  }

  if (shuttle.vy < 0 && circleIntersectsRect(shuttle, aiRect)) {
    returnFromRacket("ai");
  }

  const scorer = scoreForOutOfBounds(shuttle);
  if (scorer) {
    awardPoint(scorer);
  }
}

function drawCourt() {
  const { width, height, marginX, marginY, netY } = COURT;
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#2e826c");
  gradient.addColorStop(1, "#216c5b");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.fillRect(marginX, marginY, width - marginX * 2, height - marginY * 2);

  ctx.strokeStyle = "#f7faf4";
  ctx.lineWidth = 4;
  ctx.strokeRect(marginX, marginY, width - marginX * 2, height - marginY * 2);

  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2, marginY);
  ctx.lineTo(width / 2, height - marginY);
  ctx.moveTo(marginX, 150);
  ctx.lineTo(width - marginX, 150);
  ctx.moveTo(marginX, height - 150);
  ctx.lineTo(width - marginX, height - 150);
  ctx.stroke();

  ctx.strokeStyle = "#13231d";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(marginX - 18, netY);
  ctx.lineTo(width - marginX + 18, netY);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
  ctx.lineWidth = 2;
  for (let x = marginX - 10; x <= width - marginX + 10; x += 22) {
    ctx.beginPath();
    ctx.moveTo(x, netY - 18);
    ctx.lineTo(x + 10, netY + 18);
    ctx.stroke();
  }
}

function drawRacket(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x - COURT.racketWidth / 2, y - 7, COURT.racketWidth, 14);
  ctx.fillStyle = "#f7faf4";
  ctx.fillRect(x - 22, y - 12, 44, 24);
}

function drawShuttle() {
  const shuttle = state.shuttle;
  ctx.save();
  ctx.translate(shuttle.x, shuttle.y);
  ctx.fillStyle = "#f8fbff";
  ctx.beginPath();
  ctx.arc(0, 0, shuttle.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#f2b84b";
  ctx.lineWidth = 4;
  const featherDirection = shuttle.vy >= 0 ? -1 : 1;
  ctx.beginPath();
  ctx.moveTo(-5, featherDirection * 8);
  ctx.lineTo(-15, featherDirection * 27);
  ctx.moveTo(5, featherDirection * 8);
  ctx.lineTo(15, featherDirection * 27);
  ctx.moveTo(0, featherDirection * 9);
  ctx.lineTo(0, featherDirection * 31);
  ctx.stroke();
  ctx.restore();
}

function drawOverlay() {
  if (!state.serving && !state.winner) {
    return;
  }

  ctx.fillStyle = "rgba(21, 32, 25, 0.58)";
  ctx.fillRect(0, 0, COURT.width, COURT.height);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "800 38px Arial";
  ctx.fillText(state.winner ? matchStateEl.textContent : "Ready to Serve", COURT.width / 2, COURT.height / 2 - 14);
  ctx.font = "600 18px Arial";
  ctx.fillText("Press Serve or Space", COURT.width / 2, COURT.height / 2 + 28);
}

function draw() {
  drawCourt();
  drawRacket(state.aiX, COURT.aiY, "#f2b84b");
  drawRacket(state.playerX, COURT.playerY, "#152019");
  drawShuttle();
  drawOverlay();
}

function loop() {
  updatePlayer();
  updateAi();
  if (!state.winner) {
    updateShuttle();
  }
  draw();
  requestAnimationFrame(loop);
}

function moveToClientX(clientX) {
  const rect = canvas.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * COURT.width;
  state.playerX = clamp(x, COURT.marginX + COURT.racketWidth / 2, COURT.width - COURT.marginX - COURT.racketWidth / 2);
}

window.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    event.preventDefault();
    serve();
  }
  keys.add(event.key);
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key);
});

canvas.addEventListener("pointermove", (event) => {
  moveToClientX(event.clientX);
});

canvas.addEventListener("pointerdown", (event) => {
  moveToClientX(event.clientX);
  canvas.setPointerCapture(event.pointerId);
  if (state.serving) {
    serve();
  }
});

serveButton.addEventListener("click", serve);
resetButton.addEventListener("click", resetMatch);

syncHud();
resetShuttle("player");
loop();
