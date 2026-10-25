import { useEffect, useState } from "react";

export default function PaperDoodle({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [doodleSrc, setDoodleSrc] = useState<string>(src);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || 400;
        canvas.height = img.naturalHeight || 400;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Clear out the white background pixels so the notebook paper tone shows through seamlessly
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;

          if (lum >= 232) {
            data[i + 3] = 0;
          } else if (lum >= 180) {
            const alphaRatio = (232 - lum) / 52;
            data[i + 3] = Math.round(data[i + 3] * Math.min(1, Math.max(0, alphaRatio)));
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setDoodleSrc(canvas.toDataURL("image/png"));
      } catch {
        // Fallback to original image
      }
    };
  }, [src]);

  return (
    <img
      src={doodleSrc}
      alt={alt}
      className={`paper-doodle-img ${className}`}
      aria-hidden="true"
    />
  );
}

