import AnimatedScroll, {
  type AnimatedScrollItem,
} from "@/components/ui/animated-scroll";
import { ContactActions } from "@/components/ui/contact-actions";
import { ExperienceCarousel, type ExperienceSlide } from "@/components/ui/experience-carousel";
import { SkillMarquee } from "@/components/ui/skill-marquee";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ScrollMotion } from "./scroll-motion";


const whatIBuildItems: readonly AnimatedScrollItem[] = [
  {
    id: "mass-transfer",
    eyebrow: "BRI · payments",
    title: "Mass Transfer & RDN",
    description:
      "Batch transactions across IFT, RTGS, Clearing, BI-FAST, and SWIFT. RabbitMQ event-driven architecture, up to 50,000 transactions per batch, 3× higher processing efficiency.",
    image: "/what-i-build/transaction-platform.webp",
    imageAlt: "Circuit board representing high-throughput payment infrastructure",
    detail: "Go · RabbitMQ · gRPC · PostgreSQL · Redis",
  },
  {
    id: "ukln-batching",
    eyebrow: "BRI · cross-border",
    title: "UKLN batching",
    description:
      "Batch module for users in Singapore and Timor Leste. Multi-IFT transactions, up to 10 per batch, so cross-border payments move in one submit.",
    image: "/what-i-build/transaction-platform.webp",
    imageAlt: "Circuit board representing cross-border IFT batching infrastructure",
    detail: "Singapore · Timor Leste · multi-IFT",
  },
  {
    id: "bulog-erp",
    eyebrow: "BRI · integrations",
    title: "Bulog ERP",
    description:
      "ERP integration with Bulog for external transaction creation via APIs. Validation, approval, and payment processing in one path.",
    image: "/what-i-build/workflow-automation.webp",
    imageAlt: "Dashboard representing ERP transaction validation and approval",
    detail: "APIs · validation · approval · payment",
  },
  {
    id: "account-migration",
    eyebrow: "BRI · data at scale",
    title: "Account migration",
    description:
      "RDN search and filtering for 500,000+ customer accounts, 5× faster retrieval. Auth modules for 120,000+ users and 50,000+ companies from two legacy apps.",
    image: "/what-i-build/account-migration.webp",
    imageAlt: "Server racks representing large-scale account migration infrastructure",
    detail: "500,000+ accounts · 120,000+ users · 50,000+ companies",
  },
  {
    id: "approval-workflows",
    eyebrow: "BRI · operations",
    title: "Approval workflows",
    description:
      "Background processing and Redis caching on approval and rejection paths. Transaction latency down 50%, state still observable.",
    image: "/what-i-build/workflow-automation.webp",
    imageAlt: "Analytics dashboard representing observable automated workflows",
    detail: "Redis · background jobs · event-driven architecture",
  },
  {
    id: "ai-native-delivery",
    eyebrow: "BRI · delivery",
    title: "AI-native delivery",
    description:
      "Custom skills and coding agents for features, tests, refactors, and remediation. Review, query checks, and deployment SOPs stay in the loop.",
    image: "/what-i-build/ai-native-delivery.webp",
    imageAlt: "Developers collaborating at a laptop representing AI-assisted engineering",
    detail: "OpenCode · Oh My Pi · Copilot · Claude · Codex",
  },
];

const experienceSlides: readonly ExperienceSlide[] = [
  {
    id: "bri",
    mark: "BRI",
    title: "Bank Rakyat Indonesia (BRI)",
    subtitle: "Backend Developer · Acting Squad Lead",
    period: "May 2023 / Present",
    highlights: [
      "Built Mass Transfer and RDN Transaction features processing up to 50,000 transactions per batch across IFT, RTGS, Clearing, BI-FAST, and SWIFT, using RabbitMQ event-driven architecture to achieve 3x higher processing efficiency.",
      "Optimized RDN account management for the migration of 500,000+ customer accounts, achieving 5x faster data retrieval through improved search and filtering.",
      "Developed authentication modules supporting the migration of 120,000+ users and 50,000+ companies from two legacy applications.",
      "Optimized transaction approval and rejection workflows using background processing and Redis caching, reducing transaction latency by 50%.",
      "Served as Acting Squad Lead for 2 months, leading Backend, Frontend, and QA on priorities, system design, code/query reviews, and deployment SOPs.",
      "Designed an AI-native development workflow with custom AI skills and coding agents (OpenCode, Oh My Pi) for feature implementation, unit testing, refactoring, and complex code remediation.",
    ],
    image: "/what-i-build/transaction-platform.webp",
    imageAlt: "Circuit board representing high-throughput payment infrastructure at BRI",
    accent: "coral",
  },
  {
    id: "koinworks",
    mark: "KW",
    title: "KoinWorks",
    subtitle: "Backend Engineer",
    period: "May 2022 / Nov 2022",
    highlights: [
      "Built an internal HR application, eliminating paper-based workflows for leave and document requests, reducing manual processing time by 30%.",
      "Resolved an average of 50-100 technical support tickets per day during early payment feature stabilization, executing endpoint retriggers, SQL corrections, and API issue resolutions.",
      "Completed a 1-month intensive Golang bootcamp, building a CRUD RESTful API based on RESTful architecture and standard backend development practices.",
    ],
    image: "/what-i-build/workflow-automation.webp",
    imageAlt: "Dashboard representing internal operations work at KoinWorks",
    accent: "blue",
  },
];

const skillLogoRows = [
  [
    { id: "go", name: "Go" },
    { id: "postgresql", name: "PostgreSQL" },
    { id: "rabbitmq", name: "RabbitMQ" },
    { id: "redis", name: "Redis" },
    { id: "grpc", name: "gRPC" },
    { id: "python", name: "Python" },
    { id: "csharp", name: "C#" },
  ],
  [
    { id: "kong", name: "Kong" },
    { id: "rundeck", name: "Rundeck" },
    { id: "bitbucket", name: "Bitbucket" },
    { id: "jira", name: "Jira" },
    { id: "github", name: "GitHub" },
    { id: "jaeger", name: "Jaeger" },
    { id: "postman", name: "Postman" },
    { id: "swagger", name: "Swagger" },
    { id: "locust", name: "Locust" },
    { id: "opencode", name: "OpenCode" },
    { id: "github-copilot", name: "GitHub Copilot" },
    { id: "claude", name: "Claude" },
    { id: "openai", name: "OpenAI Codex" },
    { id: "grok", name: "Grok" },
  ],
] as const;

export default function Page() {
  return (
    <>
      <a className="fixed top-3 left-3 z-30 -translate-y-[200%] bg-ink px-3 py-2 text-canvas focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral print:hidden" href="#main-content">Skip to content</a>
      <div className="scroll-progress print:hidden" aria-hidden="true" />
      <ScrollMotion />
      <a
        className="back-to-top fixed right-4 bottom-4 z-30 grid size-11 place-items-center rounded-full bg-surface-strong text-ink transition-all duration-300 ease-out hover:-translate-y-1 hover:text-coral hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral active:translate-y-0 active:scale-95 nav:right-6 nav:bottom-6 print:hidden"
        href="#top"
        aria-label="Back to About"
        title="Back to About"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 10 6-6 6 6" />
          <path d="M12 4v16" />
        </svg>
      </a>

      <header className="scroll-header fixed inset-x-0 top-0 z-20 bg-surface print:hidden">
        <div className="mx-auto flex min-h-16 w-[calc(100%-2rem)] max-w-frame flex-col items-start gap-3 py-4 xs:w-[calc(100%-3rem)] nav:flex-row nav:items-center nav:justify-between nav:gap-8 nav:py-0">
          <a className="text-sm font-extrabold tracking-[-0.05em] text-ink hover:text-coral focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral" href="#top" aria-label="Adhitya Febhiakbar, home">AF</a>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 nav:gap-x-8">
            <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-muted nav:gap-x-8" aria-label="Primary navigation">
              <a className="hover:text-coral focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral" href="#top">About</a>
              <a className="hover:text-coral focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral" href="#experience">Experience</a>
              <a className="hover:text-coral focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral" href="#projects">Projects</a>
              <a className="hover:text-coral focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral" href="#contact">Contact</a>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="viewport-section scroll-hero flex h-svh flex-col items-center justify-center-safe overflow-y-auto px-4 pt-28 pb-8 text-center xs:px-6 print:h-auto print:overflow-visible print:px-0 print:py-0 print:pb-8" id="top" aria-labelledby="page-title">
          <div className="flex w-full shrink-0 flex-col items-center gap-6">
            <div className="flex min-w-0 items-center justify-center gap-5" data-scroll-reveal>
              <div className="grid size-16 shrink-0 place-items-center rounded-full bg-surface-strong text-xl font-extrabold tracking-[-0.06em] text-coral print:size-14" aria-hidden="true">AF</div>
              <div className="min-w-0 text-left">
                <p className="m-0 text-xs font-extrabold tracking-[0.17em] text-coral uppercase">Software Engineer</p>
                <h1 className="mt-2 max-w-[16ch] text-[clamp(2.4rem,8vw,4.25rem)] leading-[0.95] font-bold tracking-[-0.07em] print:text-5xl" id="page-title">Adhitya Febhiakbar</h1>
              </div>
            </div>
            <p className="m-0 w-full max-w-copy text-justify text-[1.02rem] text-muted [text-align-last:center]" data-scroll-reveal>Software engineer specialized in building reliable, high-throughput systems. I spend my time designing event-driven services, handling large-scale data migrations, and making sure APIs stay resilient under real production traffic. Tech-stack agnostic, deeply focused on solid architecture, automated testing, and code that is easy to maintain.</p>
            <SkillMarquee rows={skillLogoRows} assetPrefix="" />
          </div>
        </section>

        <ExperienceCarousel slides={experienceSlides} />

        <AnimatedScroll items={whatIBuildItems} />
      </main>


      <footer className="viewport-section scroll-section flex h-svh flex-col items-center justify-center-safe overflow-y-auto px-4 py-14 text-center xs:px-6 nav:py-16 print:h-auto print:overflow-visible print:px-0 print:py-8" id="contact" aria-labelledby="contact-title">
        <div className="flex w-full shrink-0 flex-col items-center gap-6" data-scroll-reveal>
          <div>
            <p className="m-0 text-xs font-extrabold tracking-[0.17em] text-coral uppercase">Contact</p>
            <h2 className="mx-auto mt-2 max-w-[24ch] text-[clamp(1.85rem,4vw,3rem)] leading-tight font-bold tracking-[-0.055em]" id="contact-title">Ready to team up?</h2>
            <p className="mx-auto mt-5 w-full max-w-copy text-justify text-[1.25rem] leading-[1.65] text-muted [text-align-last:center]">There&apos;s still room in my experience section. If you want backend systems that are fast, reliable, and actually survive production traffic—let&apos;s talk before someone else takes the slot. I move fast with modern tools, but I stay fully accountable for the reviews, the test suites, and every line of code that hits production. No excuses, just clean execution.</p>
          </div>
          <ContactActions />
        </div>
      </footer>
    </>
  );
}
