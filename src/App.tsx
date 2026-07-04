import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  HardDrive,
  HeartPulse,
  Landmark,
  LockKeyhole,
  Menu,
  Moon,
  Network,
  Scale,
  ShieldCheck,
  Sun,
  TerminalSquare,
  X,
} from "lucide-react";
import { SiX, SiInstagram, SiFacebook } from "react-icons/si";


type SectionId = "home" | "services" | "approach" | "clients" | "contact";
type Theme = "light" | "dark";
type Language = "en" | "es";
type SubmitStatus = "idle" | "sending" | "success" | "error";

const SECTION_IDS: SectionId[] = ["home", "services", "approach", "clients", "contact"];
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

const Button: React.FC<ButtonProps> = ({ variant = "solid", className = "", ...props }) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 disabled:cursor-not-allowed disabled:opacity-60";
  const styles =
    variant === "solid"
      ? "bg-neutral-950 text-white shadow-sm hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-md dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
      : "border border-neutral-300 bg-white/80 text-neutral-900 hover:-translate-y-0.5 hover:border-neutral-900 hover:bg-white dark:border-neutral-700 dark:bg-neutral-950/70 dark:text-neutral-100 dark:hover:border-neutral-200 dark:hover:bg-neutral-900";
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
    ? "group hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-lg"
    : "";

  return (
    <div
      className={`rounded-lg border border-neutral-200 bg-white/85 shadow-sm backdrop-blur-sm transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-950/80 ${interactiveClasses} ${className}`}
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

  const linkBase =
    "relative rounded-md px-3 py-1.5 text-[11px] font-medium transition-all duration-200 sm:text-xs";
  const linkActive =
    "bg-neutral-950 text-neutral-50 shadow-sm dark:bg-neutral-100 dark:text-neutral-950";
  const linkInactive =
    "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-neutral-50";

  const LinkButton: React.FC<{ section: SectionId; children: React.ReactNode }> = ({
    section,
    children,
  }) => (
    <button
      type="button"
      onClick={() => onNavigate(section)}
      className={`${linkBase} ${activeSection === section ? linkActive : linkInactive}`}
    >
      {children}
    </button>
  );

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
          <nav className="hidden items-center gap-1 rounded-lg border border-neutral-200 bg-white/75 px-1 py-1 text-[11px] shadow-sm backdrop-blur md:flex dark:border-neutral-800 dark:bg-neutral-950/75">
            <LinkButton section="home">
              {isEn ? "Home" : "Inicio"}
            </LinkButton>
            <LinkButton section="services">
              {isEn ? "What we do" : "Qué hacemos"}
            </LinkButton>
            <LinkButton section="approach">
              {isEn ? "Why trust us" : "Por qué confiar"}
            </LinkButton>
            <LinkButton section="clients">
              {isEn ? "Who we work with" : "Con quién trabajamos"}
            </LinkButton>
            <LinkButton section="contact">
              {isEn ? "Contact" : "Contacto"}
            </LinkButton>
          </nav>

          {/* Language + theme */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center rounded-md border border-neutral-300/70 bg-white/80 p-0.5 text-[11px] shadow-sm dark:border-neutral-700/70 dark:bg-neutral-900/80">
              <button
                type="button"
                onClick={onToggleLanguage}
                className={
                  "px-2 py-0.5 rounded-full transition-all " +
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
                  "px-2 py-0.5 rounded-full transition-all " +
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
              className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-300/70 bg-white/80 text-sm shadow-sm transition hover:bg-neutral-100 dark:border-neutral-700/70 dark:bg-neutral-900/80 dark:hover:bg-neutral-800"
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
              className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-300/70 bg-white/80 text-sm shadow-sm md:hidden dark:border-neutral-700/70 dark:bg-neutral-900/80"
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
              {isEn ? "What we do" : "Qué hacemos"}
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
      className={`transition-all duration-500 ease-out motion-reduce:transition-none ${
        isActive
          ? "relative opacity-100 translate-y-0"
          : "pointer-events-none absolute inset-0 opacity-0 translate-y-3"
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
  <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.055)_1px,transparent_1px)] bg-[size:44px_44px] opacity-70 dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.075)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.075)_1px,transparent_1px)]" />
    <div className="ambient-sweep absolute left-1/2 top-0 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full border border-emerald-500/10 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),rgba(14,165,233,0.05)_36%,transparent_68%)] blur-sm dark:border-emerald-300/10 dark:bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.13),rgba(14,165,233,0.06)_36%,transparent_68%)]" />
    <div className="network-drift absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent dark:via-emerald-300/25" />
    <div className="network-drift network-drift-delay absolute bottom-28 left-0 h-px w-full bg-gradient-to-r from-transparent via-sky-500/25 to-transparent dark:via-sky-300/20" />
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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f7f8f5] text-neutral-950 transition-colors duration-300 dark:bg-[#050706] dark:text-neutral-50">
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
      <main className="relative mx-auto flex w-full max-w-6xl flex-1 items-center overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
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
        ? "Work directly with senior engineers who understand business risk, not a call-center handoff."
        : "Trabaja directamente con ingenieros senior que entienden el riesgo del negocio, no con un traspaso de call center.",
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

        <h1 className="mt-5 max-w-[12ch] text-5xl font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5rem]">
          {isEn ? "Make your IT safer without stopping work." : "Haz tu TI más segura sin frenar el trabajo."}
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

      <div className="security-console relative hidden overflow-hidden rounded-lg border border-neutral-200 bg-neutral-950 p-5 text-neutral-100 shadow-2xl shadow-neutral-950/10 lg:block dark:border-neutral-800">
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">
              {isEn ? "Risk overview" : "Vista de riesgo"}
            </p>
            <p className="mt-1 text-sm font-semibold">
              {isEn ? "Operational baseline" : "Base operacional"}
            </p>
          </div>
          <ShieldCheck className="h-5 w-5 text-emerald-300" />
        </div>
        <div className="space-y-4">
          {[
            isEn ? "Access exposure" : "Exposición de accesos",
            isEn ? "Server hardening" : "Endurecimiento",
            isEn ? "Backup recovery" : "Recuperación",
          ].map((item, index) => (
            <div key={item} className="grid grid-cols-[1fr_auto] items-center gap-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-neutral-300">{item}</span>
                  <span className="font-mono text-[11px] text-emerald-300">
                    {index === 0 ? "MAPPED" : index === 1 ? "ACTIVE" : "TESTED"}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="console-meter h-full rounded-full bg-emerald-300"
                    style={{ width: `${index === 0 ? 78 : index === 1 ? 64 : 86}%` }}
                  />
                </div>
              </div>
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-md border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <TerminalSquare className="h-4 w-4 text-emerald-300" />
            <span>{isEn ? "Clear next action" : "Siguiente acción clara"}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-neutral-200">
            {isEn
              ? "Prioritize the controls that reduce downtime, account compromise, and data loss first."
              : "Priorizar primero los controles que reducen caídas, compromiso de cuentas y pérdida de datos."}
          </p>
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
      title: isEn ? "Security assessment" : "Evaluación de seguridad",
      description: isEn
        ? "Map servers, users, remote access, and internet exposure into a clear risk picture."
        : "Mapeamos servidores, usuarios, acceso remoto y exposición a internet en una imagen clara de riesgo.",
      points: isEn
        ? [
            "Critical systems and access paths",
            "Admin accounts and remote entry points",
            "Plain-language risk summary",
          ]
        : [
            "Sistemas críticos y rutas de acceso",
            "Cuentas admin y accesos remotos",
            "Resumen de riesgo en lenguaje claro",
          ],
    },
    {
      icon: LockKeyhole,
      tag: isEn ? "Harden" : "Endurecer",
      title: isEn ? "Infrastructure hardening" : "Endurecimiento de infraestructura",
      description: isEn
        ? "Improve the controls that reduce compromise risk without slowing everyday work."
        : "Mejoramos los controles que reducen riesgo de compromiso sin frenar el trabajo diario.",
      points: isEn
        ? [
            "Windows and Linux baseline controls",
            "Admin separation and account hygiene",
            "Monitoring that leaves useful evidence",
          ]
        : [
            "Controles base en Windows y Linux",
            "Separación admin e higiene de cuentas",
            "Monitoreo con evidencia útil",
          ],
    },
    {
      icon: HardDrive,
      tag: isEn ? "Recover" : "Recuperar",
      title: isEn ? "Backup and recovery planning" : "Planificación de respaldos",
      description: isEn
        ? "Design recovery expectations that management can understand and the team can test."
        : "Diseñamos expectativas de recuperación que gerencia entiende y el equipo puede probar.",
      points: isEn
        ? [
            "What cannot be lost",
            "Recovery priorities and time targets",
            "Small restore tests",
          ]
        : [
            "Qué no se puede perder",
            "Prioridades y tiempos de recuperación",
            "Pruebas pequeñas de restauración",
          ],
    },
  ];

  return (
    <div className="py-4 sm:py-6">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
          {isEn ? "Services" : "Servicios"}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {isEn ? "What we do for you" : "Qué hacemos por tu empresa"}
        </h2>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
          {isEn
            ? "External security engineering for companies that need practical progress, not endless audit theater."
            : "Ingeniería de seguridad externa para empresas que necesitan avance práctico, no auditorías interminables."}
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
  const trustItems = [
    {
      icon: FileCheck2,
      label: isEn ? "Written recommendations" : "Recomendaciones escritas",
      copy: isEn
        ? "Every engagement ends with decisions your team can track, approve, and revisit."
        : "Cada servicio termina con decisiones que tu equipo puede seguir, aprobar y revisar.",
    },
    {
      icon: ShieldCheck,
      label: isEn ? "Risk before tools" : "Riesgo antes que herramientas",
      copy: isEn
        ? "We focus on the controls that meaningfully reduce exposure before suggesting purchases."
        : "Nos enfocamos en controles que reducen exposición antes de sugerir compras.",
    },
    {
      icon: ClipboardCheck,
      label: isEn ? "Operator mindset" : "Mentalidad operativa",
      copy: isEn
        ? "Recommendations are designed for the people who will maintain them after the project."
        : "Las recomendaciones se diseñan para quienes las mantendrán después del proyecto.",
    },
  ];

  return (
    <div className="py-4 sm:py-6">
      <div className="grid gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] md:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
            {isEn ? "Trust model" : "Modelo de confianza"}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {isEn ? "Why trust SafeGuard CCS" : "Por qué confiar en SafeGuard CCS"}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            {isEn
              ? "You get senior security thinking translated into operational changes a small or mid-size business can actually maintain."
              : "Recibes criterio senior de seguridad traducido en cambios operativos que una pyme realmente puede mantener."}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1">
          {trustItems.map(({ icon: Icon, label, copy }) => (
            <Card key={label} interactive={false}>
              <CardInner className="flex gap-4 text-neutral-700 dark:text-neutral-200">
                <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700 dark:text-emerald-300" />
                <div>
                  <h3 className="text-sm font-semibold">{label}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {copy}
                  </p>
                </div>
              </CardInner>
            </Card>
          ))}
        </div>
      </div>

      <CertCarousel language={language} />
    </div>
  );
};

const CertCarousel: React.FC<SectionProps> = ({ language }) => {
  const isEn = language === "en";

  if (certLogos.length === 0) {
    return null;
  }

  const [index, setIndex] = useState(0);
  const total = certLogos.length;

  // how many to show each side of the active one
  const visibleRange = 3;
  const FRAME_SIZE = 140;   // matches the h-[140px] w-[140px] wrapper
  const GAP = 20;           // extra space between frames
  const spacing = FRAME_SIZE + GAP; // 160 px total
  // Auto-advance every 5s, reset whenever index changes (including arrow clicks)
  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 5000);

    return () => window.clearInterval(id);
  }, [total, index]);

  const goNext = () => setIndex((prev) => (prev + 1) % total);
  const goPrev = () => setIndex((prev) => (prev - 1 + total) % total);

  // circular signed offset so it wraps nicely
  const getOffset = (i: number, current: number, length: number) => {
    let diff = i - current;
    if (diff > length / 2) diff -= length;
    if (diff < -length / 2) diff += length;
    return diff;
  };

  return (
    <div className="mt-8 w-full rounded-lg border border-neutral-200 bg-white/80 px-3 py-3 text-xs shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/75">
      <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
        {isEn ? "Certifications & training" : "Certificaciones y formación"}
      </div>

      {/* Tight viewport around the 100px logos */}
      <div className="relative h-[140px] w-full flex items-center justify-center overflow-hidden sm:h-[150px]">
        {/* Prev button */}
        <button
          type="button"
          onClick={goPrev}
          aria-label={isEn ? "Previous certification" : "Certificación anterior"}
          className="absolute left-1 z-10 flex h-7 w-7 items-center justify-center rounded-md border border-neutral-300/70 bg-white/80 text-[14px] text-neutral-700 shadow-sm transition hover:bg-neutral-100 dark:border-neutral-700/70 dark:bg-neutral-900/80 dark:text-neutral-100 dark:hover:bg-neutral-800"
        >
          ‹
        </button>

        {/* Next button */}
        <button
          type="button"
          onClick={goNext}
          aria-label={isEn ? "Next certification" : "Siguiente certificación"}
          className="absolute right-1 z-10 flex h-7 w-7 items-center justify-center rounded-md border border-neutral-300/70 bg-white/80 text-[14px] text-neutral-700 shadow-sm transition hover:bg-neutral-100 dark:border-neutral-700/70 dark:bg-neutral-900/80 dark:text-neutral-100 dark:hover:bg-neutral-800"
        >
          ›
        </button>

        {/* Slides */}
        <div className="relative h-full w-full">
          {certLogos.map((logo, i) => {
            const offset = getOffset(i, index, total);

            if (Math.abs(offset) > visibleRange) {
              return null; // too far from center
            }

            const isActive = offset === 0;
            const isNear = Math.abs(offset) === 1;

            const scale = isActive ? 1 : isNear ? 0.85 : 0.7;
            const opacity = isActive ? 1 : isNear ? 0.6 : 0.3;
            const translateX = offset * spacing;

              return (
                <div
                  key={logo.src}
                  className="absolute left-1/2 top-1/2 flex transform-gpu items-center justify-center transition-all duration-500 ease-out"
                  style={{
                    // center by width & height, then apply horizontal offset + scale
                    transform: `translateX(-50%) translateY(-50%) translateX(${translateX}px) scale(${scale})`,
                    opacity,
                    zIndex: visibleRange + 1 - Math.abs(offset),
                  }}
                >
                <div
                  className="
                    flex h-[140px] w-[140px] items-center justify-center
                    rounded-lg border
                    border-neutral-300/60 bg-white/60
                    shadow-sm backdrop-blur-sm
                    dark:border-neutral-700/60 dark:bg-neutral-900/60
                  "
                >
                  <img
                    src={logo.src}
                    alt=""
                    className="h-[100px] w-[100px] object-contain"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};





const ClientsSection: React.FC<SectionProps> = ({ language }) => {
  const isEn = language === "en";

  const goodFit = isEn
    ? [
        "You handle sensitive client data.",
        "You already use servers or cloud.",
        "You want clearer security without a full team.",
      ]
    : [
        "Manejas datos sensibles de clientes.",
        "Ya usas servidores o servicios en la nube.",
        "Quieres más claridad sin un equipo de seguridad completo.",
      ];

  const notIdeal = isEn
    ? [
        "Purely consumer-facing apps only.",
        "No access to decision-makers.",
      ]
    : [
        "Solo apps de consumo sin más infraestructura.",
        "Sin acceso a quienes toman decisiones.",
      ];

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
          title: "Other organizations",
          desc: "Any small or mid-size business that needs clarity and better protection.",
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
          desc: "Cualquier empresa pequeña o mediana que necesite claridad y protección.",
        },
      ];

  return (
    <div className="py-4 sm:py-6">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
            {isEn ? "Client fit" : "Encaje"}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {isEn ? "Who we are a good fit for" : "Con quién encajamos mejor"}
          </h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
            {isEn
              ? "SafeGuard CCS works best with service-driven businesses that hold sensitive client information and want clearer security without drowning in jargon."
              : "SafeGuard CCS funciona mejor con negocios de servicios que manejan información sensible de clientes y quieren más claridad en seguridad sin ahogarse en jerga técnica."}
          </p>
        </div>

        <Card interactive={false}>
          <CardInner className="grid gap-4 text-sm text-neutral-700 dark:text-neutral-200 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                {isEn ? "GOOD FIT" : "BUEN ENCAJE"}
              </p>
              <ul className="mt-2 space-y-1.5 text-xs">
                {goodFit.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                {isEn ? "NOT IDEAL" : "NO TAN IDEAL"}
              </p>
              <ul className="mt-2 space-y-1.5 text-xs">
                {notIdeal.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardInner>
        </Card>
      </div>
      <div className="my-6 flex items-center justify-center">
        <span className="text-center text-sm font-medium text-neutral-600 dark:text-neutral-300">
          {isEn
            ? "If your business handles sensitive information or depends on uptime, we can help."
            : "Si tu negocio maneja información sensible o depende del tiempo activo, podemos ayudarte."}
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
      className="border-t border-neutral-200/80 bg-white/75 pb-10 pt-6 text-xs text-neutral-500 backdrop-blur-sm dark:border-neutral-900/80 dark:bg-neutral-950/85 dark:text-neutral-400"
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
            className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-300/70 bg-white/70 shadow-sm transition hover:-translate-y-0.5 hover:bg-neutral-100 dark:border-neutral-700/70 dark:bg-neutral-900/80 dark:hover:bg-neutral-800"
          >
            <SiX className="h-4 w-4 text-neutral-700 dark:text-neutral-200" />
          </a>

          <a
            href="https://www.instagram.com/safeguardccs"
            target="_blank"
            rel="noreferrer"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-300/70 bg-white/70 shadow-sm transition hover:-translate-y-0.5 hover:bg-neutral-100 dark:border-neutral-700/70 dark:bg-neutral-900/80 dark:hover:bg-neutral-800"
          >
            <SiInstagram className="h-4 w-4 text-neutral-700 dark:text-neutral-200" />
          </a>

          <a
            href="https://www.facebook.com/people/Safeguardccs/61584112651947/"
            target="_blank"
            rel="noreferrer"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-300/70 bg-white/70 shadow-sm transition hover:-translate-y-0.5 hover:bg-neutral-100 dark:border-neutral-700/70 dark:bg-neutral-900/80 dark:hover:bg-neutral-800"
          >
            <SiFacebook className="h-4 w-4 text-neutral-700 dark:text-neutral-200" />
          </a>

          {/* WhatsApp CTA inside the footer */}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-neutral-950 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            <span>WhatsApp</span>
            <span className="hidden sm:inline">
              {isEn ? "Chat with us" : "Escríbenos"}
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
};

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ language }) => {
  const isEn = language === "en";
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
        fixed bottom-5 right-4 z-50 inline-flex items-center gap-2 rounded-md
        bg-neutral-950 px-4 py-2 text-xs font-medium text-white shadow-lg transition-all duration-300
        hover:-translate-y-0.5 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200
        ${shouldHide ? "opacity-0 translate-y-3 pointer-events-none" : "opacity-100"}
      `}
    >
      <span>WhatsApp</span>
      <span className="hidden sm:inline">
        {isEn ? "Chat with us" : "Escríbenos"}
      </span>
    </a>
  );
};


export default App;
