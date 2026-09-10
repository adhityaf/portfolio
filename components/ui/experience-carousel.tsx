"use client";

import { ExperienceHighlights } from "@/components/ui/experience-highlights";
import { useEffect, useRef, useState } from "react";

export type ExperienceSlide = {
  id: string;
  mark: string;
  title: string;
  subtitle: string;
  period: string;
  highlights: readonly string[];
  image: string;
  imageAlt: string;
  accent: "coral" | "blue";
};

type ExperienceCarouselProps = {
  slides: readonly ExperienceSlide[];
};

function ArrowIcon({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      {dir === "prev" ? (
        <path d="M19 12H5M12 19l-7-7 7-7" />
      ) : (
        <path d="M5 12h14M12 5l7 7-7 7" />
      )}
    </svg>
  );
}

export function ExperienceCarousel({ slides }: ExperienceCarouselProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const animationFrame = useRef<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const print = window.matchMedia("print");
    const sync = () => {
      setReducedMotion(motion.matches);
      setIsPrinting(print.matches);
    };
    setIsHydrated(true);
    sync();
    motion.addEventListener("change", sync);
    print.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      print.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || slides.length < 2) return;

    const updatePage = () => {
      animationFrame.current = null;
      const section = sectionRef.current;
      if (!section) return;
      const bounds = section.getBoundingClientRect();
      const scrollRange = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-bounds.top / scrollRange, 0), 1);
      const nextIndex = Math.min(
        Math.round(progress * (slides.length - 1)),
        slides.length - 1,
      );
      setCurrentIndex((index) => (index === nextIndex ? index : nextIndex));
    };

    const requestUpdate = () => {
      if (animationFrame.current !== null) return;
      animationFrame.current = window.requestAnimationFrame(updatePage);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    updatePage();

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (animationFrame.current !== null) {
        window.cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [reducedMotion, slides.length]);

  const navigateTo = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const step =
      Math.max(section.offsetHeight - window.innerHeight, 0) /
      Math.max(slides.length - 1, 1);
    window.scrollTo({
      top: sectionTop + step * index,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  if (slides.length === 0) return null;

  const current = slides[currentIndex];
  const staticMode = !isHydrated || reducedMotion || isPrinting;

  if (staticMode) {
    return (
      <section
        id="experience"
        className="viewport-section scroll-section mx-auto flex h-svh w-[calc(100%-2rem)] max-w-frame flex-col justify-center-safe overflow-y-auto pt-28 pb-10 xs:w-[calc(100%-3rem)] nav:pt-24 nav:pb-12 print:h-auto print:w-full print:max-w-none print:overflow-visible print:py-8"
        aria-labelledby="experience-title"
      >
        <div data-scroll-heading>
          <p className="m-0 text-xs font-extrabold tracking-[0.17em] text-blue uppercase">Career</p>
          <h2 className="mt-2 text-[clamp(1.85rem,4vw,3rem)] leading-none font-bold tracking-[-0.055em]" id="experience-title">Experience</h2>
        </div>
        <div className="mt-8 grid gap-4">
          {slides.map((slide) => (
            <article key={slide.id} className="rounded-lg bg-surface p-6 nav:p-8 print:break-inside-avoid" data-scroll-card>
              <div className="flex flex-col gap-4 nav:flex-row nav:items-start nav:justify-between nav:gap-8">
                <div className="min-w-0">
                  <p className="mb-2 text-[0.68rem] font-extrabold tracking-[0.12em] text-coral" aria-hidden="true">{slide.mark}</p>
                  <h3 className="m-0 text-xl font-bold tracking-[-0.02em]">{slide.title}</h3>
                  <p className="mt-1 text-sm text-muted">{slide.subtitle}</p>
                </div>
                <p className="m-0 shrink-0 text-xs leading-6 text-muted uppercase">{slide.period}</p>
              </div>
              <ul className="mt-6 list-disc space-y-3 pl-5 text-copy marker:text-blue">
                {slide.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative bg-canvas"
      style={{ height: `${slides.length * 100}svh` }}
      aria-labelledby="experience-title"
      data-experience-carousel
    >
      <div aria-hidden="true">
        {slides.map((slide, index) => (
          <span
            key={slide.id}
            className="viewport-snap-point pointer-events-none absolute left-0 size-px"
            style={{ top: `${index * 100}svh` }}
          />
        ))}
      </div>

      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              current.accent === "blue"
                ? "radial-gradient(ellipse at 70% 50%, var(--wash-accent) 0%, transparent 70%)"
                : "radial-gradient(ellipse at 70% 50%, var(--wash-brand) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto flex h-full w-[calc(100%-2rem)] max-w-frame flex-col pt-28 pb-8 xs:w-[calc(100%-3rem)] nav:pt-24">
          <div>
            <p className="m-0 text-xs font-extrabold tracking-[0.17em] text-blue uppercase">Career</p>
            <h2 className="mt-2 text-[clamp(1.85rem,4vw,3rem)] leading-none font-bold tracking-[-0.055em]" id="experience-title">Experience</h2>
          </div>

          <div className="mt-8 grid min-h-0 flex-1 grid-cols-1 items-center gap-8 nav:grid-cols-2 nav:gap-12">
            <div className="min-w-0">
              <p className="m-0 flex items-center gap-3 text-[0.68rem] font-extrabold tracking-[0.12em] text-muted uppercase">
                <span className="inline-block h-px w-8 bg-current" aria-hidden="true" />
                {String(currentIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </p>
              <h3 className="mt-4 max-w-[16ch] text-[clamp(2rem,5vw,3.4rem)] leading-[0.95] font-bold tracking-[-0.06em]">
                {current.title}
              </h3>
              <p className={`mt-3 text-sm font-extrabold tracking-[0.08em] uppercase ${current.accent === "blue" ? "text-blue" : "text-coral"}`}>
                {current.subtitle}
              </p>
              <p className="mt-2 text-xs tracking-[0.08em] text-muted uppercase">{current.period}</p>
              <ExperienceHighlights items={current.highlights} />
              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  className="grid size-11 place-items-center rounded-full bg-surface text-ink hover:text-coral focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral"
                  aria-label="Previous experience"
                  onClick={() => navigateTo(Math.max(currentIndex - 1, 0))}
                >
                  <ArrowIcon dir="prev" />
                </button>
                <button
                  type="button"
                  className="grid size-11 place-items-center rounded-full bg-surface text-ink hover:text-coral focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral"
                  aria-label="Next experience"
                  onClick={() => navigateTo(Math.min(currentIndex + 1, slides.length - 1))}
                >
                  <ArrowIcon dir="next" />
                </button>
              </div>
            </div>

            <div className="relative min-w-0">
              <div className="overflow-hidden rounded-lg bg-surface-strong">
                <img
                  src={current.image}
                  alt={current.imageAlt}
                  width={1440}
                  height={900}
                  className="aspect-16/10 h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="relative mt-8 grid grid-cols-2 gap-4" role="tablist" aria-label="Experience">
            {slides.map((slide, index) => {
              const active = index === currentIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className="min-w-0 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral"
                  onClick={() => navigateTo(index)}
                >
                  <span className="block h-px overflow-hidden bg-line">
                    <span
                      className={`block h-full ${slide.accent === "blue" ? "bg-blue" : "bg-coral"}`}
                      style={{ width: active || index < currentIndex ? "100%" : "0%" }}
                    />
                  </span>
                  <span className={`mt-2 block truncate text-xs font-bold ${active ? "text-ink" : "text-muted"}`}>
                    {slide.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
