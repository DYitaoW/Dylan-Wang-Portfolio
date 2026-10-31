import { useEffect, useRef } from "react";
import type { DrawingTool } from "./DeskControls";

function getSheetsClipPath(scaleX: number, scaleY: number, canvasBounds: DOMRect): Path2D {
  const clipPath = new Path2D();
  const sheets = document.querySelectorAll<HTMLElement>(".sheet");

  sheets.forEach((sheet) => {
    const rect = sheet.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const w = sheet.offsetWidth;
    const h = sheet.offsetHeight;

    const style = window.getComputedStyle(sheet);
    let a = 1, b = 0, c = 0, d = 1;
    if (style.transform && style.transform !== "none") {
      const match = style.transform.match(/matrix\(([^)]+)\)/);
      if (match) {
        const parts = match[1].split(",").map(Number);
        a = parts[0];
        b = parts[1];
        c = parts[2];
        d = parts[3];
        const len1 = Math.hypot(a, b);
        const len2 = Math.hypot(c, d);
        if (len1 > 0) {
          a /= len1;
          b /= len1;
        }
        if (len2 > 0) {
          c /= len2;
          d /= len2;
        }
      }
    }

    const hw = w / 2;
    const hh = h / 2;
    const corners = [
      [-hw, -hh],
      [hw, -hh],
      [hw, hh],
      [-hw, hh],
    ];

    corners.forEach(([dx, dy], i) => {
      const screenX = cx + dx * a + dy * c;
      const screenY = cy + dx * b + dy * d;
      const canvasX = (screenX - canvasBounds.left) * scaleX;
      const canvasY = (screenY - canvasBounds.top) * scaleY;
      if (i === 0) clipPath.moveTo(canvasX, canvasY);
      else clipPath.lineTo(canvasX, canvasY);
    });
    clipPath.closePath();
  });

  return clipPath;
}

export default function ScribbleCanvas({
  clearSignal,
  tool,
}: {
  clearSignal: number;
  tool: DrawingTool;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const hasMoved = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });
  const lastCanvasPoint = useRef({ x: 0, y: 0 });
  const currentClipPath = useRef<Path2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const ratio = window.devicePixelRatio || 1;

      const previous = document.createElement("canvas");
      previous.width = canvas.width;
      previous.height = canvas.height;
      previous.getContext("2d")?.drawImage(canvas, 0, 0);

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);

      const context = canvas.getContext("2d");
      if (context && previous.width > 0 && previous.height > 0) {
        context.drawImage(
          previous,
          0,
          0,
          previous.width,
          previous.height,
          0,
          0,
          canvas.width,
          canvas.height,
        );
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  }, [clearSignal]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getCanvasPoint = (clientX: number, clientY: number) => {
      const bounds = canvas.getBoundingClientRect();
      const scaleX = canvas.width / bounds.width;
      const scaleY = canvas.height / bounds.height;
      return {
        x: (clientX - bounds.left) * scaleX,
        y: (clientY - bounds.top) * scaleY,
        scale: scaleX,
        bounds,
      };
    };

    const setupContext = (context: CanvasRenderingContext2D, scale: number) => {
      context.globalCompositeOperation =
        tool === "erase" ? "destination-out" : "source-over";
      context.strokeStyle =
        tool === "erase" ? "rgba(0, 0, 0, 1)" : "rgba(35, 40, 44, 0.9)";
      context.lineWidth = (tool === "erase" ? 36 : 3.0) * scale;
      context.lineCap = "round";
      context.lineJoin = "round";
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest(".clear-note, .pink-eraser, .desk-pencil-swap")) return;

      // Limit drawing strictly to the 2 paper sheets
      const sheet = target?.closest(".sheet");
      if (!sheet) return;

      const pt = getCanvasPoint(event.clientX, event.clientY);
      currentClipPath.current = getSheetsClipPath(pt.scale, canvas.height / pt.bounds.height, pt.bounds);

      isDrawing.current = true;
      hasMoved.current = false;
      startPoint.current = { x: event.clientX, y: event.clientY };
      lastCanvasPoint.current = { x: pt.x, y: pt.y };
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isDrawing.current) return;
      const context = canvas.getContext("2d");
      if (!context) return;

      if (!hasMoved.current) {
        const distance = Math.hypot(
          event.clientX - startPoint.current.x,
          event.clientY - startPoint.current.y,
        );
        if (distance < 1.5) return;
        hasMoved.current = true;
      }

      const point = getCanvasPoint(event.clientX, event.clientY);

      context.save();
      if (currentClipPath.current) {
        context.clip(currentClipPath.current);
      }
      setupContext(context, point.scale);

      context.beginPath();
      context.moveTo(lastCanvasPoint.current.x, lastCanvasPoint.current.y);
      context.lineTo(point.x, point.y);
      context.stroke();
      context.restore();

      lastCanvasPoint.current = { x: point.x, y: point.y };
    };

    const onPointerUp = (event: PointerEvent) => {
      if (isDrawing.current && !hasMoved.current) {
        const target = event.target as HTMLElement | null;
        if (!target?.closest("a, button, input, textarea, .clear-note, .pink-eraser, .desk-pencil-swap")) {
          const context = canvas.getContext("2d");
          if (context && currentClipPath.current) {
            const point = getCanvasPoint(startPoint.current.x, startPoint.current.y);
            context.save();
            context.clip(currentClipPath.current);
            context.globalCompositeOperation =
              tool === "erase" ? "destination-out" : "source-over";
            context.beginPath();
            context.arc(
              point.x,
              point.y,
              (tool === "erase" ? 18 : 1.5) * point.scale,
              0,
              Math.PI * 2,
            );
            context.fillStyle =
              tool === "erase" ? "rgba(0, 0, 0, 1)" : "rgba(35, 40, 44, 0.9)";
            context.fill();
            context.restore();
          }
        }
      }
      isDrawing.current = false;
      currentClipPath.current = null;
    };

    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [tool]);

  return (
    <canvas
      ref={canvasRef}
      className="scribble-canvas-desk"
      aria-hidden="true"
    />
  );
}
