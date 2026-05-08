function drawTiles() {
  const baseW = parseFloat(document.getElementById('baseWidth').value);
  const baseH = parseFloat(document.getElementById('baseHeight').value);
  const tileW = parseFloat(document.getElementById('tileWidth').value);
  const tileH = parseFloat(document.getElementById('tileHeight').value);

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  // Limpiar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Escala para que quepa en el canvas
  const scaleX = (canvas.width - 20) / baseW;
  const scaleY = (canvas.height - 20) / baseH;
  const scale = Math.min(scaleX, scaleY);

  const offsetX = 10;
  const offsetY = 10;

  // Dibujar base
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.strokeRect(offsetX, offsetY, baseW * scale, baseH * scale);

  // Calcular cuántas losetas caben (con decimales)
  const colsExact = baseW / tileW;
  const rowsExact = baseH / tileH;
  const totalExact = colsExact * rowsExact;

  const cols = Math.floor(colsExact);
  const rows = Math.floor(rowsExact);

  ctx.lineWidth = 1;

  // Dibujar losetas completas
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      drawTile(ctx, offsetX + c * tileW * scale, offsetY + r * tileH * scale, tileW * scale, tileH * scale);
    }
  }

  // Dibujar losetas sobrantes en columnas (fracción horizontal)
  const extraW = baseW - cols * tileW;
  if (extraW > 0) {
    for (let r = 0; r < rows; r++) {
      drawTile(ctx, offsetX + cols * tileW * scale, offsetY + r * tileH * scale, extraW * scale, tileH * scale, true);
    }
  }

  // Dibujar losetas sobrantes en filas (fracción vertical)
  const extraH = baseH - rows * tileH;
  if (extraH > 0) {
    for (let c = 0; c < cols; c++) {
      drawTile(ctx, offsetX + c * tileW * scale, offsetY + rows * tileH * scale, tileW * scale, extraH * scale, true);
    }
  }

  // Dibujar esquina sobrante (fracción horizontal + vertical)
  if (extraW > 0 && extraH > 0) {
    drawTile(ctx, offsetX + cols * tileW * scale, offsetY + rows * tileH * scale, extraW * scale, extraH * scale, true);
  }

  // Mostrar resultado en texto (con decimales)
  document.getElementById("resultado").textContent =
    `Losetas completas: ${cols * rows} | Total exacto (incluyendo fracción): ${totalExact.toFixed(2)}`;
}

// Función para dibujar una loseta con olas
function drawTile(ctx, x, y, w, h, isFraction = false) {
  ctx.strokeStyle = isFraction ? "gray" : "red";
  ctx.strokeRect(x, y, w, h);

  // Dibujar olas dentro
  ctx.beginPath();
  ctx.strokeStyle = "black";
  for (let i = 0; i <= w; i += 5) {
    const waveY = y + h/2 + Math.sin(i/15) * (h/4);
    ctx.lineTo(x + i, waveY);
  }
  ctx.stroke();
}
