// -------------------------------------------------------------
// CANVAS SETUP
// -------------------------------------------------------------
const canvas = document.createElement("canvas");
canvas.id = "bg-animation";
document.body.prepend(canvas);

const ctx = canvas.getContext("2d");

Object.assign(canvas.style, {
  position: "fixed",
  inset: "0",
  width: "100vw",
  height: "100vh",
  zIndex: "-1",
  pointerEvents: "none"
});

let staticTiles = [];
let movingTiles = [];

const colors = [
  "#acc7a9", "#d0e1de", "#d9b5c3",
  "#cb8f97", "#7380a1", "#e3d3ba",
  "#418e96", "#c1afc0", "#dbb99e"
];

function randomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

// -------------------------------------------------------------
// TILE CLASS
// -------------------------------------------------------------
class Tile {
  constructor(x, y, w, h, color = null) {
    this.x = x; this.y = y;
    this.w = w; this.h = h;
    this.color = color || randomColor();
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeRect(this.x, this.y, this.w, this.h);
  }
}

// -------------------------------------------------------------
// RECURSIVE DIVISION FOR STATIC BACKGROUND
// -------------------------------------------------------------
function divide(x, y, w, h, count, dir) {
  if (w < 15 || h < 15) return;

  const split = Math.random() * 0.6 + 0.2;
  let tiles = [];

  if (dir === 0) {
    tiles.push(new Tile(x, y, w * split, h));
    tiles.push(new Tile(x + w * split, y, w - w * split, h));
    dir = 1;
  } else {
    tiles.push(new Tile(x, y, w, h * split));
    tiles.push(new Tile(x, y + h * split, w, h - h * split));
    dir = 0;
  }

  for (let t of tiles) {
    if (count < 12) {
      divide(t.x, t.y, t.w, t.h, count + 1, dir);
    } else {
      staticTiles.push(t);
    }
  }
}

function generateStaticGrid() {
  staticTiles = [];
  divide(0, 0, canvas.width, canvas.height, 0, 0);
}

// -------------------------------------------------------------
// MOVING TILE SPAWNING
// -------------------------------------------------------------
let lastSpawn = 0;
const SPAWN_INTERVAL = 100; // spawn every 0.9 seconds

function spawnMovingTile() {
  const base = staticTiles[Math.floor(Math.random() * staticTiles.length)];

  const angle = (performance.now() * 0.00005) % (Math.PI * 2);
  const speed = 0.25 + Math.random() * 0.35;

  movingTiles.push({
    x: base.x,
    y: base.y,
    w: base.w,
    h: base.h,
    angle,
    speed,
    opacity: 0,
    color: randomColor()
  });
}

// -------------------------------------------------------------
// MOVING TILES UPDATE + DRAW
// -------------------------------------------------------------
function updateMovingTiles() {
  for (let i = movingTiles.length - 1; i >= 0; i--) {
    const t = movingTiles[i];

    t.x += Math.cos(t.angle) * t.speed;
    t.y += Math.sin(t.angle) * t.speed;

    t.opacity += 0.01;
    if (t.opacity > 1) t.opacity = 1;

    if (
      t.x + t.w < -200 ||
      t.x > canvas.width + 200 ||
      t.y + t.h < -200 ||
      t.y > canvas.height + 200
    ) {
      movingTiles.splice(i, 1);
    }
  }
}

function drawMovingTiles() {
 for (let t of movingTiles) {
    ctx.globalAlpha = t.opacity;

    // fill
    ctx.fillStyle = t.color;
    ctx.fillRect(t.x, t.y, t.w, t.h);

    // border
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.strokeRect(t.x, t.y, t.w, t.h);
  }
  ctx.globalAlpha = 1;
}

// -------------------------------------------------------------
// STATIC DRAW
// -------------------------------------------------------------
function drawStaticGrid() {
  for (let t of staticTiles) t.draw();
}

// -------------------------------------------------------------
// ANIMATION LOOP
// -------------------------------------------------------------
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStaticGrid();

  const now = performance.now();
  if (now - lastSpawn > SPAWN_INTERVAL) {
    spawnMovingTile();
    lastSpawn = now;
  }

  updateMovingTiles();
  drawMovingTiles();

  requestAnimationFrame(animate);
}

// -------------------------------------------------------------
// INITIALIZATION
// -------------------------------------------------------------
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  generateStaticGrid();
}

resizeCanvas();
animate();

window.addEventListener("resize", () => {
  clearTimeout(window.__resizeTimer);
  window.__resizeTimer = setTimeout(() => {
    resizeCanvas();
  }, 200);
});
