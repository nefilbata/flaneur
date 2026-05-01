export async function generateSticker(imageSource: string | File): Promise<string> {
  const img = await loadImage(imageSource);

  const size = 280;
  const border = 6;
  const radius = 24;
  const total = size + border * 2;

  const canvas = document.createElement("canvas");
  canvas.width = total;
  canvas.height = total;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas is not available");
  }

  context.shadowColor = "rgba(0, 0, 0, 0.12)";
  context.shadowBlur = 12;
  context.shadowOffsetY = 4;
  roundRect(context, 0, 0, total, total, radius + border);
  context.fillStyle = "#fffaf3";
  context.fill();

  context.shadowColor = "transparent";
  context.save();
  roundRect(context, border, border, size, size, radius);
  context.clip();

  const scale = Math.max(size / img.width, size / img.height);
  const sourceWidth = size / scale;
  const sourceHeight = size / scale;
  const sourceX = (img.width - sourceWidth) / 2;
  const sourceY = (img.height - sourceHeight) / 2;
  context.drawImage(
    img,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    border,
    border,
    size,
    size
  );
  context.restore();

  return canvas.toDataURL("image/png");
}

function loadImage(source: string | File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (source instanceof File) {
        URL.revokeObjectURL(img.src);
      }
      resolve(img);
    };
    img.onerror = reject;
    img.src = source instanceof File ? URL.createObjectURL(source) : source;
  });
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}
