"use client";

import { useRef, useState } from "react";

const email = "adhityafebhiakbar@gmail.com";

const actionClass =
  "inline-flex min-h-11 items-center gap-2 rounded-full bg-surface px-5 py-3 text-sm font-bold hover:text-coral focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="shrink-0">
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46C23.2 24 24 23.23 24 22.27V1.73C24 .77 23.2 0 22.23 0Z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="shrink-0">
      <path
        fill="currentColor"
        d="M12 .3C5.37.3 0 5.67 0 12.3c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.28-.01-1.02-.02-2.01-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.22.7.82.58A12.01 12.01 0 0 0 24 12.3C24 5.67 18.63.3 12 .3Z"
      />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function ContactActions() {
  const [copied, setCopied] = useState(false);
  const resetRef = useRef<number>(0);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const field = document.createElement("textarea");
      field.value = email;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.left = "-9999px";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }

    setCopied(true);
    window.clearTimeout(resetRef.current);
    resetRef.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <nav className="flex flex-wrap items-center justify-center gap-3" aria-label="Contact links">
      <button
        type="button"
        className={actionClass}
        onClick={copyEmail}
        aria-label={copied ? "Email copied" : `Copy email ${email}`}
      >
        <MailIcon />
        {copied ? "Copied" : "Email"}
        <span className="hidden print:inline"> {email}</span>
      </button>
      <a
        className={actionClass}
        href="https://www.linkedin.com/in/adhityafebhiakbar/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <LinkedInIcon />
        LinkedIn
      </a>
      <a
        className={actionClass}
        href="https://github.com/adhityaf"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHubIcon />
        GitHub
      </a>
      <a
        className={actionClass}
        href="/cv-adhitya-febhiakbar.pdf"
        download="Adhitya_Febhiakbar_CV.pdf"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download CV Adhitya Febhiakbar"
      >
        <DownloadIcon />
        Download CV
      </a>
    </nav>
  );
}
