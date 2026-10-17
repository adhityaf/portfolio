"use client";

import { useEffect, useRef, useState } from "react";

export type SkillLogo = {
  id: string;
  name: string;
};

type SkillMarqueeProps = {
  rows: readonly (readonly SkillLogo[])[];
  assetPrefix?: string;
};

export function SkillMarquee({ rows, assetPrefix = "" }: SkillMarqueeProps) {
  const [activeName, setActiveName] = useState(rows[0]?.[0]?.name ?? "");
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(([entry]) => {
      stage.dataset.visible = String(entry.isIntersecting);
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={stageRef} className="skill-marquee mx-auto grid w-full min-w-0 max-w-2xl gap-5" tabIndex={0} role="group" aria-label="Skills; hover or focus to pause">
      <p className="m-0 text-center text-sm text-copy">
        I work with <span className="inline-block min-w-28 text-left font-semibold text-ink">{activeName}</span>
      </p>
      <div className="skill-window grid gap-5 overflow-hidden">
        {rows.map((row, index) => (
          <div key={index} className="skill-track flex w-max gap-6" style={{ animationDirection: index % 2 ? "reverse" : "normal" }}>
            {[false, true].map((clone) => (
              <div key={String(clone)} className="skill-row flex shrink-0 gap-6" role="list" aria-label={clone ? undefined : "Skills"} aria-hidden={clone || undefined}>
                {row.map((skill) => (
                  <div key={skill.id} className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gray-300 nav:size-16" role="listitem" aria-label={skill.name} onMouseEnter={() => setActiveName(skill.name)}>
                    <svg width={40} height={40} className="size-10" aria-hidden="true">
                      <use href={`${assetPrefix}/skills/sprite.svg#${skill.id}`} />
                    </svg>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
