"use client";

import { useEffect, useRef, useState } from "react";

export type SkillLogo = {
  id: string;
  name: string;
};

type SkillMarqueeProps = {
  rows: readonly (readonly SkillLogo[])[];
  assetPrefix?: string;
  duration?: number;
  durationOnHover?: number;
};

export function SkillMarquee({
  rows,
  assetPrefix = "",
  duration = 30,
  durationOnHover = 60,
}: SkillMarqueeProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const skills = rows.flat();
  const [activeName, setActiveName] = useState(skills[0]?.name ?? "");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reducedMotion || skills.length === 0) return;

    const items = [...stage.querySelectorAll<HTMLElement>("[data-skill-name]")];
    if (items.length === 0) return;

    const hoverRate = durationOnHover > 0 ? duration / durationOnHover : 1;
    let frame = 0;
    let elapsed = 0;
    let last = performance.now();
    let rate = 1;
    let paused = false;
    let lastName = "";
    let pointerPosition: { x: number; y: number } | null = null;
    let size = items[0].offsetWidth || 56;
    let width = stage.clientWidth || 1;

    const measure = () => {
      size = items[0].offsetWidth || 56;
      width = stage.clientWidth || 1;
      stage.style.height = `${size * 2 + 20}px`;
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);

    const place = (now: number) => {
      const delta = now - last;
      last = now;
      if (!paused) elapsed += delta * rate;

      const pitch = size + 40;
      const path = width + size;
      const visual = path * 2;
      const loop = pitch * items.length;
      const speed = path / (duration * 1000);
      const shift = elapsed * speed;
      const center = width / 2;
      let nearestName = "";
      let nearestDist = Number.POSITIVE_INFINITY;

      items.forEach((item, index) => {
        const distance = (((index * pitch + shift) % loop) + loop) % loop;
        if (distance >= visual) {
          item.style.opacity = "0";
          item.style.visibility = "hidden";
          return;
        }

        const onTop = distance < path;
        const x = onTop ? width - distance : distance - path - size;
        const y = onTop ? 0 : size + 20;
        const shown = Math.min(x + size, width) - Math.max(x, 0);
        const opacity = Math.max(0, Math.min(1, shown / size));

        item.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        item.style.opacity = String(opacity);
        item.style.visibility = opacity > 0.02 ? "visible" : "hidden";

        if (onTop && opacity > 0.5) {
          const mid = x + size / 2;
          const dist = Math.abs(mid - center);
          if (dist < nearestDist) {
            nearestDist = dist;
            nearestName = item.dataset.skillName || "";
          }
        }
      });

      const hovered = pointerPosition
        ? document
            .elementFromPoint(pointerPosition.x, pointerPosition.y)
            ?.closest<HTMLElement>("[data-skill-name]")
        : null;
      const nextName =
        hovered && stage.contains(hovered)
          ? hovered.dataset.skillName || nearestName
          : nearestName;
      if (nextName && nextName !== lastName) {
        lastName = nextName;
        setActiveName(nextName);
      }

      frame = window.requestAnimationFrame(place);
    };

    const onEnter = (event: MouseEvent) => {
      rate = hoverRate;
      pointerPosition = { x: event.clientX, y: event.clientY };
    };
    const onMove = (event: MouseEvent) => {
      pointerPosition = { x: event.clientX, y: event.clientY };
    };
    const onLeave = () => {
      rate = 1;
      pointerPosition = null;
    };
    const onFocus = () => {
      paused = true;
    };
    const onBlur = (event: FocusEvent) => {
      if (!stage.contains(event.relatedTarget as Node | null)) {
        paused = false;
      }
    };

    stage.addEventListener("mouseenter", onEnter);
    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseleave", onLeave);
    stage.addEventListener("focusin", onFocus);
    stage.addEventListener("focusout", onBlur);
    frame = window.requestAnimationFrame(place);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      stage.removeEventListener("mouseenter", onEnter);
      stage.removeEventListener("mouseleave", onLeave);
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("focusin", onFocus);
      stage.removeEventListener("focusout", onBlur);
    };
  }, [duration, durationOnHover, reducedMotion, skills.length]);

  return (
    <div className="mx-auto mt-2 grid w-full min-w-0 max-w-2xl gap-5">
      <p className="m-0 text-center text-sm text-muted" aria-live="polite" aria-atomic="true">
        I work with <span className="font-semibold text-ink">{activeName}</span>
      </p>
      {reducedMotion ? (
        <div className="flex flex-wrap justify-center gap-2" role="list" aria-label="Skills">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gray-300 nav:size-16"
              role="listitem"
              onMouseEnter={() => setActiveName(skill.name)}
            >
              <img
                src={`${assetPrefix}/skills/${skill.id}.svg`}
                alt=""
                width={40}
                height={40}
                className="size-10 object-contain"
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={stageRef}
          className="relative w-full min-w-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] print:h-auto print:overflow-visible print:[mask-image:none]"
          role="group"
          aria-label="Skills; focus to pause"
          tabIndex={0}
          data-skill-circuit
        >
          <div className="print:flex print:flex-wrap print:justify-center print:gap-2" role="list">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="absolute top-0 left-0 flex size-14 items-center justify-center rounded-full bg-gray-300 will-change-transform nav:size-16"
                role="listitem"
                data-skill-name={skill.name}
                onMouseEnter={() => setActiveName(skill.name)}
              >
                <img
                  src={`${assetPrefix}/skills/${skill.id}.svg`}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
