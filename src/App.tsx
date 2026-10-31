import { useEffect, useRef, useState } from "react";
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import ChatPhone from "./components/ChatPhone";
import DeskBackgroundItems from "./components/DeskBackgroundItems";
import { ClearDrawingsNote, PencilCursor } from "./components/DeskControls";
import type { CursorState, DrawingTool } from "./components/DeskControls";
import PortfolioPapers from "./components/PortfolioPapers";
import ScribbleCanvas from "./components/ScribbleCanvas";
import deskBackground from "./assets/desk-background.png";

const SHOW_PHONE = false;
export type LinkAnimationType = "horizontal" | "scribble" | "circle" | "random";

const ALL_ANIMATIONS: Array<"horizontal" | "scribble" | "circle"> = [
  "horizontal",
  "scribble",
  "circle",
];

const PROJECT_ANIMATIONS: Array<"circle"> = [
  "circle",
];

function getRandomAnimation(isProject: boolean): "horizontal" | "scribble" | "circle" {
  const choices = isProject ? PROJECT_ANIMATIONS : ALL_ANIMATIONS;
  return choices[Math.floor(Math.random() * choices.length)];
}

const LINK_ANIMATION: {
  default: LinkAnimationType;
} = {
  default: "random",
};

export default function App() {
  const cursorElement = useRef<HTMLDivElement>(null);
  const cursorPosition = useRef({ x: -100, y: -100 });
  const pointerDownPos = useRef({ x: 0, y: 0 });
  const [cursor, setCursor] = useState<CursorState>({
    x: -100, y: -100, striking: false, circling: false, distance: 0, angle: -18,
  });
  const [isLeaving, setIsLeaving] = useState(false);
  const [drawingTool, setDrawingTool] = useState<DrawingTool>("draw");
  const [isClearing, setIsClearing] = useState(false);
  const [clearSignal, setClearSignal] = useState(0);
  const [circleProgress, setCircleProgress] = useState(0);
  const [circleStart, setCircleStart] = useState(0);
  const [circleShape, setCircleShape] = useState({
    radiusX: 57,
    radiusY: 39,
    overshoot: 1,
    wobble: 0,
    phase: 0,
  });

  const circleTravel = circleProgress * Math.PI * 2 * circleShape.overshoot;
  const circleSegments = Math.max(1, Math.ceil(circleProgress * 56 * circleShape.overshoot));
  const circlePath =
    !isClearing || circleProgress === 0
      ? ""
      : Array.from({ length: circleSegments + 1 }, (_, index) => {
          const angle = circleStart - circleTravel * (index / circleSegments);
          const wobble =
            1 + circleShape.wobble * Math.sin(angle * 3 + circleShape.phase);
          const x = 66 + circleShape.radiusX * wobble * Math.cos(angle);
          const y = 59 + circleShape.radiusY * wobble * Math.sin(angle);
          return `${index === 0 ? "M" : "L"} ${x} ${y}`;
        }).join(" ");

  useEffect(() => {
    const resetCursorState = () => {
      setIsLeaving(false);
      setCursor((current) => ({
        ...current,
        striking: false,
        circling: false,
        angle: -18,
      }));
      if (cursorElement.current) {
        cursorElement.current.getAnimations().forEach((anim) => anim.cancel());
        cursorElement.current.style.transform = "";
        cursorElement.current.style.left = `${cursorPosition.current.x}px`;
        cursorElement.current.style.top = `${cursorPosition.current.y}px`;
      }
    };

    window.addEventListener("focus", resetCursorState);
    const handleVisibility = () => {
      if (!document.hidden) resetCursorState();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("focus", resetCursorState);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => {
    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };
    const preventDrag = (e: DragEvent) => {
      e.preventDefault();
    };

    document.addEventListener("copy", preventCopy);
    document.addEventListener("cut", preventCopy);
    document.addEventListener("paste", preventCopy);
    document.addEventListener("dragstart", preventDrag);

    return () => {
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("cut", preventCopy);
      document.removeEventListener("paste", preventCopy);
      document.removeEventListener("dragstart", preventDrag);
    };
  }, []);

  useEffect(() => {
    const onNativePointerMove = (event: PointerEvent) => {
      cursorPosition.current = { x: event.clientX, y: event.clientY };
      if (cursor.striking || cursor.circling) return;
      if (cursorElement.current) {
        cursorElement.current.style.transform = "";
        cursorElement.current.style.left = `${event.clientX}px`;
        cursorElement.current.style.top = `${event.clientY}px`;
      }
    };

    window.addEventListener("pointermove", onNativePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onNativePointerMove);
    };
  }, [cursor.striking, cursor.circling]);

  function movePencil(event: ReactPointerEvent<HTMLElement>) {
    cursorPosition.current = { x: event.clientX, y: event.clientY };
    if (cursor.striking || cursor.circling) return;
    if (cursorElement.current) {
      cursorElement.current.style.transform = "";
      cursorElement.current.style.left = `${event.clientX}px`;
      cursorElement.current.style.top = `${event.clientY}px`;
    }
  }

  function changeDrawingTool(tool: DrawingTool) {
    if (cursorElement.current) {
      cursorElement.current.getAnimations().forEach((anim) => anim.cancel());
      cursorElement.current.style.transform = "";
    }
    setCursor((current) => ({
      ...current,
      striking: false,
      circling: false,
      x: cursorPosition.current.x,
      y: cursorPosition.current.y,
    }));
    setDrawingTool(tool);
  }

  function followLink(event: ReactMouseEvent<HTMLElement>) {
    if (isLeaving || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
    if (Math.hypot(event.clientX - pointerDownPos.current.x, event.clientY - pointerDownPos.current.y) > 6) {
      return;
    }
    const anchor = (event.target as Element).closest("a") as HTMLAnchorElement | null;
    if (!anchor) return;
    if (drawingTool === "erase") return;

    event.preventDefault();
    const bounds = anchor.getBoundingClientRect();
    const isProjectCard = Boolean(anchor.classList.contains("project"));
    const isProjectLink = Boolean(anchor.closest(".project-sheet"));
    const startOffset = isProjectCard ? 14 : 4;
    setIsLeaving(true);
    const distance = bounds.width + (isProjectCard ? 28 : 9);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const chosenAnim: LinkAnimationType =
      (anchor.dataset.animation as LinkAnimationType) || LINK_ANIMATION.default;

    const animType: "horizontal" | "scribble" | "circle" =
      anchor.dataset.animation && anchor.dataset.animation !== "random"
        ? (anchor.dataset.animation as "horizontal" | "scribble" | "circle")
        : isProjectLink
          ? "circle"
          : chosenAnim === "random"
            ? getRandomAnimation(false)
            : chosenAnim;

    const finishAnimationAndOpen = (svgElement: SVGElement) => {
      if (anchor.href.startsWith("mailto:")) {
        window.location.href = anchor.href;
      } else {
        window.open(anchor.href, "_blank", "noopener,noreferrer");
      }

      setIsLeaving(false);
      setCursor((current) => ({
        ...current,
        striking: false,
        circling: false,
        x: cursorPosition.current.x,
        y: cursorPosition.current.y,
        angle: -18,
      }));

      if (cursorElement.current) {
        cursorElement.current.getAnimations().forEach((anim) => anim.cancel());
        cursorElement.current.style.transform = "";
        cursorElement.current.style.left = `${cursorPosition.current.x}px`;
        cursorElement.current.style.top = `${cursorPosition.current.y}px`;
      }

      window.setTimeout(() => {
        svgElement.style.transition = "opacity 400ms ease";
        svgElement.style.opacity = "0";
        window.setTimeout(() => svgElement.remove(), 400);
      }, 1200);
    };

    if (animType === "circle") {
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      const shape = {
        radiusX: 44 + Math.random() * 8,
        radiusY: 35 + Math.random() * 14,
        overshoot: 1.025 + Math.random() * 0.195,
        wobble: 0.01 + Math.random() * 0.05,
        phase: Math.random() * Math.PI * 2,
      };
      const paddingX = isProjectLink ? 28 : 20;
      const paddingY = isProjectLink ? 24 : 16;
      const radiusX = (bounds.width + paddingX) * (shape.radiusX / 100);
      const radiusY = (bounds.height + paddingY) * (shape.radiusY / 100);
      const startAngle = Math.atan2(
        (cursorPosition.current.y - centerY) / radiusY,
        (cursorPosition.current.x - centerX) / radiusX,
      );
      const startWobble =
        1 + shape.wobble * Math.sin(startAngle * 3 + shape.phase);
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      svg.classList.add("project-link-circle");
      svg.setAttribute("viewBox", "0 0 100 100");
      svg.setAttribute("preserveAspectRatio", "none");
      svg.appendChild(path);
      anchor.appendChild(svg);
      setCursor({
        x: centerX + radiusX * startWobble * Math.cos(startAngle),
        y: centerY + radiusY * startWobble * Math.sin(startAngle),
        striking: false,
        circling: true,
        distance: 0,
        angle: -18,
      });

      const drawCircle = (progress: number) => {
        const segments = Math.max(1, Math.ceil(progress * 90 * shape.overshoot));
        const travel = progress * Math.PI * 2 * shape.overshoot;
        path.setAttribute(
          "d",
          Array.from({ length: segments + 1 }, (_, index) => {
            const angle = startAngle - travel * (index / segments);
            const wobble =
              1 + shape.wobble * Math.sin(angle * 3 + shape.phase);
            const x = 50 + shape.radiusX * wobble * Math.cos(angle);
            const y = 50 + shape.radiusY * wobble * Math.sin(angle);
            return `${index === 0 ? "M" : "L"} ${x} ${y}`;
          }).join(" "),
        );
        const angle = startAngle - travel;
        const wobble = 1 + shape.wobble * Math.sin(angle * 3 + shape.phase);
        if (cursorElement.current) {
          cursorElement.current.style.left = `${
            centerX + radiusX * wobble * Math.cos(angle)
          }px`;
          cursorElement.current.style.top = `${
            centerY + radiusY * wobble * Math.sin(angle)
          }px`;
        }
      };

      if (reducedMotion) {
        drawCircle(1);
        finishAnimationAndOpen(svg);
        return;
      }

      const startedAt = performance.now();
      const animateCircle = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / 280);
        drawCircle(progress);
        if (progress < 1) requestAnimationFrame(animateCircle);
        else window.setTimeout(() => finishAnimationAndOpen(svg), 100);
      };
      requestAnimationFrame(animateCircle);
      return;
    }

    if (animType === "horizontal") {
      setCursor({
        x: bounds.left - startOffset,
        y: bounds.top + bounds.height * 0.52,
        striking: true,
        circling: false,
        distance,
        angle: -16,
      });

      const motionCount = 28;
      const strikeHeight = 16;
      const arch = (Math.random() - 0.5) * 3;
      const points: Array<{ progress: number; y: number; angle: number }> = [];

      for (let i = 0; i <= motionCount; i += 1) {
        const progress = i / motionCount;
        const handWaver =
          Math.sin(progress * Math.PI) * arch +
          Math.sin(progress * 13) * 0.65 +
          (Math.random() - 0.5) * 1.4;
        const pencilAngle = -15 + Math.sin(progress * Math.PI * 2) * 2 + (Math.random() - 0.5) * 1.2;
        points.push({
          progress,
          y: handWaver,
          angle: pencilAngle,
        });
      }

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      svg.classList.add("horizontal-crossout");
      if (isProjectCard) svg.classList.add("project-horizontal-crossout");
      svg.setAttribute("viewBox", `0 0 100 ${strikeHeight}`);
      svg.setAttribute("preserveAspectRatio", "none");
      if (!reducedMotion) {
        svg.style.clipPath = "inset(0 100% 0 0)";
      }
      line.setAttribute(
        "points",
        points
          .map((p) => `${p.progress * 100},${strikeHeight / 2 + p.y}`)
          .join(" "),
      );
      svg.appendChild(line);
      anchor.appendChild(svg);

      const duration = isProjectLink ? 240 : 190;

      if (reducedMotion) {
        svg.style.clipPath = "inset(0 0% 0 0)";
        finishAnimationAndOpen(svg);
        return;
      }

      svg.style.clipPath = "inset(0 100% 0 0)";
      const startX = bounds.left - startOffset;
      const startY = bounds.top + bounds.height * 0.52;
      const startedAt = performance.now();

      const animateHorizontal = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        svg.style.clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`;

        const pointIdx = Math.min(motionCount, Math.floor(progress * motionCount));
        const currentP = points[pointIdx] || points[points.length - 1];

        if (cursorElement.current) {
          cursorElement.current.style.left = `${startX + distance * progress}px`;
          cursorElement.current.style.top = `${startY + currentP.y}px`;
          cursorElement.current.style.transform = `rotate(${currentP.angle}deg)`;
        }

        if (progress < 1) {
          requestAnimationFrame(animateHorizontal);
        } else {
          svg.style.clipPath = "inset(0 0% 0 0)";
          window.setTimeout(() => finishAnimationAndOpen(svg), 30);
        }
      };
      requestAnimationFrame(animateHorizontal);
      return;
    }

    setCursor({
      x: bounds.left - startOffset,
      y: bounds.top + bounds.height * 0.52,
      striking: true,
      circling: false,
      distance,
      angle: -18,
    });

    const motionCount = isProjectLink
      ? 70 + Math.floor(Math.random() * 41)
      : 16 + Math.floor(Math.random() * 15);
    const scribbleHeight = isProjectLink ? 88 : 32;
    const minimumAmplitude = isProjectLink ? 8 : 2;
    const maxAmplitude = isProjectLink ? 26 : 12;
    const points = [{ progress: 0, y: 0 }];
    let direction = Math.random() > 0.5 ? 1 : -1;
    for (let index = 1; index < motionCount; index += 1) {
      if (Math.random() > 0.22) direction *= -1;
      points.push({
        progress: (index + (Math.random() - 0.5) * 0.48) / motionCount,
        y: direction * (minimumAmplitude + Math.random() * maxAmplitude),
      });
    }
    points.push({ progress: 1, y: (Math.random() - 0.5) * 3 });

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    svg.classList.add("random-crossout");
    if (isProjectLink) svg.classList.add("project-crossout");
    svg.setAttribute("viewBox", `0 0 100 ${scribbleHeight}`);
    svg.setAttribute("preserveAspectRatio", "none");
    line.setAttribute(
      "points",
      points
        .map((point) => `${point.progress * 100},${scribbleHeight / 2 + point.y}`)
        .join(" "),
    );
    svg.appendChild(line);
    anchor.appendChild(svg);

    const scribbleDuration = 420;

    if (reducedMotion) {
      svg.style.clipPath = "inset(0 0% 0 0)";
      finishAnimationAndOpen(svg);
      return;
    }

    svg.style.clipPath = "inset(0 100% 0 0)";
    const startX = bounds.left - startOffset;
    const startY = bounds.top + bounds.height * 0.52;
    const startedAt = performance.now();

    const animateScribble = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / scribbleDuration);
      svg.style.clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`;

      const pointIdx = Math.min(points.length - 1, Math.floor(progress * points.length));
      const currentP = points[pointIdx] || points[points.length - 1];

      if (cursorElement.current) {
        cursorElement.current.style.left = `${startX + distance * progress}px`;
        cursorElement.current.style.top = `${startY + currentP.y}px`;
        cursorElement.current.style.transform = `rotate(${-14 + (currentP.y > 0 ? 3 : -3)}deg)`;
      }

      if (progress < 1) {
        requestAnimationFrame(animateScribble);
      } else {
        svg.style.clipPath = "inset(0 0% 0 0)";
        window.setTimeout(() => finishAnimationAndOpen(svg), 30);
      }
    };
    requestAnimationFrame(animateScribble);
  }

  function clearDrawings(event: ReactMouseEvent<HTMLButtonElement>) {
    if (isClearing) return;
    if (drawingTool === "erase") {
      setClearSignal((current) => current + 1);
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    const shape = {
      radiusX: 44 + Math.random() * 22,
      radiusY: 28 + Math.random() * 26,
      overshoot: 1.025 + Math.random() * 0.195,
      wobble: 0.01 + Math.random() * 0.05,
      phase: Math.random() * Math.PI * 2,
    };
    const radiusX = bounds.width * (shape.radiusX / 132);
    const radiusY = bounds.height * (shape.radiusY / 118);
    const startAngle = Math.atan2(
      (cursorPosition.current.y - centerY) / radiusY,
      (cursorPosition.current.x - centerX) / radiusX,
    );
    const startWobble = 1 + shape.wobble * Math.sin(startAngle * 3 + shape.phase);
    const finish = () => {
      setClearSignal((current) => current + 1);
      setCircleProgress(0);
      setIsClearing(false);
      setCursor((current) => ({ ...current, circling: false }));
    };

    setIsClearing(true);
    setCircleProgress(0);
    setCircleStart(startAngle);
    setCircleShape(shape);
    setCursor({
      x: centerX + radiusX * startWobble * Math.cos(startAngle),
      y: centerY + radiusY * startWobble * Math.sin(startAngle),
      striking: false,
      circling: true,
      distance: 0,
      angle: -18,
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    const startedAt = performance.now();
    const animateCircle = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / 210);
      const angle = startAngle - progress * Math.PI * 2 * shape.overshoot;
      const wobble = 1 + shape.wobble * Math.sin(angle * 3 + shape.phase);
      setCircleProgress(progress);
      setCursor({
        x: centerX + radiusX * wobble * Math.cos(angle),
        y: centerY + radiusY * wobble * Math.sin(angle),
        striking: false,
        circling: true,
        distance: 0,
        angle: -18,
      });
      if (progress < 1) requestAnimationFrame(animateCircle);
      else window.setTimeout(finish, 25);
    };
    requestAnimationFrame(animateCircle);
  }

  return (
    <main
      className="desk phone-disabled"
      style={{
        backgroundImage: `url(${deskBackground})`,
      }}
      onPointerDown={(e) => {
        pointerDownPos.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerMove={movePencil}
      onClickCapture={followLink}
      onContextMenu={(e) => e.preventDefault()}
    >
      <PencilCursor ref={cursorElement} cursor={cursor} tool={drawingTool} />
      <DeskBackgroundItems tool={drawingTool} onToolChange={changeDrawingTool} />
      <PortfolioPapers clearSignal={clearSignal} tool={drawingTool} />
      {SHOW_PHONE && <ChatPhone />}
      <ClearDrawingsNote isClearing={isClearing} circlePath={circlePath} onClick={clearDrawings} />
      <ScribbleCanvas clearSignal={clearSignal} tool={drawingTool} />
    </main>
  );
}
