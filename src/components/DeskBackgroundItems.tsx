import { useEffect, useState } from "react";
import type { DrawingTool } from "./DeskControls";

// Toggle accessory items on the desk
const SHOW_CLOCK = false;
const SHOW_CALENDAR = false;

// Drop your photo into the `public` folder as `polaroid.jpg` (e.g. public/polaroid.jpg)
const PHOTO_SRC = `${import.meta.env.BASE_URL}polaroid.jpg`;

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function DeskBackgroundItems({
  tool,
  onToolChange,
}: {
  tool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
}) {
  const [now, setNow] = useState(() => new Date());
  const [photoLoaded, setPhotoLoaded] = useState(true);

  useEffect(() => {
    if (!SHOW_CLOCK && !SHOW_CALENDAR) return;
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="desk-accessories">
      {SHOW_CLOCK && (
        <div className="desk-clock">
          <span>{formatTime(now)}</span>
          <small>local time</small>
        </div>
      )}

      {SHOW_CALENDAR && (
        <div className="mini-calendar">
          <strong>{now.toLocaleDateString([], { month: "short" })}</strong>
          <span>{now.getDate()}</span>
          <small>{now.toLocaleDateString([], { weekday: "short" })}</small>
        </div>
      )}

      <div className="todo-note">
        <span className="washi-tape washi-tape-note" aria-hidden="true" />
        <h3>My to do list...</h3>
        <p><i /> Beyond the Stats App</p>
        <p><i /> Get an A+</p>
        <p><i /> Find my next project...</p>
      </div>

      <div className="polaroid">
        <span className="washi-tape washi-tape-polaroid" aria-hidden="true" />
        {photoLoaded ? (
          <img
            src={PHOTO_SRC}
            alt="Dylan Wang polaroid"
            className="polaroid-photo"
            onError={() => setPhotoLoaded(false)}
          />
        ) : (
          <div className="photo-placeholder">
            <span>My photo </span>
            <small>is gone....</small>
          </div>
        )}
        <p>Boiler Up!</p>
      </div>

      <button
        className={tool === "erase" ? "desk-pencil-swap" : "pink-eraser"}
        type="button"
        onClick={() => onToolChange(tool === "erase" ? "draw" : "erase")}
        aria-label={tool === "erase" ? "Switch back to pencil" : "Use eraser"}
      >
        <span>{tool === "erase" ? "draw" : "erase"}</span>
      </button>
    </div>
  );
}
