import { useEffect, useState } from "react";

export default function ChelseaDoodle() {
  const [doodleSrc, setDoodleSrc] = useState<string>("/chelsea.jpeg");

  useEffect(() => {
    const img = new Image();
    img.src = "/chelsea.jpeg";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || 600;
        canvas.height = img.naturalHeight || 600;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Strip the white background so the exact paper tone (#fbf7e9) shows through
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
        // Fallback to original image if canvas processing is unavailable
      }
    };
  }, []);

  return (
    <div className="chelsea-doodle-wrapper" aria-hidden="true" title="Chelsea FC hand-drawn doodle">
      <img
        src={doodleSrc}
        alt="Chelsea Football Club hand-drawn crest doodle"
        className="chelsea-doodle-img"
      />
    </div>
  );
}

