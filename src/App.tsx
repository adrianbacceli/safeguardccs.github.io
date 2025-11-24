import React, { useEffect, useState } from "react";
import { Moon, Sun} from "lucide-react";
import { SiX, SiInstagram, SiFacebook } from "react-icons/si";


type SectionId = "home" | "services" | "approach" | "clients" | "contact";
type Theme = "light" | "dark";
type Language = "en" | "es";

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

const linkBase =
  "relative text-[11px] sm:text-xs rounded-full px-3 py-1 transition-all duration-150 whitespace-nowrap";
  
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
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs sm:text-sm font-medium transition-all duration-200";
  const styles =
    variant === "solid"
      ? "bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow-sm hover:shadow-md hover:brightness-110 dark:from-emerald-400 dark:to-sky-400"
      : "border border-neutral-300/70 bg-white/60 text-neutral-800 hover:bg-white dark:border-neutral-700/70 dark:bg-neutral-900/60 dark:text-neutral-100 dark:hover:bg-neutral-900";
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
      className={`rounded-3xl border border-neutral-200/70 bg-white/70 p-[1px] shadow-sm backdrop-blur-sm transition-all duration-300 dark:border-neutral-800/70 dark:bg-neutral-950/60 ${interactiveClasses} ${className}`}
      {...props}
    />
  );
};

const CardInner: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", ...props }) => (
  <div
    className={`h-full rounded-[1.35rem] bg-gradient-to-br from-white/90 via-white/60 to-emerald-50/30 p-5 text-sm dark:from-neutral-950/90 dark:via-neutral-950/60 dark:to-emerald-950/20 ${className}`}
    {...props}
  />
);

const Stat: React.FC<{ value: number; label: string; suffix?: string }> = ({ value, label, suffix }) => (
  <div className="rounded-2xl border border-emerald-100/70 bg-emerald-50/60 px-4 py-3 text-left text-xs shadow-sm backdrop-blur-sm dark:border-emerald-900/70 dark:bg-emerald-950/40">
    <div className="text-2xl font-semibold leading-none text-emerald-800 dark:text-emerald-200">
      {value}
      {suffix && (
        <span className="ml-0.5 text-base font-normal text-emerald-500 dark:text-emerald-300">
          {suffix}
        </span>
      )}
    </div>
    <p className="mt-1 text-[11px] text-emerald-900/80 dark:text-emerald-100/80">{label}</p>
  </div>
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
    "relative text-[11px] sm:text-xs rounded-full px-3 py-1 transition-all duration-150";
  const linkActive =
    "bg-neutral-900 text-neutral-50 shadow-sm dark:bg-neutral-100 dark:text-neutral-900";
  const linkInactive =
    "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-50";

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
    <header className="sticky top-0 z-50 border-b border-neutral-200/60 bg-white/80 backdrop-blur-xl dark:border-neutral-800/60 dark:bg-neutral-950/80">
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
          <nav className="hidden md:flex items-center gap-2 rounded-full border border-neutral-200/70 bg-white/70 px-1.5 py-1 text-[11px] shadow-sm backdrop-blur dark:border-neutral-700/70 dark:bg-neutral-950/70">
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
            <div className="flex items-center rounded-full border border-neutral-300/70 bg-white/80 p-0.5 text-[11px] shadow-sm dark:border-neutral-700/70 dark:bg-neutral-900/80">
              <button
                type="button"
                onClick={onToggleLanguage}
                className={
                  "px-2 py-0.5 rounded-full transition-all " +
                  (language === "en"
                    ? "bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900"
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
                    ? "bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900"
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
              className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300/70 bg-white/80 text-sm shadow-sm transition hover:bg-neutral-100 dark:border-neutral-700/70 dark:bg-neutral-900/80 dark:hover:bg-neutral-800"
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
              className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300/70 bg-white/80 text-sm shadow-sm md:hidden dark:border-neutral-700/70 dark:bg-neutral-900/80"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown nav – only below md */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-200/70 bg-white/95 px-4 py-3 shadow-sm backdrop-blur dark:border-neutral-800/70 dark:bg-neutral-950/95">
          <div className="flex flex-col gap-2 text-sm">
            <button
              onClick={() => {
                onNavigate("home");
                setMobileOpen(false);
              }}
            >
              {isEn ? "Home" : "Inicio"}
            </button>
            <button
              onClick={() => {
                onNavigate("services");
                setMobileOpen(false);
              }}
            >
              {isEn ? "What we do" : "Qué hacemos"}
            </button>
            <button
              onClick={() => {
                onNavigate("approach");
                setMobileOpen(false);
              }}
            >
              {isEn ? "Why trust us" : "Por qué confiar"}
            </button>
            <button
              onClick={() => {
                onNavigate("clients");
                setMobileOpen(false);
              }}
            >
              {isEn ? "Who we work with" : "Con quién trabajamos"}
            </button>
            <button
              onClick={() => {
                onNavigate("contact");
                setMobileOpen(false);
              }}
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
      className={`transition-all duration-300 ${
        isActive
          ? "relative opacity-100 translate-y-0"
          : "pointer-events-none absolute inset-0 opacity-0 -translate-y-2"
      }`}
    >
      {children}
    </section>
  );
};

interface SectionProps {
  language: Language;
}

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState<Language>("en");
  const [activeSection, setActiveSection] = useState<SectionId>("home");

  const handleNavigate = (section: SectionId) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleLanguage = () =>
    setLanguage((lang) => (lang === "en" ? "es" : "en"));

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 text-neutral-900 transition-colors duration-300 dark:bg-neutral-950 dark:text-neutral-50">
      {/* background blobs can stay as-is, just keep them absolutely positioned */}
      <div className="pointer-events-none absolute inset-x-0 top-[-10rem] -z-10 flex justify-center opacity-70">
        <div className="h-72 w-[40rem] rounded-full bg-gradient-to-br from-emerald-400/40 via-sky-400/30 to-transparent blur-3xl dark:from-emerald-500/30 dark:via-sky-500/20" />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-[-10rem] -z-10 hidden w-72 bg-gradient-to-b from-emerald-400/10 via-transparent to-transparent blur-3xl sm:block dark:from-emerald-400/10" />

      <Navbar
        theme={theme}
        language={language}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onToggleTheme={toggleTheme}
        onToggleLanguage={toggleLanguage}
      />

      {/* main takes remaining height */}
      <main className="relative mx-auto flex-1 max-w-6xl px-4 py-10 sm:px-6 sm:py-14 overflow-hidden">
        <div className="relative">
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

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/70 px-3 py-1 text-[11px] font-medium text-emerald-800 shadow-sm backdrop-blur-sm dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-100">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/90 text-[10px] text-white">
            ✓
          </span>
          <span>
            {isEn
              ? "Security help built for small and mid-size firms"
              : "Seguridad diseñada para pequeñas y medianas firmas"}
          </span>
        </div>

        <h1 className="mt-5 pb-1 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[2.9rem]">
          <span className="block">
            {isEn ? "Make your IT" : "Haz que tu TI"}
          </span>
          <span className="mt-1 block bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent leading-[1.4]">
            {isEn ? "safer without stopping work." : "sea más segura sin frenar el trabajo."}
          </span>
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-[15px]">
          {isEn
            ? "SafeGuard Cybersecurity Consulting Services helps accounting, legal and service firms reduce real-world risks: downtime, data loss and loss of client trust. We look at how you work today and improve it step by step."
            : "SafeGuard Cybersecurity Consulting Services ayuda a firmas contables, legales y de servicios a reducir riesgos reales: caídas, pérdida de datos y pérdida de confianza de los clientes. Vemos cómo trabajas hoy y mejoramos paso a paso."}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button onClick={() => onNavigate("contact")}>
            {isEn ? "Talk about your environment" : "Hablar de tu entorno"}
          </Button>
          <Button variant="outline" onClick={() => onNavigate("services")}>
            {isEn ? "See what we do" : "Ver qué hacemos"}
          </Button>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-[11px] text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>
              {isEn ? "Founder-led, no call center." : "Liderado por el fundador, sin call center."}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            <span>
              {isEn ? "Clear, written next steps." : "Siguientes pasos claros y por escrito."}
            </span>
          </div>
        </div>
        
        <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
          <Stat
            value={5}
            suffix="+"
            label={
              isEn ? "Years in infrastructure & security" : "Años en infraestructura y seguridad"
            }
          />
          <Stat
            value={40}
            suffix="+"
            label={
              isEn
                ? "Infrastructure projects"
                : "Proyectos de infraestructura"
            }
          />
          <Stat
            value={1}
            label={isEn ? "Clear roadmap per client" : "Hoja de ruta clara por cliente"}
          />
        </div>
        {/* Small visual feature badges */}
<div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
  <span className="rounded-full border border-neutral-200/70 bg-white/70 px-3 py-1 dark:border-neutral-700/70 dark:bg-neutral-900/70">
    Windows & Linux support
  </span>
  <span className="rounded-full border border-neutral-200/70 bg-white/70 px-3 py-1 dark:border-neutral-700/70 dark:bg-neutral-900/70">
    On-site & remote
  </span>
  <span className="rounded-full border border-neutral-200/70 bg-white/70 px-3 py-1 dark:border-neutral-700/70 dark:bg-neutral-900/70">
    English & Spanish
  </span>
</div>
      </div>

      <Card>
        <CardInner>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            {isEn ? "IN PRACTICAL TERMS" : "EN LA PRÁCTICA"}
          </p>

          {/* 3 compact rows instead of one text block */}
          <div className="mt-3 space-y-3 text-xs text-neutral-700 dark:text-neutral-200">
            <div className="flex gap-3">
              <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                1
              </span>
              <div>
                <p className="font-medium">
                  {isEn ? "We map how you work today" : "Mapeamos cómo trabajas hoy"}
                </p>
                <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                  {isEn
                    ? "Servers, users, remote access and backups in one clear picture."
                    : "Servidores, usuarios, accesos remotos y respaldos en una sola imagen clara."}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                2
              </span>
              <div>
                <p className="font-medium">
                  {isEn ? "We highlight the main weak spots" : "Señalamos los puntos débiles"}
                </p>
                <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                  {isEn
                    ? "In plain language: what could go wrong and how it would affect you."
                    : "En lenguaje sencillo: qué podría fallar y cómo te afectaría."}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                3
              </span>
              <div>
                <p className="font-medium">
                  {isEn ? "We give you a short, concrete plan" : "Te damos un plan corto y concreto"}
                </p>
                <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                  {isEn
                    ? "A handful of prioritized changes you can approve and track."
                    : "Un puñado de cambios priorizados que puedes aprobar y seguir."}
                </p>
              </div>
            </div>
          </div>

          {/* Little chips at the bottom to fill space nicely */}
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
            <span className="rounded-full border border-neutral-200/70 bg-white/70 px-3 py-1 dark:border-neutral-800/70 dark:bg-neutral-950/60">
              {isEn ? "Scheduled services" : "Servicios Programados"}
            </span>
            <span className="rounded-full border border-neutral-200/70 bg-white/70 px-3 py-1 dark:border-neutral-800/70 dark:bg-neutral-950/60">
              {isEn ? "Change control" : "Control de cambios"}
            </span>
            <span className="rounded-full border border-neutral-200/70 bg-white/70 px-3 py-1 dark:border-neutral-800/70 dark:bg-neutral-950/60">
              {isEn ? "Written reports" : "Reportes escritos"}
            </span>
          </div>
        </CardInner>
      </Card>
    </div>
  );
};

const ServicesSection: React.FC<SectionProps> = ({ language }) => {
  const isEn = language === "en";

  const services = [
    {
      tag: isEn ? "Step 1" : "Paso 1",
      title: isEn ? "Quick security scan of your environment" : "Escaneo rápido de seguridad de tu entorno",
      description: isEn
        ? "We review your servers, users and internet exposure to identify obvious weak spots that attackers love."
        : "Revisamos tus servidores, usuarios y exposición a internet para identificar puntos débiles evidentes que los atacantes aprovechan.",
      points: isEn
        ? [
            "Basic mapping of servers and critical systems",
            "Check who has admin access and from where",
            "Simple summary of main risks in plain language",
          ]
        : [
            "Mapeo básico de servidores y sistemas críticos",
            "Revisión de quién tiene acceso admin y desde dónde",
            "Resumen sencillo de los principales riesgos en lenguaje claro",
          ],
    },
    {
      tag: isEn ? "Step 2" : "Paso 2",
      title: isEn ? "What we fix together" : "Lo que corregimos contigo",
      description: isEn
        ? "We focus on a short list of changes that bring the most risk reduction for your size and budget."
        : "Nos enfocamos en una lista corta de cambios que reducen más riesgo según tu tamaño y presupuesto.",
      points: isEn
        ? [
            "Hardening of Windows servers and key services",
            "Better separation between normal and admin accounts",
            "Basic monitoring so problems leave a trace",
          ]
        : [
            "Endurecimiento de servidores Windows y servicios clave",
            "Mejor separación entre cuentas normales y administrativas",
            "Monitoreo básico para que los problemas dejen rastro",
          ],
    },
    {
      tag: isEn ? "Step 3" : "Paso 3",
      title: isEn ? "Backups you can trust" : "Respaldos en los que confías",
      description: isEn
        ? "We design a backup and recovery approach that matches your reality: on-prem, cloud or mixed."
        : "Diseñamos un enfoque de respaldo y recuperación que se adapte a tu realidad: local, nube o mixto.",
      points: isEn
        ? [
            "Define what absolutely cannot be lost",
            "Agree realistic recovery times with management",
            "Run small restore tests so you know it actually works",
          ]
        : [
            "Definimos qué absolutamente no se puede perder",
            "Acordamos tiempos de recuperación realistas con gerencia",
            "Hacemos pruebas pequeñas de restauración para saber que funciona",
          ],
    },
  ];

  return (
    <div className="py-4 sm:py-6">
      <div className="mb-8 max-w-3xl">
        <h2 className="text-3xl font-semibold tracking-tight">
          {isEn ? "What we do for you" : "Qué hacemos por tu empresa"}
        </h2>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
          {isEn
            ? "Think of SafeGuard Cybersecurity Consulting Services as your external security engineer. We translate technical risks into business impact and help you apply clear, concrete actions."
            : "Piensa en SafeGuard Cybersecurity Consulting Services como tu ingeniero de seguridad externo. Traducimos riesgos técnicos a impacto de negocio y te ayudamos a aplicar acciones claras y concretas."}
        </p>
      </div>
      
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-3 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-emerald-400/40 via-neutral-200/40 to-transparent sm:block dark:via-neutral-800/60" />
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title}>
              <CardInner className="flex flex-col">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50/80 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{service.tag}</span>
                </div>
                <h3 className="mt-3 text-sm font-semibold">{service.title}</h3>
                <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-300">
                  {service.description}
                </p>
                <ul className="mt-3 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                  {service.points.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-emerald-500" />
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
      <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-start">
        {/* Left: main copy */}
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">
            {isEn ? "Why trust SafeGuard CCS" : "Por qué confiar en SafeGuard CCS"}
          </h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
            {isEn
              ? "You don’t need a big security department. You need someone who understands enterprise standards but can sit down with the owner of a small or mid-size firm and talk clearly about risk."
              : "No necesitas un gran departamento de seguridad. Necesitas alguien que entienda los estándares empresariales pero pueda sentarse con el dueño de una pequeña o mediana firma y hablar claro sobre riesgo."}
          </p>

          <div className="mt-5 grid gap-3 text-sm text-neutral-700 dark:text-neutral-200">
            <div className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
              <p>
                <span className="font-semibold">
                  {isEn ? "Real-world projects · " : "Proyectos reales · "}
                </span>
                {isEn
                  ? "years working with servers, networks and security in demanding environments."
                  : "años trabajando con servidores, redes y seguridad en entornos exigentes."}
              </p>
            </div>
            <div className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
              <p>
                <span className="font-semibold">
                  {isEn ? "Practical risk focus · " : "Enfoque práctico · "}
                </span>
                {isEn
                  ? "we prioritize the few changes that clearly reduce risk instead of endless checklists."
                  : "priorizamos los pocos cambios que reducen claramente el riesgo en lugar de listas infinitas."}
              </p>
            </div>
            <div className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
              <p>
                <span className="font-semibold">
                  {isEn ? "Clear communication · " : "Comunicación clara · "}
                </span>
                {isEn
                  ? "you get simple explanations of what is happening, why it matters and what your options are."
                  : "recibes explicaciones sencillas de qué pasa, por qué importa y cuáles son tus opciones."}
              </p>
            </div>
          </div>
        </div>

        {/* Right: two compact cards */}
        <div className="space-y-4">
          <Card>
            <CardInner className="text-sm text-neutral-700 dark:text-neutral-200">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                {isEn ? "FOUNDER-LED" : "LIDERADO POR EL FUNDADOR"}
              </p>
              <p className="mt-2">
                {isEn
                  ? "You work directly with the founders, the engineer team doing the assessment and solution design—no layers of account managers."
                  : "Trabajas directamente con los fundadores, el equipo de ingenieros que hace la evaluación y diseña la solución, sin capas de intermediarios."}
              </p>
            </CardInner>
          </Card>
          <Card>
            <CardInner className="text-sm text-neutral-700 dark:text-neutral-200">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                {isEn ? "DESIGNED FOR SMBS" : "DISEÑADO PARA PYMES"}
              </p>
              <p className="mt-2">
                {isEn
                  ? "The goal is not “perfect security”, but a solid, maintainable baseline that matches your size, budget and team."
                  : "La meta no es una “seguridad perfecta”, sino una base sólida y mantenible que se ajusta a tu tamaño, presupuesto y equipo."}
              </p>
            </CardInner>
          </Card>
        </div>
      </div>

      {/* Certifications slider */}
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
    <div className="mt-6 w-full rounded-2xl border border-neutral-200/70 bg-white/80 px-3 py-3 text-xs shadow-sm backdrop-blur-sm dark:border-neutral-800/70 dark:bg-neutral-950/80">
      <div className="mb-2 text-[11px] text-neutral-500 dark:text-neutral-400">
        {isEn ? "Certifications & training" : "Certificaciones y formación"}
      </div>

      {/* Tight viewport around the 100px logos */}
      <div className="relative h-[140px] w-full flex items-center justify-center overflow-hidden sm:h-[150px]">
        {/* Prev button */}
        <button
          type="button"
          onClick={goPrev}
          aria-label={isEn ? "Previous certification" : "Certificación anterior"}
          className="absolute left-1 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300/70 bg-white/80 text-[14px] text-neutral-700 shadow-sm transition hover:bg-neutral-100 dark:border-neutral-700/70 dark:bg-neutral-900/80 dark:text-neutral-100 dark:hover:bg-neutral-800"
        >
          ‹
        </button>

        {/* Next button */}
        <button
          type="button"
          onClick={goNext}
          aria-label={isEn ? "Next certification" : "Siguiente certificación"}
          className="absolute right-1 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300/70 bg-white/80 text-[14px] text-neutral-700 shadow-sm transition hover:bg-neutral-100 dark:border-neutral-700/70 dark:bg-neutral-900/80 dark:text-neutral-100 dark:hover:bg-neutral-800"
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
                    rounded-2xl border
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
          icon: "📊",
          title: "Accounting & tax firms",
          desc: "Teams that handle sensitive financial reports and client records.",
        },
        {
          icon: "⚖️",
          title: "Legal & compliance practices",
          desc: "Boutiques and independent professionals managing confidential cases.",
        },
        {
          icon: "💼",
          title: "Professional services",
          desc: "Consultants, advisors and service firms with client-facing workloads.",
        },
        {
          icon: "🏥",
          title: "Health & wellness clinics",
          desc: "Small clinics or providers who store basic patient data.",
        },
        {
          icon: "🏪",
          title: "Small retail & local businesses",
          desc: "Shops that rely on POS systems, WiFi networks or cloud tools.",
        },
        {
          icon: "🧩",
          title: "Other organizations",
          desc: "Any small or mid-size business that needs clarity and better protection.",
        },
      ]
    : [
        {
          icon: "📊",
          title: "Firmas contables y fiscales",
          desc: "Equipos que manejan reportes financieros y datos sensibles de clientes.",
        },
        {
          icon: "⚖️",
          title: "Firmas legales y de cumplimiento",
          desc: "Pequeños bufetes que gestionan casos confidenciales.",
        },
        {
          icon: "💼",
          title: "Servicios profesionales",
          desc: "Consultores, asesores y firmas que dependen del manejo de clientes.",
        },
        {
          icon: "🏥",
          title: "Clínicas de salud y bienestar",
          desc: "Pequeñas clínicas que almacenan datos básicos de pacientes.",
        },
        {
          icon: "🏪",
          title: "Pequeños comercios",
          desc: "Negocios que dependen de POS, redes WiFi o herramientas en la nube.",
        },
        {
          icon: "🧩",
          title: "Otros negocios",
          desc: "Cualquier empresa pequeña o mediana que necesite claridad y protección.",
        },
      ];

  return (
    <div className="py-4 sm:py-6">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-start">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">
            {isEn ? "Who we are a good fit for" : "Con quién encajamos mejor"}
          </h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
            {isEn
              ? "SafeGuard CCS works best with service-driven businesses that hold sensitive client information and want clearer security without drowning in jargon."
              : "SafeGuard CCS funciona mejor con negocios de servicios que manejan información sensible de clientes y quieren más claridad en seguridad sin ahogarse en jerga técnica."}
          </p>
        </div>

        {/* Top card: static */}
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
        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
          {isEn
            ? "If your business handles sensitive information or depends on uptime, we can help."
            : "Si tu negocio maneja información sensible o depende del tiempo activo, podemos ayudarte."}
        </span>
      </div>
      {/* Bottom cards container with spacing + subtle frame */}
      <div className="mt-10 rounded-3xl border border-neutral-200/70 bg-white/60 p-4 shadow-sm backdrop-blur-sm sm:p-5 dark:border-neutral-800/70 dark:bg-neutral-950/60">
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {industries.map((item) => (
            <Card key={item.title}>
              <CardInner className="flex h-full flex-col items-start p-5 text-neutral-700 dark:text-neutral-200">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100/70 text-xl dark:bg-emerald-900/40">
                  {item.icon}
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = isEn
      ? `SafeGuard CCS – Inquiry from ${name || "Potential client"}`
      : `SafeGuard CCS – Consulta de ${name || "Cliente potencial"}`;

    const bodyLines = [
      isEn ? "Hi SafeGuard CCS," : "Hola SafeGuard CCS,",
      "",
      isEn ? "Here are my details:" : "Estos son mis datos:",
      `Name / Nombre: ${name || "-"}`,
      `Email: ${email || "-"}`,
      `Company / Empresa: ${company || "-"}`,
      `Employees / Empleados: ${employees || "-"}`,
      "",
      isEn ? "What I need help with:" : "En qué necesito ayuda:",
      message || "-",
      "",
      isEn ? "Best regards," : "Saludos,",
      name || "",
    ];

    const mailto = `mailto:consulting@safeguardccs.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    window.location.href = mailto;
  };

  return (
    <div className="py-4 sm:py-6">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-start">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">
            {isEn ? "Tell us about your environment" : "Cuéntanos sobre tu entorno"}
          </h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
            {isEn
              ? "Share a short description and we’ll reply with whether we’re a good fit and what a first engagement could look like."
              : "Cuéntanos brevemente tu situación y te responderemos indicando si somos un buen ajuste y cómo podría verse un primer servicio."}
          </p>
          <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
            {isEn
              ? "We don’t send newsletters or add you to lists. Your message goes directly to our inbox."
              : "No enviamos boletines ni te agregamos a listas. Tu mensaje llega directo a nuestra bandeja."}
          </p>
        </div>

        <Card interactive={false}>
          <CardInner className="space-y-3 text-xs text-neutral-700 dark:text-neutral-200">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium">
                    {isEn ? "Name" : "Nombre"}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200/70 bg-white/80 px-3 py-2 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40 dark:border-neutral-700/70 dark:bg-neutral-950/70"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200/70 bg-white/80 px-3 py-2 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40 dark:border-neutral-700/70 dark:bg-neutral-950/70"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium">
                  {isEn ? "Company" : "Empresa"}
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200/70 bg-white/80 px-3 py-2 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40 dark:border-neutral-700/70 dark:bg-neutral-950/70"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium">
                  {isEn ? "Approximate number of employees" : "Número aproximado de empleados"}
                </label>
                <input
                  type="text"
                  value={employees}
                  onChange={(e) => setEmployees(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200/70 bg-white/80 px-3 py-2 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40 dark:border-neutral-700/70 dark:bg-neutral-950/70"
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
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200/70 bg-white/80 px-3 py-2 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40 dark:border-neutral-700/70 dark:bg-neutral-950/70"
                />
              </div>

              <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="submit"
                  className="text-xs whitespace-nowrap"
                >
                  {isEn ? "Open email with this info" : "Abrir correo con esta información"}
                </Button>

                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 max-w-xs leading-tight">
                  {isEn
                    ? "Your email app will open to send it."
                    : "Se abrirá tu app de correo para enviarlo."}
                </span>
              </div>
            </form>
          </CardInner>
        </Card>
      </div>
    </div>
  );
};

// WhatsApp link constant must be defined before using it
const WHATSAPP_LINK =
  "https://wa.me/50765125606?text=Hi%20SafeGuard%20CCS%2C%20I%27d%20like%20to%20talk%20about%20my%20company%27s%20security.";

interface WhatsAppButtonProps {
  language: Language;
}

const Footer: React.FC<SectionProps> = ({ language }) => {
  const isEn = language === "en";

  return (
    <footer
      id="site-footer"
      className="border-t border-neutral-100/70 bg-white/80 pt-6 pb-10 text-xs text-neutral-500 backdrop-blur-sm dark:border-neutral-900/70 dark:bg-neutral-950/90 dark:text-neutral-400"
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
            className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300/70 bg-white/70 shadow-sm transition hover:bg-neutral-100 dark:border-neutral-700/70 dark:bg-neutral-900/80 dark:hover:bg-neutral-800"
          >
            <SiX className="h-4 w-4 text-neutral-700 dark:text-neutral-200" />
          </a>

          <a
            href="https://www.instagram.com/safeguardccs"
            target="_blank"
            rel="noreferrer"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300/70 bg-white/70 shadow-sm transition hover:bg-neutral-100 dark:border-neutral-700/70 dark:bg-neutral-900/80 dark:hover:bg-neutral-800"
          >
            <SiInstagram className="h-4 w-4 text-neutral-700 dark:text-neutral-200" />
          </a>

          <a
            href="https://www.facebook.com/people/Safeguardccs/61584112651947/"
            target="_blank"
            rel="noreferrer"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300/70 bg-white/70 shadow-sm transition hover:bg-neutral-100 dark:border-neutral-700/70 dark:bg-neutral-900/80 dark:hover:bg-neutral-800"
          >
            <SiFacebook className="h-4 w-4 text-neutral-700 dark:text-neutral-200" />
          </a>

          {/* WhatsApp CTA inside the footer */}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-emerald-600"
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
        fixed right-4 bottom-5 z-50 inline-flex items-center gap-2 rounded-full
        bg-emerald-500 px-4 py-2 text-xs font-medium text-white shadow-lg transition-all duration-300
        hover:bg-emerald-600
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
