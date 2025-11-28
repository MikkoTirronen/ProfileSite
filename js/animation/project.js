const canvas = document.createElement("canvas");
canvas.id = "project-bg";

const ctx = canvas.getContext("2d");

// Tile class
class Tile {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  display() {
    const colors = [
      "#a1d69b",
      "#c8eae4",
      "#eca3bf",
      "#e97181",
      "#5c76b9",
      "#f8d8a6",
      "#17b1c1",
      "#caa7c8",
      "#fab580",
    ];
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeRect(this.x, this.y, this.w, this.h);
  }
}

// Recursive divide function
function divide(x, y, w, h, count, direction) {
  if (w < 5 || h < 5) return;

  const split = Math.random() * 0.6 + 0.2;
  let tiles = [];

  if (direction === 0) {
    tiles.push(new Tile(x, y, w * split, h));
    tiles.push(new Tile(x + w * split, y, w - w * split, h));
    direction = 1;
  } else {
    tiles.push(new Tile(x, y, w, h * split));
    tiles.push(new Tile(x, y + h * split, w, h - h * split));
    direction = 0;
  }

  for (let t of tiles) {
    if (count < 5) {
      divide(t.x, t.y, t.w, t.h, count + 1, direction);
    } else {
      t.display();
    }
  }
}

// Draw tiles
function generateTiles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  divide(0, 0, canvas.width, canvas.height, 0, 0);
}

// Resize + draw immediately
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  generateTiles();
}

// Debounced resize
let resizeTimeout;
function resizeCanvasDebounced() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resizeCanvas, 200);
}

// --- INITIALIZATION ---
// ALWAYS size + draw immediately on load
resizeCanvas();

window.addEventListener("resize", resizeCanvasDebounced);
