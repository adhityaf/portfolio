"use client";

import { useEffect } from "react";

export function ScrollMotion() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const root = document.documentElement;
    const progress = document.querySelector<HTMLElement>(".scroll-progress");
    const hero = document.querySelector<HTMLElement>(".scroll-hero");
    const animatedElements = [
      ...document.querySelectorAll<HTMLElement>(
        "[data-scroll-heading], [data-scroll-grid], [data-scroll-card]",
      ),
    ];
    let animationFrame: number | null = null;

    const update = () => {
      animationFrame = null;
      const viewportHeight = window.innerHeight;
      const scrollRange = document.documentElement.scrollHeight - viewportHeight;
      const pageProgress =
        scrollRange > 0
          ? Math.min(Math.max(window.scrollY / scrollRange, 0), 1)
          : 0;
      const heroProgress = Math.min(
        Math.max(window.scrollY / Math.max(viewportHeight, 1), 0),
        1,
      );

      progress?.style.setProperty("--scroll-progress", String(pageProgress));
      hero?.style.setProperty("--hero-shift", `${heroProgress * 48}px`);
      hero?.style.setProperty("--hero-opacity", String(1 - heroProgress * 0.72));
    };

    const requestUpdate = () => {
      if (animationFrame !== null) return;
      animationFrame = window.requestAnimationFrame(update);
    };

    animatedElements.forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight * 0.92) {
        element.dataset.scrollVisible = "";
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.scrollVisible = "";
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.12 },
    );

    animatedElements.forEach((element) => observer.observe(element));
    root.classList.add("scroll-motion");
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      root.classList.remove("scroll-motion");
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return null;
}
