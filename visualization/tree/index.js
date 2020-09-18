import Vector2D from "./vector2d";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// 将坐标平移到左下角，并将 y 轴向上
ctx.translate(canvas.width / 2, canvas.height);
ctx.scale(1, -1);
ctx.lineCap = "round";

function drawBranch(ctx, v0, length, thickness, dir, bias) {
  const v = new Vector2D(0, 1).rotate(dir).scale(length);
  const v1 = v0.copy().add(v);

  ctx.lineWidth = thickness;
  ctx.beginPath();
  ctx.moveTo(v0.x, v0.y);
  ctx.lineTo(v1.x, v1.y);
  ctx.stroke();

  if (thickness > 2) {
    const left = Math.PI / 9 + 0.5 * (dir + 0.2) + bias * (Math.random() - 0.5);
    drawBranch(ctx, v1, length * 0.9, thickness * 0.8, left, bias * 0.9);
    const right =
      Math.PI / 9 + 0.5 * (dir - 0.2) + bias * (Math.random() - 0.5);
    drawBranch(ctx, v1, length * 0.9, thickness * 0.8, right, bias * 0.9);
  }
}

const length = 50;
const thickness = 9;
const dir = 0;
const bias = 4;

const rootV = new Vector2D(0, 1).scale(length);

ctx.lineWidth = thickness;
ctx.beginPath();
ctx.moveTo(0, 0);
ctx.lineTo(rootV.x, rootV.y);
ctx.stroke();

drawBranch(ctx, rootV, length, thickness, dir, bias);
