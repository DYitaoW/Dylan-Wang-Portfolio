import { forwardRef } from "react";
import type { CSSProperties, MouseEventHandler } from "react";

export type CursorState = {
  x: number;
  y: number;
  striking: boolean;
  circling: boolean;
  distance: number;
  angle: number;
};

export type DrawingTool = "draw" | "erase";

export const PencilCursor = forwardRef<
  HTMLDivElement,
  { cursor: CursorState; tool: DrawingTool }
>(
  function PencilCursor({ cursor, tool }, ref) {
    return (
      <div
        ref={ref}
        className={`cursor-pencil ${tool === "erase" ? "cursor-eraser" : ""} ${
          cursor.circling ? "is-circling" : ""
        }`}
        style={{
          left: cursor.x,
          top: cursor.y,
          "--strike-distance": `${cursor.distance}px`,
          "--pencil-angle": `${cursor.angle}deg`,
        } as CSSProperties}
        aria-hidden="true"
      >
        <span>{tool === "erase" ? "erase" : ""}</span>
      </div>
    );
  },
);

export function ClearDrawingsNote({
  isClearing,
  circlePath,
  onClick,
}: {
  isClearing: boolean;
  circlePath: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button className={`clear-note ${isClearing ? "is-clearing" : ""}`} type="button" onClick={onClick}>
      clear
      <span>drawings?</span>
      <svg className="note-circle" viewBox="0 0 132 118" aria-hidden="true"><path d={circlePath} /></svg>
    </button>
  );
}
