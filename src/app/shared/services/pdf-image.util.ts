// jsPDF's addImage() only accepts raster formats (PNG/JPEG/WEBP), it cannot draw an
// SVG data URI directly. This app's mock documents/signatures are seeded as SVG data
// URIs, so every image is normalized to a PNG data URL via an off-screen canvas before
// it reaches jsPDF, regardless of its original format.

export interface LoadedPdfImage {
  dataUrl: string;
  width: number;
  height: number;
}

export function loadImageAsPngDataUrl(src: string): Promise<LoadedPdfImage | null> {
  return new Promise(resolve => {
    if (!src) {
      resolve(null);
      return;
    }

    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx || canvas.width === 0 || canvas.height === 0) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve({ dataUrl: canvas.toDataURL('image/png'), width: canvas.width, height: canvas.height });
      } catch (err) {
        console.warn('[pdf] failed to rasterize image for PDF embedding:', err);
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}
