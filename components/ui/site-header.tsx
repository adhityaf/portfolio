"use client";

import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(width >= 43.75rem)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className="scroll-header fixed inset-x-0 top-0 z-20 bg-surface print:hidden">
      <div className="mx-auto flex min-h-16 w-[calc(100%-2rem)] max-w-frame items-center justify-between gap-8 xs:w-[calc(100%-3rem)]">
        <a className="flex min-h-11 min-w-11 w-fit items-center text-sm font-extrabold tracking-[-0.05em] text-ink hover:text-coral focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral nav:min-h-0 nav:min-w-0" href="#top" aria-label="Adhitya Febhiakbar, home" onClick={() => setOpen(false)}>AF</a>
        <div className="flex items-center gap-2 nav:gap-8">
          <ThemeToggle />
        <button
          ref={toggleRef}
          type="button"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-monogram-line text-ink hover:text-coral focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral nav:hidden"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="header-navigation-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div id="header-navigation-menu" className="header-menu nav:order-first nav:flex nav:flex-wrap nav:items-center nav:gap-x-8 nav:gap-y-2" data-open={open}>
          <nav className="primary-navigation grid gap-1 text-sm font-semibold text-copy [&>a]:flex [&>a]:min-h-11 [&>a]:items-center [&>a]:px-3 nav:flex nav:flex-wrap nav:gap-x-8 nav:gap-y-1 nav:text-xs nav:text-muted nav:[&>a]:min-h-0 nav:[&>a]:px-0" aria-label="Primary navigation" onClick={() => setOpen(false)}>
            <a className="hover:text-coral focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral" href="#top">About</a>
            <a className="hover:text-coral focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral" href="#experience">Experience</a>
            <a className="hover:text-coral focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral" href="#projects">Projects</a>
            <a className="hover:text-coral focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral" href="#contact">Contact</a>
          </nav>
        </div>
        </div>
      </div>
    </header>
  );
}
