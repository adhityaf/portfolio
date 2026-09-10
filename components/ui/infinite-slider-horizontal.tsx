"use client";

import { cn } from "@/lib/utils";
import { Children, type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";

type InfiniteSliderProps = {
  children: ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
  ariaLabel?: string;
};

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = "horizontal",
  reverse = false,
  className,
  ariaLabel,
}: InfiniteSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLDivElement>(null);
  const [sequenceSize, setSequenceSize] = useState(0);
  const [containerSize, setContainerSize] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const copies =
    sequenceSize > 0
      ? Math.max(2, Math.ceil((containerSize || sequenceSize) / sequenceSize) + 1)
      : 2;
  const items = Children.toArray(children);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const sequence = sequenceRef.current;
    if (!container || !sequence) return;

    const read = () => {
      setSequenceSize(
        direction === "horizontal" ? sequence.offsetWidth : sequence.offsetHeight,
      );
      setContainerSize(
        direction === "horizontal" ? container.clientWidth : container.clientHeight,
      );
    };

    read();
    const observer = new ResizeObserver(read);
    observer.observe(container);
    observer.observe(sequence);
    return () => observer.disconnect();
  }, [direction, items.length, reducedMotion]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion || sequenceSize === 0) return;

    const track = container.querySelector<HTMLElement>("[data-infinite-slider-track]");
    if (!track) return;

    const hoverRate =
      durationOnHover && durationOnHover > 0 ? duration / durationOnHover : 1;

    const setRate = (hovering: boolean) => {
      track.getAnimations().forEach((animation) => {
        animation.playbackRate = hovering ? hoverRate : 1;
      });
    };

    const onEnter = () => setRate(true);
    const onLeave = () => setRate(false);
    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);
    return () => {
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, [duration, durationOnHover, reducedMotion, sequenceSize]);

  if (reducedMotion) {
    return (
      <div
        className={cn("flex flex-wrap justify-center gap-2", className)}
        role="list"
        aria-label={ariaLabel}
      >
        {children}
      </div>
    );
  }

  const distance = sequenceSize + gap;
  const style = {
    "--slider-duration": `${duration}s`,
    "--slider-distance": `${distance}px`,
    gap,
  } as CSSProperties;

  return (
    <div
      ref={containerRef}
      className={cn(
        "infinite-slider w-full min-w-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] print:overflow-visible print:[mask-image:none]",
        className,
      )}
      role="group"
      aria-label={ariaLabel}
      tabIndex={0}
      data-infinite-slider
      data-slider-direction={direction}
      data-slider-reverse={reverse ? "" : undefined}
      data-slider-ready={sequenceSize > 0 ? "" : undefined}
    >
      <div
        data-infinite-slider-track
        className={cn(
          "infinite-slider-track flex w-max print:w-auto print:flex-wrap",
          direction === "horizontal" ? "flex-row" : "flex-col",
        )}
        style={style}
      >
        {Array.from({ length: copies }, (_, copy) => (
          <div
            key={copy}
            ref={copy === 0 ? sequenceRef : undefined}
            data-infinite-slider-source={copy === 0 ? "" : undefined}
            data-infinite-slider-clone={copy > 0 ? "" : undefined}
            className={cn(
              "flex shrink-0",
              copy > 0 && "print:hidden",
              direction === "horizontal" ? "flex-row" : "flex-col",
              copy === 0 && "print:flex-wrap",
            )}
            style={{ gap }}
            role={copy === 0 ? "list" : undefined}
            aria-hidden={copy > 0 ? true : undefined}
            aria-label={copy === 0 ? ariaLabel : undefined}
          >
            {items}
          </div>
        ))}
      </div>
    </div>
  );
}
