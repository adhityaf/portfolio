"use client";

import { useEffect, useState } from "react";

type Theme = "fintech" | "nordic";

function readTheme(): Theme {
  const stored =
    window.localStorage.getItem("portfolio-theme") ||
    window.localStorage.getItem("theme");
  if (stored === "nordic" || stored === "light") return "nordic";
  return "fintech";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("fintech");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const next = readTheme();
    applyTheme(next);
    setTheme(next);
    setReady(true);
  }, []);

  const choose = (next: Theme) => {
    window.localStorage.setItem("portfolio-theme", next);
    window.localStorage.removeItem("theme");
    applyTheme(next);
    setTheme(next);
  };

  const buttonClass = (active: boolean) =>
    `grid size-9 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral ${
      active ? "bg-surface-strong text-ink" : "text-muted hover:text-ink"
    }`;

  return (
    <div
      className="palette-switcher flex rounded-full bg-canvas p-1"
      role="group"
      aria-label="Color theme"
    >
      <button
        type="button"
        data-palette="fintech"
        className={buttonClass(ready && theme === "fintech")}
        aria-pressed={ready && theme === "fintech"}
        aria-label="Fintech theme"
        onClick={() => choose("fintech")}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5Z" />
        </svg>
      </button>
      <button
        type="button"
        data-palette="nordic"
        className={buttonClass(ready && theme === "nordic")}
        aria-pressed={ready && theme === "nordic"}
        aria-label="Nordic theme"
        onClick={() => choose("nordic")}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v1.5M12 19.5V21M4.9 4.9l1.1 1.1M18 18l1.1 1.1M3 12h1.5M19.5 12H21M4.9 19.1 6 18M18 6l1.1-1.1" />
        </svg>
      </button>
    </div>
  );
}
