import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-seven-coral-zxlaun7i61.vercel.app"),
  title: "Adhitya Febhiakbar — Software Engineer",
  description:
    "Backend engineer. Golang payment systems at BRI: 50,000 transactions per batch, 500,000+ account migrations.",
  openGraph: {
    title: "Adhitya Febhiakbar — Software Engineer",
    description:
      "Backend engineer. Golang payment systems at BRI: 50,000 transactions per batch, 500,000+ account migrations.",
    url: "https://portfolio-seven-coral-zxlaun7i61.vercel.app",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 627,
        alt: "AF — Adhitya Febhiakbar — Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adhitya Febhiakbar — Software Engineer",
    description:
      "Backend engineer. Golang payment systems at BRI: 50,000 transactions per batch, 500,000+ account migrations.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-canvas" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{const s=localStorage.getItem("portfolio-theme")||localStorage.getItem("theme");const t=s==="nordic"||s==="light"?"nordic":"fintech";document.documentElement.dataset.theme=t;}catch{document.documentElement.dataset.theme="fintech"}})();`,
          }}
        />
      </head>
      <body className="m-0 bg-canvas font-sans text-base text-ink antialiased [line-height:1.65]">
        {children}
      </body>
    </html>
  );
}
