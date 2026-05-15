// Compresión de imágenes en el navegador usando Canvas (sin dependencias).
// - Acepta archivos de hasta 10 MB
// - Reescala manteniendo aspect ratio (lado máx 1600 px) y comprime a JPEG
// - Itera bajando calidad hasta acercarse al peso objetivo (~800 KB)
export async function compressImage(
  file: File,
  opts: { maxBytes?: number; maxDimension?: number } = {},
): Promise<Blob> {
  const maxBytes = opts.maxBytes ?? 800 * 1024;
  const maxDimension = opts.maxDimension ?? 1600;

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("No se pudo cargar la imagen"));
    i.src = dataUrl;
  });

  let { width, height } = img;
  if (width > maxDimension || height > maxDimension) {
    const ratio = Math.min(maxDimension / width, maxDimension / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas no disponible");
  ctx.drawImage(img, 0, 0, width, height);

  const qualities = [0.85, 0.75, 0.65, 0.55, 0.45, 0.35];
  let best: Blob | null = null;
  for (const q of qualities) {
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", q),
    );
    if (!blob) continue;
    best = blob;
    if (blob.size <= maxBytes) return blob;
  }
  if (!best) throw new Error("Falló la compresión");
  return best;
}
