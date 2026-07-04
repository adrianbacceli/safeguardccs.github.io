import React, { useEffect, useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  HeartPulse,
  Landmark,
  LockKeyhole,
  Menu,
  Moon,
  Network,
  Scale,
  Sun,
  TerminalSquare,
  X,
} from "lucide-react";
import { SiX, SiInstagram, SiFacebook, SiWhatsapp } from "react-icons/si";


type SectionId = "home" | "services" | "approach" | "threats" | "clients" | "contact";
type Theme = "light" | "dark";
type Language = "en" | "es";
type SubmitStatus = "idle" | "sending" | "success" | "error";

const SECTION_IDS: SectionId[] = ["home", "services", "approach", "threats", "clients", "contact"];
const WEB3FORMS_ACCESS_KEY = "b15631e6-e590-4acf-9085-ff56b23526b7";

function isSectionId(value: string): value is SectionId {
  return SECTION_IDS.includes(value as SectionId);
}

function getHashSection(): SectionId {
  if (typeof window === "undefined") return "home";
  const hash = window.location.hash.replace("#", "").toLowerCase();
  return isSectionId(hash) ? hash : "home";
}

function useTheme(): { theme: Theme; toggleTheme: () => void } {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggleTheme };
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline";
}

const certLogoModules = import.meta.glob(
  "/src/assets/certs/*.{svg,png,jpg,jpeg}",
  { eager: true, as: "url" }
) as Record<string, string>;

const certLogos = Object.entries(certLogoModules).map(([path, url]) => {
  const filename = path.split("/").pop() || "certification";
  const baseName = filename.split(".")[0];
  return {
    src: url,
    label: baseName.replace(/[-_]/g, " "), // "aws-security-specialty" -> "aws security specialty"
  };
});

interface ThreatStat {
  value: string;
  label: {
    en: string;
    es: string;
  };
  context: {
    en: string;
    es: string;
  };
  sourceName: string;
  sourceUrl: string;
  year: string;
}

const threatStats: ThreatStat[] = [
  {
    value: "4.0B",
    label: {
      en: "Attack attempts reported for Panama",
      es: "Intentos de ataque reportados para Panamá",
    },
    context: {
      en: "A local report citing Fortinet FortiGuard Labs described Panama’s 2023 attack volume at a scale SMBs cannot ignore.",
      es: "Un reporte local que cita a Fortinet FortiGuard Labs describió el volumen de ataques de Panamá en 2023 a una escala difícil de ignorar para las pymes.",
    },
    sourceName: "FortiGuard Labs / Vida Digital",
    sourceUrl: "https://www.fortiguard.com/",
    year: "2023",
  },
  {
    value: "+97%",
    label: {
      en: "Weekly attack growth against Panamanian organizations",
      es: "Crecimiento semanal de ataques contra organizaciones panameñas",
    },
    context: {
      en: "Local financial press cited Check Point threat intelligence showing sharp year-over-year growth, with banking and finance seeing heavier pressure.",
      es: "Prensa financiera local citó inteligencia de Check Point con fuerte crecimiento interanual y mayor presión en banca y finanzas.",
    },
    sourceName: "Check Point Research / El Capital Financiero",
    sourceUrl: "https://research.checkpoint.com/",
    year: "2024",
  },
  {
    value: "1.1T+",
    label: {
      en: "Malware attacks blocked in Latin America",
      es: "Ataques de malware bloqueados en Latinoamérica",
    },
    context: {
      en: "Kaspersky’s regional threat reporting described more than a trillion blocked malware attacks between mid-2023 and mid-2024.",
      es: "El reporte regional de Kaspersky describió más de un billón de ataques de malware bloqueados entre mediados de 2023 y mediados de 2024.",
    },
    sourceName: "Kaspersky Threat Panorama",
    sourceUrl: "https://latam.kaspersky.com/blog/",
    year: "2024",
  },
  {
    value: "1.1M+",
    label: {
      en: "Ransomware attempts in Latin America",
      es: "Intentos de ransomware en Latinoamérica",
    },
    context: {
      en: "Kaspersky’s 2025 regional ransomware view framed Latin America as a continuous high-risk operating environment.",
      es: "La visión regional 2025 de ransomware de Kaspersky ubicó a Latinoamérica como un entorno operativo de alto riesgo constante.",
    },
    sourceName: "Kaspersky Threat Panorama",
    sourceUrl: "https://securelist.com/",
    year: "2025",
  },
];

const Button: React.FC<ButtonProps> = ({ variant = "solid", className = "", ...props }) => {
  const base =
    "group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-out hover:[&_svg]:translate-x-1";
  const styles =
    variant === "solid"
      ? "bg-neutral-950 text-white shadow-sm hover:bg-neutral-800 hover:shadow-md dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
      : "border border-neutral-300 bg-white/80 text-neutral-900 hover:border-neutral-900 hover:bg-white dark:border-neutral-700 dark:bg-neutral-950/70 dark:text-neutral-100 dark:hover:border-neutral-200 dark:hover:bg-neutral-900";
  return <button className={`${base} ${styles} ${className}`} {...props} />;
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

const Card: React.FC<CardProps> = ({
  className = "",
  interactive = true,
  ...props
}) => {
  const interactiveClasses = interactive
    ? "group hover:border-emerald-400/60 hover:shadow-lg"
    : "";

  return (
    <div
      className={`rounded-xl border border-neutral-200 bg-white/85 shadow-sm backdrop-blur-sm transition-all duration-500 ease-out dark:border-neutral-800 dark:bg-neutral-950/80 ${interactiveClasses} ${className}`}
      {...props}
    />
  );
};

const CardInner: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", ...props }) => (
  <div
    className={`h-full p-5 text-sm ${className}`}
    {...props}
  />
);

interface NavbarProps {
  theme: Theme;
  language: Language;
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  theme,
  language,
  activeSection,
  onNavigate,
  onToggleTheme,
  onToggleLanguage,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isEn = language === "en";
  const navItems: Array<{ section: SectionId; label: string }> = [
    { section: "home", label: isEn ? "Home" : "Inicio" },
    { section: "services", label: isEn ? "How we work" : "Cómo trabajamos" },
    { section: "approach", label: isEn ? "Why trust us" : "Por qué confiar" },
    { section: "threats", label: isEn ? "Emerging threats" : "Amenazas actuales" },
    { section: "clients", label: isEn ? "Who we work with" : "Con quién trabajamos" },
    { section: "contact", label: isEn ? "Contact" : "Contacto" },
  ];

  const linkBase =
    "relative flex h-8 items-center rounded-md px-3 text-[11px] font-medium transition-colors duration-300 ease-out active:scale-[0.98] sm:text-xs";

  const LinkButton: React.FC<{ section: SectionId; children: React.ReactNode }> = ({
    section,
    children,
  }) => {
    const isActive = activeSection === section;

    return (
      <button
        type="button"
        onClick={() => onNavigate(section)}
        className={`${linkBase} ${
          isActive
            ? "text-neutral-50 dark:text-neutral-950"
            : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-neutral-50"
        }`}
      >
        {isActive && (
          <motion.span
            layoutId="nav-active-pill"
            className="absolute inset-0 rounded-xl bg-neutral-950 dark:bg-neutral-100"
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 34,
              mass: 0.7,
            }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/85 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-950/85">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2"
        >
          <img
            src={theme === "dark" ? "/logo_white.svg" : "/logo.svg"}
            alt="SafeGuard CCS logo"
            className="h-7 w-auto sm:h-8"
          />
        </button>

        {/* Right side: nav + toggles + mobile button */}
        <div className="flex items-center gap-2">
          {/* Desktop nav – only from md and up */}
          <LayoutGroup id="desktop-nav">
            <nav className="relative hidden h-10 items-center gap-1 overflow-hidden rounded-lg border border-neutral-200 bg-white/75 px-1 text-[11px] shadow-sm backdrop-blur md:flex dark:border-neutral-800 dark:bg-neutral-950/75">
              {navItems.map((item) => (
                <LinkButton key={item.section} section={item.section}>
                  {item.label}
                </LinkButton>
              ))}
            </nav>
          </LayoutGroup>

          {/* Language + theme */}
          <div className="flex h-10 items-center gap-2 text-xs">
            <div className="flex h-10 items-center rounded-md border border-neutral-300/70 bg-white/80 p-0.5 text-[11px] shadow-sm dark:border-neutral-700/70 dark:bg-neutral-900/80">
              <button
                type="button"
                onClick={onToggleLanguage}
                className={
                  "flex h-8 items-center rounded px-2 transition-all duration-300 ease-out active:scale-[0.98] " +
                  (language === "en"
                    ? "bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950"
                    : "text-neutral-600 dark:text-neutral-300")
                }
              >
                EN
              </button>
              <button
                type="button"
                onClick={onToggleLanguage}
                className={
                  "flex h-8 items-center rounded px-2 transition-all duration-300 ease-out active:scale-[0.98] " +
                  (language === "es"
                    ? "bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950"
                    : "text-neutral-600 dark:text-neutral-300")
                }
              >
                ES
              </button>
            </div>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-300/70 bg-white/80 text-sm shadow-sm transition-all duration-300 ease-out hover:bg-neutral-100 active:scale-[0.98] dark:border-neutral-700/70 dark:bg-neutral-900/80 dark:hover:bg-neutral-800"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Mobile menu button – visible below md */}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-300/70 bg-white/80 text-sm shadow-sm transition-all duration-300 ease-out active:scale-[0.98] md:hidden dark:border-neutral-700/70 dark:bg-neutral-900/80"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown nav – only below md */}
      {mobileOpen && (
        <div className="border-t border-neutral-200/70 bg-white/95 px-4 py-3 shadow-sm backdrop-blur md:hidden dark:border-neutral-800/70 dark:bg-neutral-950/95">
          <div className="flex flex-col gap-1 text-sm">
            <button
              onClick={() => {
                onNavigate("home");
                setMobileOpen(false);
              }}
              className="rounded-md px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              {isEn ? "Home" : "Inicio"}
            </button>
            <button
              onClick={() => {
                onNavigate("services");
                setMobileOpen(false);
              }}
              className="rounded-md px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              {isEn ? "How we work" : "Cómo trabajamos"}
            </button>
            <button
              onClick={() => {
                onNavigate("approach");
                setMobileOpen(false);
              }}
              className="rounded-md px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              {isEn ? "Why trust us" : "Por qué confiar"}
            </button>
            <button
              onClick={() => {
                onNavigate("threats");
                setMobileOpen(false);
              }}
              className="rounded-md px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              {isEn ? "Emerging threats" : "Amenazas actuales"}
            </button>
            <button
              onClick={() => {
                onNavigate("clients");
                setMobileOpen(false);
              }}
              className="rounded-md px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              {isEn ? "Who we work with" : "Con quién trabajamos"}
            </button>
            <button
              onClick={() => {
                onNavigate("contact");
                setMobileOpen(false);
              }}
              className="rounded-md px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              {isEn ? "Contact" : "Contacto"}
            </button>
          </div>
        </div>
      )}
    </header>

  );
};


interface AnimatedSectionProps {
  isActive: boolean;
  children: React.ReactNode;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ isActive, children }) => {
  return (
    <section
      className={`section-transition motion-reduce:transition-none ${
        isActive
          ? "relative opacity-100 translate-y-0"
          : "pointer-events-none absolute inset-0 opacity-0 translate-y-5"
      }`}
    >
      {children}
    </section>
  );
};

interface SectionProps {
  language: Language;
}

const BackgroundSystem: React.FC = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.055)_1px,transparent_1px)] bg-[size:44px_44px] opacity-70 dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.075)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.075)_1px,transparent_1px)]" />
    <div className="ambient-sweep absolute left-1/2 top-0 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full border border-emerald-500/10 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),rgba(14,165,233,0.05)_36%,transparent_68%)] blur-sm dark:border-emerald-300/10 dark:bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.13),rgba(14,165,233,0.06)_36%,transparent_68%)]" />
    <div className="node-field absolute inset-0 opacity-60 dark:opacity-50">
      <span className="threat-node threat-node-a" />
      <span className="threat-node threat-node-b" />
      <span className="threat-node threat-node-c" />
      <span className="threat-node threat-node-d" />
      <span className="threat-node threat-node-e" />
      <span className="threat-link threat-link-a" />
      <span className="threat-link threat-link-b" />
      <span className="threat-link threat-link-c" />
    </div>
    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#f7f8f5] to-transparent dark:from-[#050706]" />
  </div>
);

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState<Language>("en");
  const [activeSection, setActiveSection] = useState<SectionId>(() => getHashSection());

  useEffect(() => {
    const syncSectionFromHash = () => {
      const section = getHashSection();
      setActiveSection(section);

      if (window.location.hash !== `#${section}`) {
        window.history.replaceState(null, "", `#${section}`);
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    syncSectionFromHash();
    window.addEventListener("hashchange", syncSectionFromHash);
    return () => window.removeEventListener("hashchange", syncSectionFromHash);
  }, []);

  const handleNavigate = (section: SectionId) => {
    if (window.location.hash === `#${section}`) {
      setActiveSection(section);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.location.hash = section;
  };

  const toggleLanguage = () =>
    setLanguage((lang) => (lang === "en" ? "es" : "en"));

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-[#f7f8f5] text-neutral-950 transition-colors duration-300 dark:bg-[#050706] dark:text-neutral-50">
      <BackgroundSystem />

      <Navbar
        theme={theme}
        language={language}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onToggleTheme={toggleTheme}
        onToggleLanguage={toggleLanguage}
      />

      {/* main takes remaining height */}
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="relative w-full">
          <AnimatedSection isActive={activeSection === "home"}>
            <HeroSection language={language} onNavigate={handleNavigate} />
          </AnimatedSection>
          <AnimatedSection isActive={activeSection === "services"}>
            <ServicesSection language={language} />
          </AnimatedSection>
          <AnimatedSection isActive={activeSection === "approach"}>
            <ApproachSection language={language} />
          </AnimatedSection>
          <AnimatedSection isActive={activeSection === "threats"}>
            <ThreatsSection language={language} />
          </AnimatedSection>
          <AnimatedSection isActive={activeSection === "clients"}>
            <ClientsSection language={language} />
          </AnimatedSection>
          <AnimatedSection isActive={activeSection === "contact"}>
            <ContactSection language={language} />
          </AnimatedSection>
        </div>
      </main>

      <Footer language={language} />
      <WhatsAppButton language={language} />
    </div>
  );
};

interface HeroSectionProps {
  language: Language;
  onNavigate: (section: SectionId) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ language, onNavigate }) => {
  const isEn = language === "en";
  const heroPoints = [
    {
      icon: LockKeyhole,
      label: isEn
        ? "Work directly with senior engineers who understand business risk and security operations."
        : "Trabaja directamente con ingenieros senior que entienden riesgo de negocio y operaciones de seguridad.",
    },
    {
      icon: Building2,
      label: isEn
        ? "Get cybersecurity decisions sized for SMB budgets, teams, and operational reality."
        : "Recibe decisiones de ciberseguridad ajustadas a presupuestos, equipos y realidad operativa de pymes.",
    },
    {
      icon: Network,
      label: isEn
        ? "Lean on engineers with 7+ years across Latin America and deep enterprise infrastructure exposure."
        : "Apóyate en ingenieros con más de 7 años en Latinoamérica y amplia exposición a infraestructura empresarial.",
    },
  ];

  return (
    <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.12fr)_420px] lg:items-center xl:gap-12">
      <div className="max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-300">
          {isEn ? "Cybersecurity consulting in Panama" : "Consultoría de ciberseguridad en Panamá"}
        </p>

        <h1 className="mt-5 max-w-[11ch] text-5xl font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5rem]">
          {isEn ? "All we do is security." : "Nos dedicamos a seguridad."}
        </h1>

        <ul className="mt-7 max-w-3xl space-y-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200 lg:text-base">
          {heroPoints.map(({ icon: Icon, label }) => (
            <li key={label} className="flex gap-3">
              <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700 dark:text-emerald-300" />
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button onClick={() => onNavigate("contact")} className="lg:px-6 lg:py-3">
            {isEn ? "Talk about your environment" : "Hablar de tu entorno"}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => onNavigate("services")} className="lg:px-6 lg:py-3">
            {isEn ? "Review services" : "Revisar servicios"}
          </Button>
        </div>
      </div>

      <div className="security-console relative hidden overflow-hidden rounded-lg border border-neutral-300 bg-white p-5 text-neutral-950 shadow-2xl shadow-neutral-950/10 lg:block dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100">
        <div className="mb-5 flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-white/10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-neutral-600 dark:text-neutral-500">
              {isEn ? "Regional threat snapshot" : "Panorama regional de amenazas"}
            </p>
          </div>
          <Activity className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
        </div>
        <div className="space-y-3">
          {threatStats.slice(0, 3).map((stat) => (
            <div key={stat.value} className="grid grid-cols-[4.5rem_1fr] items-start gap-4 rounded-md border border-neutral-200 bg-neutral-50 p-3 dark:border-white/10 dark:bg-white/[0.025]">
              <div className="font-mono text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                {stat.value}
              </div>
              <div>
                <p className="text-xs font-medium leading-snug text-neutral-800 dark:text-neutral-100">
                  {isEn ? stat.label.en : stat.label.es}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-md border border-neutral-200 bg-neutral-50 p-3 dark:border-white/10 dark:bg-white/[0.03]">
          <Button
            type="button"
            onClick={() => onNavigate("threats")}
            className="w-full bg-emerald-300 text-neutral-950 hover:bg-emerald-200 dark:bg-emerald-300 dark:text-neutral-950 dark:hover:bg-emerald-200"
          >
            {isEn ? "See emerging threats" : "Ver amenazas actuales"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const ServicesSection: React.FC<SectionProps> = ({ language }) => {
  const isEn = language === "en";

  const services = [
    {
      icon: Network,
      tag: isEn ? "Assess" : "Evaluar",
      title: isEn ? "Understand the environment" : "Entender el entorno",
      description: isEn
        ? "We map how your business works: systems, data, people, access, vendors, and operational constraints."
        : "Mapeamos cómo trabaja tu negocio: sistemas, datos, personas, accesos, proveedores y limitaciones operativas.",
      points: isEn
        ? [
            "Business and data flows",
            "Critical systems and dependencies",
            "Current exposure and weak spots",
          ]
        : [
            "Flujos de negocio y datos",
            "Sistemas críticos y dependencias",
            "Exposición actual y puntos débiles",
          ],
    },
    {
      icon: LockKeyhole,
      tag: isEn ? "Align" : "Alinear",
      title: isEn ? "Use NIST and ISO 27000 as baseline" : "Usar NIST e ISO 27000 como base",
      description: isEn
        ? "We translate recognized security frameworks into controls that fit your size, budget, and team."
        : "Traducimos marcos reconocidos de seguridad en controles que se ajustan a tu tamaño, presupuesto y equipo.",
      points: isEn
        ? [
            "NIST Cybersecurity Framework principles",
            "ISO 27000 information-security practices",
            "Practical control gaps and priorities",
          ]
        : [
            "Principios del marco NIST CSF",
            "Prácticas de seguridad ISO 27000",
            "Brechas de control y prioridades prácticas",
          ],
    },
    {
      icon: FileCheck2,
      tag: isEn ? "Roadmap" : "Ruta",
      title: isEn ? "Turn risk into an action plan" : "Convertir riesgo en plan de acción",
      description: isEn
        ? "You get executive summaries, technical detail, and a budget-aware roadmap your team can approve."
        : "Recibes resúmenes ejecutivos, detalle técnico y una ruta consciente del presupuesto que tu equipo puede aprobar.",
      points: isEn
        ? [
            "Executive-level explanation",
            "Prioritized improvements",
            "Support through implementation",
          ]
        : [
            "Explicación para gerencia",
            "Mejoras priorizadas",
            "Acompañamiento en implementación",
          ],
    },
  ];

  return (
    <div className="py-4 sm:py-6">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
          {isEn ? "How we work" : "Cómo trabajamos"}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {isEn ? "Framework-led security, built for real businesses" : "Seguridad basada en marcos, diseñada para negocios reales"}
        </h2>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
          {isEn
            ? "We use NIST and ISO 27000 as a practical baseline, then adapt the plan to your operations instead of forcing a generic product stack."
            : "Usamos NIST e ISO 27000 como una base práctica y adaptamos el plan a tus operaciones en lugar de imponer un paquete genérico de productos."}
        </p>
      </div>
      
      <div className="relative">
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title}>
              <CardInner className="flex min-h-[19rem] flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-emerald-700/20 bg-emerald-50 text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-950/40 dark:text-emerald-200">
                    <service.icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-400">
                    {service.tag}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {service.description}
                </p>
                <ul className="mt-5 space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
                  {service.points.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-700 dark:text-emerald-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardInner>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const ApproachSection: React.FC<SectionProps> = ({ language }) => {
  const isEn = language === "en";

  return (
    <div className="py-4 sm:py-6">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
          {isEn ? "Credentials" : "Credenciales"}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {isEn
            ? "Explore our portfolio of industry certifications and credentials"
            : "Explora nuestro portafolio de certificaciones y credenciales de la industria"}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          {isEn
            ? "The portfolio reflects infrastructure, networking, storage, security, and enterprise support experience across real customer environments."
            : "El portafolio refleja experiencia en infraestructura, redes, almacenamiento, seguridad y soporte empresarial en entornos reales de clientes."}
        </p>
      </div>

      <CertCarousel language={language} />
    </div>
  );
};

function getCredentialDetail(label: string, isEn: boolean): string {
  const normalized = label.toLowerCase();

  if (normalized.includes("network")) {
    return isEn
      ? "Shows practical grounding in network foundations: segmentation, connectivity, access paths, and the infrastructure decisions that influence security posture."
      : "Demuestra base práctica en redes: segmentación, conectividad, rutas de acceso y decisiones de infraestructura que influyen en la postura de seguridad.";
  }

  if (normalized.includes("storage")) {
    return isEn
      ? "Supports work around data protection, storage architecture, resilience, recovery expectations, and the systems that keep business information available."
      : "Respalda trabajo en protección de datos, arquitectura de almacenamiento, resiliencia, expectativas de recuperación y sistemas que mantienen disponible la información del negocio.";
  }

  if (normalized.includes("poweredge")) {
    return isEn
      ? "Reflects hands-on enterprise server experience, useful for understanding the real systems behind identity, applications, backups, and operations."
      : "Refleja experiencia práctica con servidores empresariales, útil para entender los sistemas reales detrás de identidad, aplicaciones, respaldos y operaciones.";
  }

  if (normalized.includes("nutanix")) {
    return isEn
      ? "Connects infrastructure modernization with operations, availability, virtualization, and the platform decisions that affect long-term security."
      : "Conecta modernización de infraestructura con operaciones, disponibilidad, virtualización y decisiones de plataforma que afectan la seguridad a largo plazo.";
  }

  return isEn
    ? "Part of a broader credential portfolio across enterprise infrastructure, security operations, support quality, and practical technical problem solving."
    : "Parte de un portafolio más amplio de credenciales en infraestructura empresarial, operaciones de seguridad, calidad de soporte y solución práctica de problemas técnicos.";
}

const CertCarousel: React.FC<SectionProps> = ({ language }) => {
  const isEn = language === "en";

  if (certLogos.length === 0) {
    return null;
  }

  const [index, setIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [fadeVisible, setFadeVisible] = useState(true);
  const total = certLogos.length;
  const activeLogo = certLogos[displayIndex];
  const activeLabel = activeLogo.label
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  // Auto-advance every 5s, reset whenever index changes (including arrow clicks)
  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 5000);

    return () => window.clearInterval(id);
  }, [total, index]);

  useEffect(() => {
    if (index === displayIndex) return;

    setFadeVisible(false);
    const swapId = window.setTimeout(() => {
      setDisplayIndex(index);
      window.requestAnimationFrame(() => setFadeVisible(true));
    }, 180);

    return () => window.clearTimeout(swapId);
  }, [displayIndex, index]);

  const goNext = () => setIndex((prev) => (prev + 1) % total);
  const goPrev = () => setIndex((prev) => (prev - 1 + total) % total);
  const detail = getCredentialDetail(activeLogo.label, isEn);

  return (
    <div className="grid gap-5 rounded-lg border border-neutral-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm md:grid-cols-[280px_1fr] dark:border-neutral-800 dark:bg-neutral-950/75">
      <div className="space-y-3">
        <div className="flex aspect-square items-center justify-center rounded-lg border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/70">
          <img
            src={activeLogo.src}
            alt={activeLabel}
            className={`h-full max-h-[12rem] w-full object-contain transition-all duration-500 ease-out ${
              fadeVisible ? "scale-100 opacity-100 blur-0" : "scale-[0.98] opacity-0 blur-sm"
            }`}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goPrev}
            aria-label={isEn ? "Previous certification" : "Certificación anterior"}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-300/70 bg-white/80 text-[16px] text-neutral-700 shadow-sm transition duration-300 ease-out hover:bg-neutral-100 dark:border-neutral-700/70 dark:bg-neutral-900/80 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            ‹
          </button>
          <div className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
            {index + 1} / {total}
          </div>
          <button
            type="button"
            onClick={goNext}
            aria-label={isEn ? "Next certification" : "Siguiente certificación"}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-300/70 bg-white/80 text-[16px] text-neutral-700 shadow-sm transition duration-300 ease-out hover:bg-neutral-100 dark:border-neutral-700/70 dark:bg-neutral-900/80 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            ›
          </button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-rows-[auto_1fr]">
        <Card interactive={false}>
          <CardInner>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              {isEn ? "Active credential" : "Credencial activa"}
            </p>
            <h3 className="mt-3 text-xl font-semibold text-neutral-950 dark:text-neutral-50">
              {activeLabel}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              {detail}
            </p>
          </CardInner>
        </Card>
        <div className="grid gap-3 sm:grid-cols-3">
          {(isEn
            ? [
                ["Infrastructure", "Server, storage, networking and platform depth."],
                ["Security", "Controls, governance and secure operations."],
                ["Support", "Enterprise-grade case handling and customer outcomes."],
              ]
            : [
                ["Infraestructura", "Profundidad en servidores, almacenamiento, redes y plataformas."],
                ["Seguridad", "Controles, gobierno y operaciones seguras."],
                ["Soporte", "Manejo de casos empresariales y resultados para clientes."],
              ]
          ).map(([title, copy]) => (
            <Card key={title} interactive={false}>
              <CardInner className="p-4">
                <h4 className="text-xs font-semibold text-neutral-950 dark:text-neutral-50">
                  {title}
                </h4>
                <p className="mt-2 text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {copy}
                </p>
              </CardInner>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};



const ThreatsSection: React.FC<SectionProps> = ({ language }) => {
  const isEn = language === "en";
  const takeaways = isEn
    ? [
        "Panama appears in regional threat telemetry.",
        "Growth can outpace security discipline.",
        "The real risk is downtime, fraud, data loss, and lost trust.",
      ]
    : [
        "Panamá aparece en telemetría regional de amenazas.",
        "El crecimiento puede superar la disciplina de seguridad.",
        "El riesgo real es caída, fraude, pérdida de datos y pérdida de confianza.",
      ];

  return (
    <div className="py-4 sm:py-6">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
            {isEn ? "Emerging threats" : "Amenazas actuales"}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {isEn
              ? "Panama and Latin America are already in the threat data"
              : "Panamá y Latinoamérica ya aparecen en los datos de amenazas"}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            {isEn
              ? "We use regional reporting as context, then turn it into practical security decisions for your company. The point is not fear; it is prioritization."
              : "Usamos reportes regionales como contexto y los convertimos en decisiones prácticas de seguridad para tu empresa. El objetivo no es miedo; es priorización."}
          </p>

          <div className="mt-6 space-y-3">
            {takeaways.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-neutral-200 bg-white/70 p-3 text-xs leading-relaxed text-neutral-700 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/70 dark:text-neutral-300">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-700 dark:text-emerald-300" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {threatStats.map((stat) => (
            <a
              key={`${stat.value}-${stat.year}`}
              href={stat.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="group rounded-xl border border-neutral-200 bg-white/85 shadow-sm backdrop-blur-sm transition-all duration-500 ease-out hover:border-emerald-400/60 hover:bg-white hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 dark:border-neutral-800 dark:bg-neutral-950/80 dark:hover:bg-neutral-950"
            >
              <div className="flex min-h-[15rem] flex-col p-5 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-mono text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                      {stat.value}
                    </div>
                    <p className="mt-2 text-sm font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
                      {isEn ? stat.label.en : stat.label.es}
                    </p>
                  </div>
                  <span className="rounded-md border border-neutral-200 px-2 py-1 font-mono text-[10px] text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                    {stat.year}
                  </span>
                </div>
                <p className="mt-4 flex-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {isEn ? stat.context.en : stat.context.es}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-800">
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    {stat.sourceName}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-emerald-800 transition-transform duration-300 ease-out group-hover:translate-x-1 dark:text-emerald-300" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};





const ClientsSection: React.FC<SectionProps> = ({ language }) => {
  const isEn = language === "en";

  const industries = isEn
    ? [
        {
          icon: Landmark,
          title: "Accounting & tax firms",
          desc: "Teams that handle sensitive financial reports and client records.",
        },
        {
          icon: Scale,
          title: "Legal & compliance practices",
          desc: "Boutiques and independent professionals managing confidential cases.",
        },
        {
          icon: Building2,
          title: "Professional services",
          desc: "Consultants, advisors and service firms with client-facing workloads.",
        },
        {
          icon: HeartPulse,
          title: "Health & wellness clinics",
          desc: "Small clinics or providers who store basic patient data.",
        },
        {
          icon: TerminalSquare,
          title: "Small retail & local businesses",
          desc: "Shops that rely on POS systems, WiFi networks or cloud tools.",
        },
        {
          icon: Network,
          title: "Other businesses",
          desc: "Any business that needs clarity, protection, and budget-aware guidance.",
        },
      ]
    : [
        {
          icon: Landmark,
          title: "Firmas contables y fiscales",
          desc: "Equipos que manejan reportes financieros y datos sensibles de clientes.",
        },
        {
          icon: Scale,
          title: "Firmas legales y de cumplimiento",
          desc: "Pequeños bufetes que gestionan casos confidenciales.",
        },
        {
          icon: Building2,
          title: "Servicios profesionales",
          desc: "Consultores, asesores y firmas que dependen del manejo de clientes.",
        },
        {
          icon: HeartPulse,
          title: "Clínicas de salud y bienestar",
          desc: "Pequeñas clínicas que almacenan datos básicos de pacientes.",
        },
        {
          icon: TerminalSquare,
          title: "Pequeños comercios",
          desc: "Negocios que dependen de POS, redes WiFi o herramientas en la nube.",
        },
        {
          icon: Network,
          title: "Otros negocios",
          desc: "Cualquier empresa que necesite claridad, protección y guía consciente del presupuesto.",
        },
      ];

  return (
    <div className="py-4 sm:py-6">
      <div className="max-w-4xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
            {isEn ? "Client fit" : "Encaje"}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {isEn ? "Everyone deserves security that respects the budget" : "Todos merecen seguridad que respete el presupuesto"}
          </h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
            {isEn
              ? "We have experience across small, medium, and large businesses, and we are especially equipped to protect business owners’ pockets while improving security."
              : "Tenemos experiencia en empresas pequeñas, medianas y grandes, y estamos especialmente preparados para proteger el bolsillo del dueño mientras mejora su seguridad."}
          </p>
        </div>
      </div>
      <div className="my-6 flex items-center justify-center">
        <span className="text-center text-sm font-medium text-neutral-600 dark:text-neutral-300">
          {isEn
            ? "We adapt the engagement to the company, not the other way around."
            : "Adaptamos el servicio a la empresa, no al revés."}
        </span>
      </div>
      <div className="mt-10">
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {industries.map((item) => (
            <Card key={item.title}>
              <CardInner className="flex h-full flex-col items-start p-5 text-neutral-700 dark:text-neutral-200">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">
                  {item.desc}
                </p>
              </CardInner>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};


const ContactSection: React.FC<SectionProps> = ({ language }) => {
  const isEn = language === "en";

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [employees, setEmployees] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [submitStatus, setSubmitStatus] = React.useState<SubmitStatus>("idle");
  const [successPopupOpen, setSuccessPopupOpen] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus("sending");

    const subject = isEn
      ? `SafeGuard CCS – Inquiry from ${name || "Potential client"}`
      : `SafeGuard CCS – Consulta de ${name || "Cliente potencial"}`;

    const formData = new FormData(e.currentTarget);
    if (formData.get("botcheck")) {
      setSubmitStatus("idle");
      return;
    }

    formData.set("subject", subject);
    formData.set("from_name", "SafeGuard CCS Website");
    formData.set("language", language);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json().catch(() => null)) as
        | { success?: boolean }
        | null;

      if (!response.ok || result?.success === false) {
        throw new Error("Web3Forms submission failed");
      }

      setSubmitStatus("success");
      setName("");
      setEmail("");
      setCompany("");
      setEmployees("");
      setMessage("");
      setSuccessPopupOpen(true);
    } catch {
      setSubmitStatus("error");
    }
  };

  return (
    <div className="py-4 sm:py-6">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
            {isEn ? "Contact" : "Contacto"}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {isEn ? "Tell us about your environment" : "Cuéntanos sobre tu entorno"}
          </h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
            {isEn
              ? "Share a short description and we’ll reply with whether we’re a good fit and what a first engagement could look like."
              : "Cuéntanos brevemente tu situación y te responderemos indicando si somos un buen ajuste y cómo podría verse un primer servicio."}
          </p>
          <div className="mt-6 grid gap-3 text-xs text-neutral-600 dark:text-neutral-300 sm:grid-cols-2 md:grid-cols-1">
            {(isEn
              ? ["Direct inbox, no newsletter list.", "Typical response: fast, with a 24-72 hour commitment."]
              : ["Bandeja directa, sin lista de boletines.", "Respuesta típica: rápida, con compromiso de 24-72 horas."]
            ).map((item) => (
              <div key={item} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-700 dark:text-emerald-300" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <Card interactive={false}>
          <CardInner className="space-y-3 text-xs text-neutral-700 dark:text-neutral-200">
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
              <input
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium">
                    {isEn ? "Name" : "Nombre"}
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 bg-white/80 px-3 py-2 text-xs outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 dark:border-neutral-700 dark:bg-neutral-950/70 dark:focus:border-emerald-300"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 bg-white/80 px-3 py-2 text-xs outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 dark:border-neutral-700 dark:bg-neutral-950/70 dark:focus:border-emerald-300"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium">
                  {isEn ? "Company" : "Empresa"}
                </label>
                <input
                  type="text"
                  name="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full rounded-md border border-neutral-200 bg-white/80 px-3 py-2 text-xs outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 dark:border-neutral-700 dark:bg-neutral-950/70 dark:focus:border-emerald-300"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium">
                  {isEn ? "Approximate number of employees" : "Número aproximado de empleados"}
                </label>
                <input
                  type="text"
                  name="employees"
                  value={employees}
                  onChange={(e) => setEmployees(e.target.value)}
                  className="w-full rounded-md border border-neutral-200 bg-white/80 px-3 py-2 text-xs outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 dark:border-neutral-700 dark:bg-neutral-950/70 dark:focus:border-emerald-300"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium">
                  {isEn
                    ? "What do you need help with?"
                    : "¿En qué necesitas ayuda?"}
                </label>
                <textarea
                  rows={4}
                  name="message"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[7rem] w-full rounded-md border border-neutral-200 bg-white/80 px-3 py-2 text-xs outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 dark:border-neutral-700 dark:bg-neutral-950/70 dark:focus:border-emerald-300"
                />
              </div>

              <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="submit"
                  disabled={submitStatus === "sending"}
                  className="whitespace-nowrap text-xs"
                >
                  {submitStatus === "sending"
                    ? isEn
                      ? "Sending..."
                      : "Enviando..."
                    : isEn
                      ? "Send message"
                      : "Enviar mensaje"}
                </Button>

                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 max-w-xs leading-tight">
                  {submitStatus === "success"
                    ? isEn
                      ? "Message sent. We’ll reply soon."
                      : "Mensaje enviado. Te responderemos pronto."
                    : submitStatus === "error"
                      ? isEn
                        ? "Something went wrong. Please try again."
                        : "Algo salió mal. Intenta nuevamente."
                      : isEn
                        ? "Your message goes directly to our inbox."
                        : "Tu mensaje llega directo a nuestra bandeja."}
                </span>
              </div>
            </form>
          </CardInner>
        </Card>
      </div>

      {successPopupOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-neutral-950/40 px-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-success-title"
            className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-5 text-neutral-900 shadow-xl dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50"
          >
            <h3 id="contact-success-title" className="text-base font-semibold">
              {isEn ? "Message sent" : "Mensaje enviado"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              {isEn
                ? "Thanks for reaching out. We’ll try to get back to you within 24-72 hours, although we usually respond fairly quickly."
                : "Gracias por escribirnos. Intentaremos responderte dentro de 24-72 horas, aunque normalmente respondemos bastante rápido."}
            </p>
            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                onClick={() => setSuccessPopupOpen(false)}
                className="px-4 py-2 text-xs"
              >
                {isEn ? "Close" : "Cerrar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// WhatsApp link constant must be defined before using it
const WHATSAPP_LINK =
  "https://wa.me/50769722528?text=Hi%20SafeGuard%20CCS%2C%20I%27d%20like%20to%20talk%20about%20my%20company%27s%20security.";

interface WhatsAppButtonProps {
  language: Language;
}

const Footer: React.FC<SectionProps> = ({ language }) => {
  const isEn = language === "en";

  return (
    <footer
      id="site-footer"
      className="relative z-10 border-t border-neutral-200/80 bg-white/75 pb-10 pt-6 text-xs text-neutral-500 backdrop-blur-sm dark:border-neutral-900/80 dark:bg-neutral-950/85 dark:text-neutral-400"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-1">
          <span>© {new Date().getFullYear()} SafeGuard CCS.</span>
          <p>
            {isEn
              ? "Cybersecurity consulting for small and mid-size companies."
              : "Consultoría de ciberseguridad para pequeñas y medianas empresas."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
            {isEn ? "Follow us" : "Síguenos"}
          </span>

          <a
            href="https://x.com/SafeguardCCCS"
            target="_blank"
            rel="noreferrer"
            className="flex h-7 w-7 items-center justify-center rounded-xl border border-neutral-300/70 bg-white/70 shadow-sm transition-all duration-300 ease-out hover:bg-neutral-100 dark:border-neutral-700/70 dark:bg-neutral-900/80 dark:hover:bg-neutral-800"
          >
            <SiX className="h-4 w-4 text-neutral-700 dark:text-neutral-200" />
          </a>

          <a
            href="https://www.instagram.com/safeguardccs"
            target="_blank"
            rel="noreferrer"
            className="flex h-7 w-7 items-center justify-center rounded-xl border border-neutral-300/70 bg-white/70 shadow-sm transition-all duration-300 ease-out hover:bg-neutral-100 dark:border-neutral-700/70 dark:bg-neutral-900/80 dark:hover:bg-neutral-800"
          >
            <SiInstagram className="h-4 w-4 text-neutral-700 dark:text-neutral-200" />
          </a>

          <a
            href="https://www.facebook.com/people/Safeguardccs/61584112651947/"
            target="_blank"
            rel="noreferrer"
            className="flex h-7 w-7 items-center justify-center rounded-xl border border-neutral-300/70 bg-white/70 shadow-sm transition-all duration-300 ease-out hover:bg-neutral-100 dark:border-neutral-700/70 dark:bg-neutral-900/80 dark:hover:bg-neutral-800"
          >
            <SiFacebook className="h-4 w-4 text-neutral-700 dark:text-neutral-200" />
          </a>

          {/* WhatsApp CTA inside the footer */}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all duration-300 ease-out hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            <SiWhatsapp className="h-4 w-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ language }) => {
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setFooterVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.05,
      }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const shouldHide = footerVisible;

  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noreferrer"
      className={`
        fixed bottom-5 right-4 z-50 inline-flex items-center gap-2 rounded-xl
        bg-neutral-950 px-4 py-2 text-xs font-medium text-white shadow-lg transition-all duration-300
        hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200
        ${shouldHide ? "opacity-0 translate-y-3 pointer-events-none" : "opacity-100"}
      `}
    >
      <SiWhatsapp className="h-4 w-4" />
      <span>WhatsApp</span>
    </a>
  );
};


export default App;
