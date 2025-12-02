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
    ctx.strokeStyle = "white";
    // ctx.lineWidth = 2;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeRect(this.x, this.y, this.w, this.h);
  }
}

// --- PALETTE ---------------------------------------------------------------
const PALETTE = [
  "#6e8570", // muted moss green
  "#8ea7ab", // steel blue-grey
  "#a48d7b", // warm stone brown
  "#8c5f5f", // earthy desaturated red
  "#4b5773", // deep slate blue
  "#b7a98a", // taupe sand
  "#2f6d72", // muted teal
  "#81758b", // desaturated purple-grey
  "#a88867"  // warm ochre brown
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
    if (depth < 3 && Math.random() < 0.6) {
      divide(t.x, t.y, t.w, t.h, depth + 1, direction);
    } else {
      allTiles.push(new Tile(t.x, t.y, t.w, t.h, randomColor()));
    }
  }
}

// --- INITIAL DRAW ----------------------------------------------------------
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);
  allTiles = [];
  divide(0, 0, canvas.width, canvas.height, 0, 0);
}
resizeCanvas();

// --- STRONG WOBBLE ANIMATION -----------------------------------------------
function animate() {
  ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;

  const t = Date.now() * 0.0003;
  const driftX = Math.sin(t) * 30;
  const driftY = Math.cos(t * 0.7) * 30;
  const rotation = Math.sin(t * 0.5) * 0.03;
  const scale = 1 + Math.sin(t * 0.8) * 0.03;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(scale, scale);
  ctx.rotate(rotation);
  ctx.translate(-canvas.width / 2 + driftX, -canvas.height / 2 + driftY);

  for (let tile of allTiles) {
    ctx.fillStyle = tile.color;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.fillRect(Math.floor(tile.x), Math.floor(tile.y), Math.floor(tile.w), Math.floor(tile.h));
    ctx.strokeRect(Math.floor(tile.x) + 0.5, Math.floor(tile.y) + 0.5, Math.floor(tile.w), Math.floor(tile.h));
  }

  ctx.restore();
  requestAnimationFrame(animate);
}


animate();
