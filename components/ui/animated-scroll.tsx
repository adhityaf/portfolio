"use client";

import { useEffect, useRef, useState } from "react";

export type AnimatedScrollItem = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  detail: string;
};

type AnimatedScrollProps = {
  items: readonly AnimatedScrollItem[];
};

export default function AnimatedScroll({ items }: AnimatedScrollProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const animationFrame = useRef<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const printPreference = window.matchMedia("print");
    const updatePreferences = () => {
      setReducedMotion(motionPreference.matches);
      setIsPrinting(printPreference.matches);
    };

    setIsHydrated(true);
    updatePreferences();
    motionPreference.addEventListener("change", updatePreferences);
    printPreference.addEventListener("change", updatePreferences);
    return () => {
      motionPreference.removeEventListener("change", updatePreferences);
      printPreference.removeEventListener("change", updatePreferences);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || items.length < 2) return;

    const updatePage = () => {
      animationFrame.current = null;
      const section = sectionRef.current;
      if (!section) return;

      const bounds = section.getBoundingClientRect();
      const scrollRange = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-bounds.top / scrollRange, 0), 1);
      const nextIndex = Math.min(
        Math.round(progress * (items.length - 1)),
        items.length - 1,
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
  }, [items.length, reducedMotion]);

  const navigateTo = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;

    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const step = Math.max(section.offsetHeight - window.innerHeight, 0) /
      Math.max(items.length - 1, 1);
    window.scrollTo({
      top: sectionTop + step * index,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  if (items.length === 0) return null;

  if (!isHydrated || reducedMotion || isPrinting) {
    return (
      <section
        id="projects"
        className="scroll-mt-32 bg-surface py-14 nav:py-16"
        aria-labelledby="projects-title"
      >
        <div className="mx-auto w-[calc(100%-2rem)] max-w-frame xs:w-[calc(100%-3rem)]">
          <p className="m-0 text-xs font-extrabold tracking-[0.17em] text-blue uppercase">
            Work
          </p>
          <h2
            className="mt-2 text-[clamp(1.85rem,4vw,3rem)] leading-none font-bold tracking-[-0.055em]"
            id="projects-title"
          >
            Projects
          </h2>
          <div className="mt-8 grid gap-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-lg bg-canvas nav:grid nav:grid-cols-2"
              >
                <img
                  className="h-64 w-full object-cover nav:h-full"
                  src={item.image}
                  alt={item.imageAlt}
                  width="1600"
                  height="1067"
                />
                <div className="grid content-center p-6 nav:p-10">
                  <p className="m-0 text-xs font-extrabold tracking-[0.17em] text-coral uppercase">
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-3 text-2xl leading-tight font-bold tracking-[-0.04em]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-copy">{item.description}</p>
                  <p className="mt-5 text-sm text-muted">{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative bg-canvas"
      style={{ height: `${items.length * 100}svh` }}
      aria-labelledby="projects-title"
    >
      <div aria-hidden="true">
        {items.map((item, index) => (
          <span
            key={item.id}
            className="viewport-snap-point pointer-events-none absolute left-0 size-px"
            style={{ top: `${index * 100}svh` }}
          />
        ))}
      </div>
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-x-0 top-0 z-20 mx-auto flex w-[calc(100%-2rem)] max-w-frame items-start justify-between gap-4 pt-32 xs:w-[calc(100%-3rem)] nav:pt-24">
          <div>
            <p className="m-0 text-xs font-extrabold tracking-[0.17em] text-blue uppercase">
              Work
            </p>
            <h2
              className="mt-2 text-[clamp(1.85rem,4vw,3rem)] leading-none font-bold tracking-[-0.055em]"
              id="projects-title"
            >
              Projects
            </h2>
          </div>
          <p className="m-0 font-mono text-xs text-muted" aria-live="polite">
            {String(currentIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </p>
        </div>

        <div className="absolute inset-0">
          <div className="relative h-full w-full overflow-hidden">
          {items.map((item, index) => {
            const offset = index - currentIndex;
            const imageOnLeft = index % 2 === 0;
            const imagePanel = (
              <div className="relative h-full overflow-hidden bg-surface-strong">
                <img
                  className="project-image h-full w-full object-cover opacity-65"
                  src={item.image}
                  alt={item.imageAlt}
                  width="1600"
                  height="1067"
                />
                <div className="project-image-overlay absolute inset-0 bg-gradient-to-t from-canvas/60 via-transparent to-canvas/20" />
              </div>
            );
            const contentPanel = (
              <div className="flex h-full flex-col justify-center-safe overflow-y-auto bg-surface px-6 pt-8 pb-28 nav:px-[clamp(2rem,7vw,7rem)] nav:pt-48 [&>*]:shrink-0">
                <p className="m-0 text-xs font-extrabold tracking-[0.17em] text-coral uppercase">
                  {item.eyebrow}
                </p>
                <h3 className="mt-4 max-w-[13ch] text-[clamp(2rem,5vw,4.5rem)] leading-[0.95] font-bold tracking-[-0.06em]">
                  {item.title}
                </h3>
                <p className="mt-6 max-w-xl text-[clamp(.95rem,1.5vw,1.15rem)] text-copy">
                  {item.description}
                </p>
                <p className="mt-6 max-w-lg text-sm text-muted">{item.detail}</p>
              </div>
            );

            return (
              <article
                key={item.id}
                className="absolute inset-0 grid grid-rows-2 nav:grid-cols-2 nav:grid-rows-1"
                aria-hidden={index !== currentIndex}
              >
                <div
                  className={`min-h-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${imageOnLeft ? "order-first" : "order-last"} nav:order-none`}
                  style={{ transform: `translateY(${offset * 100}%)` }}
                >
                  {imageOnLeft ? imagePanel : contentPanel}
                </div>
                <div
                  className={`min-h-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${imageOnLeft ? "order-last" : "order-first"} nav:order-none`}
                  style={{ transform: `translateY(${offset * -100}%)` }}
                >
                  {imageOnLeft ? contentPanel : imagePanel}
                </div>
              </article>
            );
          })}
          </div>
        </div>

        <nav
          className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-canvas/70 px-3 py-2 backdrop-blur"
          aria-label="Projects slides"
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              className="grid size-11 place-items-center rounded-full text-[0.68rem] font-bold text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
              type="button"
              aria-label={`Show ${item.title}`}
              aria-current={index === currentIndex ? "step" : undefined}
              onClick={() => navigateTo(index)}
              onKeyDown={(event) => {
                if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                event.preventDefault();
                const direction = event.key === "ArrowRight" ? 1 : -1;
                const nextIndex = Math.min(
                  Math.max(currentIndex + direction, 0),
                  items.length - 1,
                );
                navigateTo(nextIndex);
                const target = event.currentTarget.parentElement
                  ?.querySelectorAll<HTMLButtonElement>("button")[nextIndex];
                target?.focus({ preventScroll: true });
              }}
            >
              <span
                className={`block size-2 rounded-full transition-transform ${index === currentIndex ? "scale-150 bg-coral" : "bg-muted"}`}
                aria-hidden="true"
              />
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
