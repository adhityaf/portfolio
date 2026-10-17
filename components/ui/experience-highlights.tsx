"use client";

import { useEffect, useRef, useState } from "react";

type ExperienceHighlightsProps = {
  items: readonly string[];
  ariaLabel?: string;
};

export function ExperienceHighlights({
  items,
  ariaLabel = "Role highlights",
}: ExperienceHighlightsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "in" | "out">("idle");
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const pendingRef = useRef<number | null>(null);
  const lockedRef = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let intersecting = false;
    const sync = () => setVisible(intersecting && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      sync();
    });
    observer.observe(container);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  useEffect(() => {
    setIndex(0);
    setPhase("idle");
    setDirection("up");
    setHovered(false);
    pendingRef.current = null;
    lockedRef.current = false;
  }, [items]);

  useEffect(() => {
    if (hovered || paused || !visible || reducedMotion || items.length < 2 || phase !== "idle") return;
    const hold = window.setTimeout(() => {
      setDirection("up");
      pendingRef.current = (index + 1) % items.length;
      setPhase("out");
    }, 7000);
    return () => window.clearTimeout(hold);
  }, [hovered, paused, visible, index, items.length, phase, reducedMotion]);

  useEffect(() => {
    if (phase === "out" && pendingRef.current !== null) {
      const swap = window.setTimeout(() => {
        setIndex(pendingRef.current ?? 0);
        pendingRef.current = null;
        setPhase("in");
      }, 400);
      return () => window.clearTimeout(swap);
    }
    if (phase === "in") {
      const settle = window.setTimeout(() => {
        setPhase("idle");
        lockedRef.current = false;
      }, 700);
      return () => window.clearTimeout(settle);
    }
  }, [phase]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !hovered || reducedMotion || items.length < 2) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (lockedRef.current || phase !== "idle" || Math.abs(event.deltaY) < 8) return;
      lockedRef.current = true;
      const next =
        event.deltaY > 0
          ? (index + 1) % items.length
          : (index - 1 + items.length) % items.length;
      setDirection(event.deltaY > 0 ? "up" : "down");
      pendingRef.current = next;
      setPhase("out");
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [hovered, index, items.length, phase, reducedMotion]);

  if (items.length === 0) return null;

  if (reducedMotion) {
    return (
      <ul className="mt-5 list-disc space-y-3 pl-5 text-copy marker:text-blue">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  const motionClass =
    phase === "out"
      ? direction === "up"
        ? "experience-highlight-out-up"
        : "experience-highlight-out-down"
      : phase === "in"
        ? direction === "up"
          ? "experience-highlight-in-up"
          : "experience-highlight-in-down"
        : "";

  return (
    <div
      ref={containerRef}
      className="relative mt-5 overflow-visible"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        lockedRef.current = false;
      }}
      aria-label={ariaLabel}
      aria-live="polite"
    >
      <p key={`${index}-${phase === "in" ? "in" : "stay"}`} className={`m-0 max-w-copy text-copy ${motionClass}`}>
        {items[index]}
      </p>
      <div className="mt-3 flex items-center gap-4 text-sm text-muted">
        <button type="button" className="min-h-11 hover:text-coral" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
          {paused ? "Resume highlights" : "Pause highlights"}
        </button>
        <button type="button" className="min-h-11 hover:text-coral" onClick={() => {
          setPaused(true);
          setIndex((value) => (value + 1) % items.length);
          setPhase("idle");
        }}>Next highlight <span aria-hidden="true">{index + 1}/{items.length}</span></button>
      </div>
    </div>
  );
}
