let baseW = 0, baseH = 0, tileW = 0, tileH = 0;
let t = 0;
let particles = [];

function drawTiles() {
  showLoadingBar(() => {
    baseW = parseInt(document.getElementById("baseWidth").value);
    baseH = parseInt(document.getElementById("baseHeight").value);
    tileW = parseInt(document.getElementById("tileWidth").value);
    tileH = parseInt(document.getElementById("tileHeight").value);

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const maxSize = 600;
    let scale = Math.min(maxSize / baseW, maxSize / baseH);

    canvas.width = baseW * scale;
    canvas.height = baseH * scale;

    let cols = baseW / tileW;
    let rows = baseH / tileH;
    let total = cols * rows;

    document.getElementById("resultado").innerText =
      `Caben: ${total.toFixed(2)} losetas (${cols.toFixed(2)} × ${rows.toFixed(2)})`;

    canvas.dataset.scale = scale;

    createParticles(canvas.width, canvas.height);

    animate();
  });
}

function showLoadingBar(callback) {
  const resultado = document.getElementById("resultado");
  resultado.innerText = "Calculando...";
  let progress = 0;

  const interval = setInterval(() => {
    progress += 10;
    resultado.innerText = `Cargando: ${progress}%`;
    if (progress >= 100) {
      clearInterval(interval);
      callback();
    }
  }, 100);
}

function createParticles(width, height) {
  particles = [];
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5
    });
  }
}

function drawParticles(ctx) {
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > ctx.canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > ctx.canvas.height) p.dy *= -1;
  });
}

function drawWaves(ctx, offsetX, offsetY, w, h, scale) {
  ctx.save();
  ctx.translate(offsetX * scale, offsetY * scale);
  ctx.beginPath();
  ctx.strokeStyle = "#66ccff";
  for (let x = 0; x < w * scale; x++) {
    let y = (h * scale) / 2 + Math.sin((x + t) * 0.05) * 10;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
}

function animate() {
  const canvas = document.getElementById("canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const scale = parseFloat(canvas.dataset.scale || 1);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawParticles(ctx);

  for (let y = 0; y < baseH; y += tileH) {
    for (let x = 0; x < baseW; x += tileW) {
      let w = Math.min(tileW, baseW - x);
      let h = Math.min(tileH, baseH - y);

      ctx.strokeStyle = "red";
      ctx.strokeRect(x * scale, y * scale, w * scale, h * scale);

      ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
      if (w < tileW || h < tileH) {
        ctx.fillRect(x * scale, y * scale, w * scale, h * scale);
      }

      drawWaves(ctx, x, y, w, h, scale);
    }
  }

  t += 2;
  requestAnimationFrame(animate);
}
