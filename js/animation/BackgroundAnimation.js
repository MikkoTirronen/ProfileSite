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
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeRect(this.x, this.y, this.w, this.h);
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
  if (w < 15 || h < 15) return;

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
    if (depth < 9) {
      divide(t.x, t.y, t.w, t.h, depth + 1, direction);
    } else {
      allTiles.push(new Tile(t.x, t.y, t.w, t.h, randomColor()));
    }
  }
}

// --- INITIAL DRAW ----------------------------------------------------------
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  allTiles = [];
  divide(0, 0, canvas.width, canvas.height, 0, 0);
}
resizeCanvas();

// --- STRONG WOBBLE ANIMATION -----------------------------------------------
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const t = Date.now() * 0.0003; // ← much faster so motion is obvious

  const driftX = Math.sin(t) * 30;  // ← big movement
  const driftY = Math.cos(t * 0.7) * 30;

  const rotation = Math.sin(t * 0.5) * 0.03; // ← 1.5 degrees
  const scale = 1 + Math.sin(t * 0.8) * 0.03; // ← 3% scaling

  ctx.save();

  // Transform origin
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(scale, scale);
  ctx.rotate(rotation);

  // Apply drift
  ctx.translate(-canvas.width / 2 + driftX, -canvas.height / 2 + driftY);

  // Draw tiles
  for (let tile of allTiles) {
    tile.draw();
  }

  ctx.restore();

  requestAnimationFrame(animate);
}

animate();
