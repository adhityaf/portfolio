"use client";

import { useEffect } from "react";

export function ScrollMotion() {
  useEffect(() => {
    const mobile = window.matchMedia("(width < 43.75rem)");
    const header = document.querySelector<HTMLElement>(".scroll-header");
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".primary-navigation a"),
      (link) => ({ link, id: link.hash.slice(1) }),
    );
    let frame: number | null = null;

    const update = () => {
      frame = null;
      let active = links[0];
      const boundary = (header?.getBoundingClientRect().bottom ?? 0) + 24;
      for (const entry of links) {
        const section = document.getElementById(entry.id);
        if (section && section.getBoundingClientRect().top <= boundary) active = entry;
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        active = links[links.length - 1];
      }
      for (const entry of links) {
        if (mobile.matches && entry === active) entry.link.setAttribute("aria-current", "location");
        else entry.link.removeAttribute("aria-current");
      }
    };

    const requestUpdate = () => {
      if (mobile.matches && frame === null) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    mobile.addEventListener("change", update);
    update();
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      mobile.removeEventListener("change", update);
      if (frame !== null) window.cancelAnimationFrame(frame);
      for (const { link } of links) link.removeAttribute("aria-current");
    };
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const progress = document.querySelector<HTMLElement>(".scroll-progress");
    let animationFrame: number | null = null;

    const update = () => {
      animationFrame = null;
      const viewportHeight = window.innerHeight;
      const scrollRange = document.documentElement.scrollHeight - viewportHeight;
      const pageProgress =
        scrollRange > 0
          ? Math.min(Math.max(window.scrollY / scrollRange, 0), 1)
          : 0;
      progress?.style.setProperty("--scroll-progress", String(pageProgress));
    };

    const requestUpdate = () => {
      if (animationFrame !== null) return;
      animationFrame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return null;
}
