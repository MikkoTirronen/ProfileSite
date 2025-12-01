// --- CREATE CANVAS ---------------------------------------------------------
const canvas = document.createElement("canvas");
canvas.id = "bg-animation";
document.body.prepend(canvas);

const ctx = canvas.getContext("2d");

// Canvas styling
Object.assign(canvas.style, {
  position: "fixed",
  inset: 0,
  width: "100vw",
  height: "100vh",
  zIndex: "-1",
  pointerEvents: "none",
});

// --- TILE CLASS -------------------------------------------------------------
class Tile {
  constructor(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.opacity = 1;        // Fade for existing tiles
    this.fadeIn = false;     // If true, increases opacity from 0 → 1
  }

  draw() {
    ctx.globalAlpha = this.opacity;

    ctx.fillStyle = this.color;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    ctx.globalAlpha = 1;
  }

  update(dt, fallSpeed) {
    // Move tile downward
    this.y += fallSpeed * dt;

    // Fade in if flagged
    if (this.fadeIn && this.opacity < 1) {
      this.opacity += dt * 0.0008; // fade speed
      if (this.opacity > 1) this.opacity = 1;
    }
  }
}

// --- PALETTE ---------------------------------------------------------------
const PALETTE = [
  "#acc7a9", "#d0e1de", "#d9b5c3",
  "#cb8f97", "#7380a1", "#e3d3ba",
  "#418e96", "#c1afc0", "#dbb99e",
];

function randomColor() {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}

// --- RECURSIVE DIVIDE ------------------------------------------------------
let allTiles = [];

function divide(x, y, w, h, depth, direction) {
  if (w < 5 || h < 5) return;

  const split = Math.random() * 0.6 + 0.2;

  let tiles = [];
  if (direction === 0) {
    tiles.push({ x, y, w: w * split, h });
    tiles.push({ x: x + w * split, y, w: w - w * split, h });
    direction = 1;
  } else {
    tiles.push({ x, y, w, h: h * split });
    tiles.push({ x, y: y + h * split, w, h: h - h * split });
    direction = 0;
  }

  for (let t of tiles) {
    if (depth < 5) {
      divide(t.x, t.y, t.w, t.h, depth + 1, direction);
    } else {
      allTiles.push(new Tile(t.x, t.y, t.w, t.h, randomColor()));
    }
  }
}

// --- INITIAL DRAW ----------------------------------------------------------
function regenerateScene() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  allTiles = [];
  divide(0, 0, canvas.width, canvas.height, 0, 0);
}
regenerateScene();

// --- HELPERS ---------------------------------------------------------------

// Make a new tile somewhere in the “top band”
function createTileAtTop() {
  // Pick a width band across the top
  const w = Math.random() * 150 + 30;
  const h = Math.random() * 150 + 30;

  const x = Math.random() * (canvas.width - w);
  const y = -h - 5; // Just above the top

  const t = new Tile(x, y, w, h, randomColor());
  t.opacity = 0;
  t.fadeIn = true;

  allTiles.push(t);
}

// --- ANIMATION -------------------------------------------------------------
let lastTime = 0;
const FALL_SPEED = 20; // px per second (slow drift)

function animate(time) {
  const dt = time - lastTime;
  lastTime = time;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update & draw tiles
  for (let tile of allTiles) {
    tile.update(dt, FALL_SPEED / 1000); // convert speed to per-ms
    tile.draw();
  }

  // Remove tiles that fell off the bottom
  allTiles = allTiles.filter(t => t.y < canvas.height + 50);

  // Probability-based tile creation (keeps constant flow)
  if (Math.random() < 0.01) {
    createTileAtTop();
  }

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
