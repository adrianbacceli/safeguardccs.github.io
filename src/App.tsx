import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Building2,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
  LockKeyhole,
  Mail,
  Menu,
  Moon,
  Network,
  Send,
  Sun,
  X,
} from "lucide-react";
import { SiX, SiInstagram, SiFacebook, SiWhatsapp } from "react-icons/si";


type SectionId = "home" | "services" | "approach" | "threats" | "faq" | "contact";
type Theme = "light" | "dark";
type Language = "en" | "es";
type FaqId = "about" | "services" | "audience" | "topics" | "frameworks" | "data-sources" | "ransomware" | "contact";
type SubmitStatus = "idle" | "sending" | "success" | "error";
type ContactMode = "methods" | "form";
type RedirectTarget = {
  label: string;
  href: string;
  kind: "whatsapp" | "email";
};
type ResearchTopic = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: Record<Language, string>;
  keywords: Record<Language, string[]>;
};

const SECTION_IDS: SectionId[] = ["home", "threats", "services", "approach", "faq", "contact"];
const WEB3FORMS_ACCESS_KEY = "b15631e6-e590-4acf-9085-ff56b23526b7";
const CONTACT_EMAIL = "consulting@safeguardccs.com";
const MESSAGE_WORD_LIMIT = 120;
const MOBILE_CERT_AUTOPLAY_MS = 5000;
const researchTopics: ResearchTopic[] = [
  {
    id: "business-security-research",
    icon: Building2,
    title: {
      en: "Emerging businesses",
      es: "Negocios emergentes",
    },
    keywords: {
      en: ["Awareness", "Risk", "Data protection"],
      es: ["Concientización", "Riesgo", "Protección de datos"],
    },
  },
  {
    id: "security-literacy",
    icon: LockKeyhole,
    title: {
      en: "Security basics",
      es: "Seguridad básica",
    },
    keywords: {
      en: ["Phishing", "Passwords", "MFA", "Backups"],
      es: ["Phishing", "Contraseñas", "MFA", "Respaldos"],
    },
  },
  {
    id: "framework-translation",
    icon: Activity,
    title: {
      en: "Public frameworks",
      es: "Marcos públicos",
    },
    keywords: {
      en: ["Guidance", "Literacy", "Resilience"],
      es: ["Orientación", "Alfabetización", "Resiliencia"],
    },
  },
];
function getWordCount(value: string): number {
  const words = value.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

function limitWords(value: string, limit: number): string {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length <= limit) return value;
  return words.slice(0, limit).join(" ");
}

function isSectionId(value: string): value is SectionId {
  return SECTION_IDS.includes(value as SectionId);
}

function getHashSection(): SectionId {
  if (typeof window === "undefined") return "home";
  const hash = window.location.hash.replace("#", "").toLowerCase();
  return isSectionId(hash) ? hash : "home";
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    root.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#020617" : "#f8fafc");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggleTheme };
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline";
}

interface AnchorButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "solid" | "outline";
}

const certLogoModules = import.meta.glob(
  "/src/assets/certs/*.{svg,png,jpg,jpeg}",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

interface CredentialMeta {
  file: string;
  title: string;
  description: {
    en: string;
    es: string;
  };
}

interface CredentialLogo extends CredentialMeta {
  src: string;
}

const credentialMetadata: CredentialMeta[] = [
  {
    file: "blob (1).png",
    title: "Dell Technologies Certified Cloud Infrastructure and Services Foundations 2023",
    description: {
      en: "Validates foundational knowledge of cloud infrastructure, service models, virtualization, storage, networking, and operational concepts in Dell environments.",
      es: "Valida conocimiento base de infraestructura cloud, modelos de servicio, virtualización, almacenamiento, redes y operación en entornos Dell.",
    },
  },
  {
    file: "blob (2).png",
    title: "Dell Technologies Certified PowerEdge XE Operate",
    description: {
      en: "Covers operation and support knowledge for Dell PowerEdge XE systems used in high-performance, data-intensive, and accelerated workloads.",
      es: "Cubre operación y soporte de sistemas Dell PowerEdge XE usados en cargas de alto rendimiento, datos intensivos y cómputo acelerado.",
    },
  },
  {
    file: "blob (3).png",
    title: "Dell Technologies Proven Professional Prompt Engineering Achievement",
    description: {
      en: "Recognizes practical prompt engineering skills for working with generative AI systems, instructions, context, and reliable output patterns.",
      es: "Reconoce habilidades prácticas de prompt engineering para trabajar con IA generativa, instrucciones, contexto y patrones de salida confiables.",
    },
  },
  {
    file: "blob.png",
    title: "Dell Technologies Proven Professional",
    description: {
      en: "Represents Dell Technologies Proven Professional participation across enterprise infrastructure, services, support, and technical certification paths.",
      es: "Representa participación en Dell Technologies Proven Professional en rutas de infraestructura empresarial, servicios, soporte y certificación técnica.",
    },
  },
  {
    file: "image(10).png",
    title: "Google Cloud Cybersecurity Certificate",
    description: {
      en: "Covers cloud security fundamentals, risk awareness, threat detection concepts, security operations, and practical Google Cloud cybersecurity foundations.",
      es: "Cubre fundamentos de seguridad cloud, conciencia de riesgo, detección de amenazas, operaciones de seguridad y bases prácticas de ciberseguridad en Google Cloud.",
    },
  },
  {
    file: "image(2).png",
    title: "VMware Certified Professional - Data Center Virtualization 2023",
    description: {
      en: "Validates VMware data center virtualization skills across vSphere administration, compute, storage, networking, and operational platform management.",
      es: "Valida habilidades de virtualización de centros de datos VMware en administración vSphere, cómputo, almacenamiento, redes y gestión operativa.",
    },
  },
  {
    file: "image(3).png",
    title: "Dell Technologies Proven Professional Security Foundations Achievement",
    description: {
      en: "Recognizes foundational security knowledge across core concepts, risk, controls, and secure practices for technology environments.",
      es: "Reconoce conocimiento base de seguridad en conceptos centrales, riesgo, controles y prácticas seguras para entornos tecnológicos.",
    },
  },
  {
    file: "image(4).png",
    title: "Dell Technologies Certified Information Storage and Management Foundations 2023",
    description: {
      en: "Validates storage fundamentals including data protection, storage architecture, availability, resilience, and information management concepts.",
      es: "Valida fundamentos de almacenamiento, incluyendo protección de datos, arquitectura, disponibilidad, resiliencia y gestión de información.",
    },
  },
  {
    file: "image(5).png",
    title: "Dell Technologies Proven Professional Exam Developer 2024",
    description: {
      en: "Recognizes contribution to Dell Technologies exam development through technical review, assessment design, and certification-quality validation.",
      es: "Reconoce contribución al desarrollo de exámenes Dell Technologies mediante revisión técnica, diseño de evaluación y validación de calidad.",
    },
  },
  {
    file: "image(6).png",
    title: "Dell Technologies Certified Networking Design",
    description: {
      en: "Validates design knowledge for enterprise networking, connectivity patterns, architecture choices, and infrastructure planning.",
      es: "Valida conocimiento de diseño de redes empresariales, patrones de conectividad, decisiones de arquitectura y planificación de infraestructura.",
    },
  },
  {
    file: "image(7).png",
    title: "Dell Technologies Proven Professional GenAI Foundations Achievement",
    description: {
      en: "Recognizes foundational understanding of generative AI concepts, use cases, responsible adoption, and enterprise AI considerations.",
      es: "Reconoce comprensión base de IA generativa, casos de uso, adopción responsable y consideraciones empresariales de IA.",
    },
  },
  {
    file: "image(8).png",
    title: "Dell Technologies Proven Professional PowerProtect DP Series Appliances Achievement",
    description: {
      en: "Covers Dell PowerProtect DP Series appliance concepts for integrated backup, recovery, protection workflows, and operational readiness.",
      es: "Cubre conceptos de appliances Dell PowerProtect DP Series para respaldo integrado, recuperación, protección y preparación operativa.",
    },
  },
  {
    file: "image(9).png",
    title: "Dell Technologies Proven Professional PowerProtect DP Series Appliances DP4400 Achievement",
    description: {
      en: "Focuses on Dell PowerProtect DP4400 appliance concepts, deployment awareness, operations, and data protection workflows.",
      es: "Se enfoca en conceptos del appliance Dell PowerProtect DP4400, despliegue, operación y flujos de protección de datos.",
    },
  },
  {
    file: "Associate_Badge_-_Information_Storage_and_Management.png",
    title: "Dell Technologies Certified Associate - Information Storage and Management",
    description: {
      en: "Validates associate-level knowledge of information storage, data protection, storage networking, cloud storage, and management concepts.",
      es: "Valida conocimiento de nivel asociado en almacenamiento de información, protección de datos, redes de almacenamiento, cloud storage y gestión.",
    },
  },
  {
    file: "Associate_Badge_-_Networking.png",
    title: "Dell Technologies Certified Associate - Networking",
    description: {
      en: "Validates associate-level networking knowledge across connectivity, switching, routing, infrastructure design, and operational fundamentals.",
      es: "Valida conocimiento de nivel asociado en conectividad, switching, routing, diseño de infraestructura y fundamentos operativos.",
    },
  },
  {
    file: "Associate_Badge_-_PowerEdge.png",
    title: "Dell Technologies Certified Associate - PowerEdge",
    description: {
      en: "Validates associate-level PowerEdge server knowledge across architecture, deployment, management, maintenance, and enterprise operations.",
      es: "Valida conocimiento de nivel asociado en servidores PowerEdge: arquitectura, despliegue, gestión, mantenimiento y operación empresarial.",
    },
  },
  {
    file: "Specialist_Badge_-_Implementation_Engineer_PowerEdge.png",
    title: "Dell Technologies Certified Specialist - Implementation Engineer PowerEdge",
    description: {
      en: "Validates specialist implementation knowledge for Dell PowerEdge systems, including planning, deployment, configuration, and operational handoff.",
      es: "Valida conocimiento especializado de implementación de Dell PowerEdge, incluyendo planificación, despliegue, configuración y traspaso operativo.",
    },
  },
  {
    file: "nutanix-oem-badge_Nutanix_Technology_Champions-2020-squaresmall.png",
    title: "Nutanix Technology Champion 2020",
    description: {
      en: "Recognizes Nutanix platform advocacy and technical engagement around hybrid cloud, virtualization, infrastructure, and operational modernization.",
      es: "Reconoce participación técnica y evangelización de Nutanix en hybrid cloud, virtualización, infraestructura y modernización operativa.",
    },
  },
];

const certLogos: CredentialLogo[] = credentialMetadata.flatMap((credential) => {
  const src = certLogoModules[`/src/assets/certs/${credential.file}`];
  if (!src) {
    return [];
  }

  return {
    ...credential,
    src,
  };
});

interface ThreatStat {
  id?: "ransomware";
  value: string;
  animatedValue?: number;
  format?: "compact" | "percent";
  durationMs?: number;
  precision?: number;
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
    animatedValue: 4000000000,
    format: "compact",
    durationMs: 1500,
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
    value: "1.3B",
    animatedValue: 1291000000,
    format: "compact",
    durationMs: 1500,
    label: {
      en: "Phishing blocks in Latin America",
      es: "Bloqueos de phishing en Latinoamérica",
    },
    context: {
      en: "Kaspersky reported 1.291 billion phishing blocks in Latin America over 12 months, up 85%, averaging more than 2,400 attacks per minute.",
      es: "Kaspersky reportó 1.291 mil millones de bloqueos de phishing en Latinoamérica en 12 meses, un aumento de 85%, con más de 2,400 ataques por minuto en promedio.",
    },
    sourceName: "Kaspersky Threat Panorama",
    sourceUrl: "https://latam.kaspersky.com/about/press-releases/ataques-con-mensajes-falsos-aumentan-85-en-america-latina-mas-de-12-mil-millones-de-casos-detectados-kaspersky",
    year: "2025",
  },
  {
    value: "1.1T+",
    animatedValue: 1100000000000,
    format: "compact",
    durationMs: 1600,
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
    id: "ransomware",
    value: "1.1M+",
    animatedValue: 1100000,
    format: "compact",
    durationMs: 1400,
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

const regionalSnapshotStats: ThreatStat[] = [
  threatStats[0],
  {
    value: "2.40K",
    animatedValue: 2400,
    format: "compact",
    durationMs: 60000,
    precision: 2,
    label: {
      en: "More than 2,400 attacks per minute in Latin America",
      es: "Mas de 2,400 ataques por minuto en Latinoamerica",
    },
    context: {
      en: "Kaspersky reported more than 2,400 phishing attacks per minute in Latin America.",
      es: "Kaspersky reportó más de 2,400 ataques de phishing por minuto en Latinoamérica.",
    },
    sourceName: "Kaspersky Threat Panorama",
    sourceUrl: "https://latam.kaspersky.com/about/press-releases/ataques-con-mensajes-falsos-aumentan-85-en-america-latina-mas-de-12-mil-millones-de-casos-detectados-kaspersky",
    year: "2025",
  },
  threatStats[2],
  threatStats[3],
];

function formatCompactNumber(value: number, precision?: number): string {
  const units = [
    { threshold: 1_000_000_000_000, suffix: "T" },
    { threshold: 1_000_000_000, suffix: "B" },
    { threshold: 1_000_000, suffix: "M" },
    { threshold: 1_000, suffix: "K" },
  ];
  const unit = units.find((item) => value >= item.threshold);

  if (!unit) return Math.round(value).toLocaleString("en-US");

  const scaled = value / unit.threshold;
  const decimals = precision ?? (scaled >= 100 ? 0 : scaled >= 10 ? 1 : 1);
  return `${scaled.toFixed(decimals).replace(/\.0$/, "")}${unit.suffix}`;
}

function easeOutCubic(value: number): number {
  return 1 - Math.pow(1 - value, 3);
}

function useCountUp(target: number, durationMs: number, isActive: boolean): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    let animationFrame = 0;
    const startedAt = performance.now();
    setValue(0);

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / durationMs, 1);
      setValue(target * easeOutCubic(progress));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [durationMs, isActive, target]);

  return value;
}

interface CountUpValueProps {
  target: number;
  durationMs: number;
  isActive: boolean;
  format?: "compact" | "percent";
  precision?: number;
  prefix?: string;
  suffix?: string;
}

const CountUpValue: React.FC<CountUpValueProps> = ({
  target,
  durationMs,
  isActive,
  format = "compact",
  precision,
  prefix = "",
  suffix = "",
}) => {
  const value = useCountUp(target, durationMs, isActive);
  const roundedValue = Math.round(value);
  const formatted =
    format === "percent"
      ? `${roundedValue}%`
      : formatCompactNumber(roundedValue, precision);

  return <>{`${prefix}${formatted}${suffix}`}</>;
};

const Button: React.FC<ButtonProps> = ({ variant = "solid", className = "", ...props }) => {
  const base =
    "group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 disabled:cursor-not-allowed disabled:opacity-60";
  const styles =
    variant === "solid"
      ? "bg-neutral-950 text-white shadow-sm hover:bg-neutral-800 hover:shadow-md dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
      : "border border-neutral-300 bg-white/80 text-neutral-900 hover:border-neutral-900 hover:bg-white dark:border-neutral-700 dark:bg-neutral-950/70 dark:text-neutral-100 dark:hover:border-neutral-200 dark:hover:bg-neutral-900";
  return <button className={`${base} ${styles} ${className}`} {...props} />;
};

const AnchorButton: React.FC<AnchorButtonProps> = ({
  variant = "solid",
  className = "",
  ...props
}) => {
  const base =
    "group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60";
  const styles =
    variant === "solid"
      ? "bg-neutral-950 text-white shadow-sm hover:bg-neutral-800 hover:shadow-md dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
      : "border border-neutral-300 bg-white/80 text-neutral-900 hover:border-neutral-900 hover:bg-white dark:border-neutral-700 dark:bg-neutral-950/70 dark:text-neutral-100 dark:hover:border-neutral-200 dark:hover:bg-neutral-900";
  return <a className={`${base} ${styles} ${className}`} {...props} />;
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
    { section: "threats", label: isEn ? "Emerging threats" : "Amenazas actuales" },
    { section: "services", label: isEn ? "Research" : "Investigación" },
    { section: "approach", label: isEn ? "Background" : "Trayectoria" },
    { section: "faq", label: "FAQ" },
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
      <a
        href={`#${section}`}
        onClick={(event) => {
          event.preventDefault();
          onNavigate(section);
        }}
        aria-current={isActive ? "page" : undefined}
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
      </a>
    );
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200/80 bg-white/85 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-950/85">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <a
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            onNavigate("home");
          }}
          className="flex items-center gap-2"
        >
          <img
            src={theme === "dark" ? "/logo_white.svg" : "/logo.svg"}
            alt="SafeGuard CCS logo"
            className="h-7 w-auto sm:h-8"
          />
        </a>

        {/* Right side: nav + toggles + mobile button */}
        <div className="flex items-center gap-2">
          {/* Desktop nav – only from md and up */}
          <LayoutGroup id="desktop-nav">
            <nav className="relative hidden h-10 items-center gap-1 overflow-hidden rounded-xl border border-neutral-200 bg-white/75 px-1 text-[11px] shadow-sm backdrop-blur md:flex dark:border-neutral-800 dark:bg-neutral-950/75">
              {navItems.map((item) => (
                <LinkButton key={item.section} section={item.section}>
                  {item.label}
                </LinkButton>
              ))}
            </nav>
          </LayoutGroup>

          {/* Language + theme */}
          <div className="flex h-10 items-center gap-2 text-xs">
            <div className="flex h-10 items-center rounded-xl border border-neutral-300/70 bg-white/80 p-0.5 text-[11px] shadow-sm dark:border-neutral-700/70 dark:bg-neutral-900/80">
              <button
                type="button"
                onClick={onToggleLanguage}
                className={
                  "flex h-8 items-center rounded-[0.625rem] px-2 transition-all duration-300 ease-out active:scale-[0.98] " +
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
                  "flex h-8 items-center rounded-[0.625rem] px-2 transition-all duration-300 ease-out active:scale-[0.98] " +
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
            <a
              href="#home"
              onClick={(event) => {
                event.preventDefault();
                onNavigate("home");
                setMobileOpen(false);
              }}
              className="rounded-md px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              {isEn ? "Home" : "Inicio"}
            </a>
            <a
              href="#threats"
              onClick={(event) => {
                event.preventDefault();
                onNavigate("threats");
                setMobileOpen(false);
              }}
              className="rounded-md px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              {isEn ? "Emerging threats" : "Amenazas actuales"}
            </a>
            <a
              href="#services"
              onClick={(event) => {
                event.preventDefault();
                onNavigate("services");
                setMobileOpen(false);
              }}
              className="rounded-md px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              {isEn ? "Research" : "Investigación"}
            </a>
            <a
              href="#approach"
              onClick={(event) => {
                event.preventDefault();
                onNavigate("approach");
                setMobileOpen(false);
              }}
              className="rounded-md px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              {isEn ? "Background" : "Trayectoria"}
            </a>
            <a
              href="#faq"
              onClick={(event) => {
                event.preventDefault();
                onNavigate("faq");
                setMobileOpen(false);
              }}
              className="rounded-md px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              FAQ
            </a>
            <a
              href="#contact"
              onClick={(event) => {
                event.preventDefault();
                onNavigate("contact");
                setMobileOpen(false);
              }}
              className="rounded-md px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              {isEn ? "Contact" : "Contacto"}
            </a>
          </div>
        </div>
      )}
    </header>

  );
};


interface SectionProps {
  language: Language;
}

interface ActiveSectionProps extends SectionProps {
  isActive: boolean;
}

interface MobileTopBarProps {
  theme: Theme;
  language: Language;
  onNavigate: (section: SectionId) => void;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
}

interface MobileSectionIndicatorProps {
  language: Language;
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
}

const sectionLabels: Record<SectionId, { en: string; es: string }> = {
  home: { en: "Home", es: "Inicio" },
  services: { en: "Research", es: "Investigación" },
  approach: { en: "Background", es: "Trayectoria" },
  threats: { en: "Emerging threats", es: "Amenazas actuales" },
  faq: { en: "FAQ", es: "Preguntas frecuentes" },
  contact: { en: "Contact", es: "Contacto" },
};

const MobileTopBar: React.FC<MobileTopBarProps> = ({
  theme,
  language,
  onNavigate,
  onToggleTheme,
  onToggleLanguage,
}) => (
  <div className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200/80 bg-white/88 px-4 py-3 backdrop-blur-xl md:hidden dark:border-neutral-800/80 dark:bg-neutral-950/88">
    <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
      <a
        href="#home"
        onClick={(event) => {
          event.preventDefault();
          onNavigate("home");
        }}
        className="flex items-center"
      >
        <img
          src={theme === "dark" ? "/logo_white.svg" : "/logo.svg"}
          alt="SafeGuard CCS logo"
          className="h-7 w-auto"
        />
      </a>
      <div className="flex items-center gap-2">
        <div className="flex h-9 items-center rounded-xl border border-neutral-300/70 bg-white/80 p-0.5 text-[11px] shadow-sm dark:border-neutral-700/70 dark:bg-neutral-900/80">
          <button
            type="button"
            onClick={onToggleLanguage}
            className={
              "flex h-7 items-center rounded-[0.625rem] px-2 transition-all duration-300 ease-out active:scale-[0.98] " +
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
              "flex h-7 items-center rounded-[0.625rem] px-2 transition-all duration-300 ease-out active:scale-[0.98] " +
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
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-300/70 bg-white/80 text-sm shadow-sm transition-all duration-300 ease-out hover:bg-neutral-100 active:scale-[0.98] dark:border-neutral-700/70 dark:bg-neutral-900/80 dark:hover:bg-neutral-800"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  </div>
);

const MobileSectionIndicator: React.FC<MobileSectionIndicatorProps> = ({
  language,
  activeSection,
  onNavigate,
}) => {
  const isEn = language === "en";

  return (
    <nav
      aria-label={isEn ? "Mobile section navigation" : "Navegación móvil por secciones"}
      className="fixed right-2 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-2 rounded-full border border-neutral-200/80 bg-white/75 p-1.5 shadow-sm backdrop-blur md:hidden dark:border-neutral-800/80 dark:bg-neutral-950/75"
    >
      {SECTION_IDS.map((section) => {
        const isActive = activeSection === section;
        const label = sectionLabels[section][language];

        return (
          <motion.a
            key={section}
            href={`#${section}`}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(section);
            }}
            aria-label={isEn ? `Go to ${label}` : `Ir a ${label}`}
            aria-current={isActive ? "true" : undefined}
            initial={false}
            animate={{
              opacity: isActive ? 1 : 0.42,
              scale: isActive ? 1.35 : 1,
            }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={`h-2.5 w-2.5 rounded-full ${
              isActive
                ? "bg-emerald-700 shadow-[0_0_0_4px_rgba(4,120,87,0.12)] dark:bg-emerald-300 dark:shadow-[0_0_0_4px_rgba(110,231,183,0.12)]"
                : "bg-neutral-300 hover:bg-neutral-500 dark:bg-neutral-700 dark:hover:bg-neutral-500"
            }`}
          />
        );
      })}
    </nav>
  );
};

const BackgroundSystem: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const speedResetRef = useRef<number>();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let animationFrame = 0;
    let lastFrame = performance.now();
    let phase = 0;
    const current = {
      gridPointerX: 0,
      gridPointerY: 0,
      nodePointerX: 0,
      nodePointerY: 0,
      gridScrollShift: 0,
      nodeScrollShift: 0,
      speed: 1,
    };
    const target = { ...current };

    const setSpeed = (speed: number) => {
      target.speed = speed;
      window.clearTimeout(speedResetRef.current);
      speedResetRef.current = window.setTimeout(() => {
        target.speed = 1;
      }, 220);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;

      target.gridPointerX = -18 * x;
      target.gridPointerY = -14 * y;
      target.nodePointerX = 26 * x;
      target.nodePointerY = 22 * y;
      setSpeed(3);
    };

    const handleScroll = () => {
      const scrollProgress =
        window.scrollY /
        Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);

      target.gridScrollShift = scrollProgress * 120;
      target.nodeScrollShift = scrollProgress * -40;
      setSpeed(3.6);
    };

    const tick = (now: number) => {
      const delta = Math.min(now - lastFrame, 48) / 1000;
      lastFrame = now;

      current.speed += (target.speed - current.speed) * 0.08;
      current.gridPointerX += (target.gridPointerX - current.gridPointerX) * 0.1;
      current.gridPointerY += (target.gridPointerY - current.gridPointerY) * 0.1;
      current.nodePointerX += (target.nodePointerX - current.nodePointerX) * 0.1;
      current.nodePointerY += (target.nodePointerY - current.nodePointerY) * 0.1;
      current.gridScrollShift += (target.gridScrollShift - current.gridScrollShift) * 0.08;
      current.nodeScrollShift += (target.nodeScrollShift - current.nodeScrollShift) * 0.08;

      phase += delta * current.speed;
      const gridX = (phase * 5.5) % 88;
      const gridY = (phase * 2.75) % 44;
      const nodeX = Math.sin(phase * 0.22) * 26;
      const nodeY = Math.cos(phase * 0.19) * 20;
      const nodeRotate = Math.sin(phase * 0.16) * 0.8;

      root.style.setProperty("--grid-bg-x", `${gridX.toFixed(2)}px`);
      root.style.setProperty("--grid-bg-y", `${gridY.toFixed(2)}px`);
      root.style.setProperty("--grid-pointer-x", `${current.gridPointerX.toFixed(2)}px`);
      root.style.setProperty("--grid-pointer-y", `${current.gridPointerY.toFixed(2)}px`);
      root.style.setProperty("--grid-scroll-shift", `${current.gridScrollShift.toFixed(2)}px`);
      root.style.setProperty("--node-auto-x", `${nodeX.toFixed(2)}px`);
      root.style.setProperty("--node-auto-y", `${nodeY.toFixed(2)}px`);
      root.style.setProperty("--node-rotate", `${nodeRotate.toFixed(3)}deg`);
      root.style.setProperty("--node-pointer-x", `${current.nodePointerX.toFixed(2)}px`);
      root.style.setProperty("--node-pointer-y", `${current.nodePointerY.toFixed(2)}px`);
      root.style.setProperty("--node-scroll-shift", `${current.nodeScrollShift.toFixed(2)}px`);

      animationFrame = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    animationFrame = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
      window.clearTimeout(speedResetRef.current);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="background-system pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="background-grid absolute inset-[-5rem] bg-[linear-gradient(to_right,rgba(15,23,42,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.07)_1px,transparent_1px)] bg-[size:44px_44px] opacity-80 dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.1)_1px,transparent_1px)]" />
      <div className="ambient-sweep background-ambient absolute left-1/2 top-0 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full border border-emerald-500/10 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),rgba(14,165,233,0.05)_36%,transparent_68%)] blur-sm dark:border-emerald-300/10 dark:bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.13),rgba(14,165,233,0.06)_36%,transparent_68%)]" />
      <div className="node-field background-node-field absolute inset-[-4rem] opacity-60 dark:opacity-50">
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
};

const LandingSection: React.FC<{
  id: SectionId;
  className?: string;
  children: React.ReactNode;
}> = ({ id, className = "", children }) => (
  <section
    id={id}
    data-section={id}
    className={`flex min-h-[calc(100svh-4rem)] scroll-mt-16 items-center justify-center py-10 sm:py-12 md:block md:min-h-0 md:scroll-mt-20 md:py-16 lg:py-20 ${className}`}
  >
    {children}
  </section>
);

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState<Language>("en");
  const [activeSection, setActiveSection] = useState<SectionId>(() => getHashSection());
  const [mobileActiveSection, setMobileActiveSection] = useState<SectionId>("home");
  const [focusedFaq, setFocusedFaq] = useState<{ id: FaqId; request: number } | null>(null);
  const programmaticTargetRef = useRef<SectionId | null>(null);
  const programmaticTimerRef = useRef<number | null>(null);
  const programmaticFrameRef = useRef<number | null>(null);

  const getScrollOffset = () =>
    window.matchMedia("(min-width: 768px)").matches ? 56 : 64;

  const getSectionTop = (section: SectionId): number | null => {
    const target = document.getElementById(section);
    if (!target) return null;

    const rawTop = target.getBoundingClientRect().top + window.scrollY - getScrollOffset();
    const maxTop = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    ) - window.innerHeight;

    return Math.max(0, Math.min(rawTop, maxTop));
  };

  const scrollWindowTo = (top: number, options: { behavior?: ScrollBehavior } = {}) => {
    const maxTop = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    ) - window.innerHeight;
    const targetTop = Math.max(0, Math.min(top, maxTop));
    const behavior = prefersReducedMotion() ? "auto" : options.behavior ?? "smooth";

    window.scrollTo({ top: targetTop, behavior });
  };

  const clearProgrammaticNavigation = () => {
    if (programmaticTimerRef.current) {
      window.clearTimeout(programmaticTimerRef.current);
      programmaticTimerRef.current = null;
    }

    if (programmaticFrameRef.current) {
      window.cancelAnimationFrame(programmaticFrameRef.current);
      programmaticFrameRef.current = null;
    }
  };

  const finishProgrammaticNavigation = (section: SectionId) => {
    clearProgrammaticNavigation();
    programmaticTargetRef.current = null;
    setActiveSection(section);
    setMobileActiveSection(section);

    if (window.location.hash !== `#${section}`) {
      window.history.replaceState(null, "", `#${section}`);
    }
  };

  const watchProgrammaticNavigation = (section: SectionId) => {
    clearProgrammaticNavigation();

    const tick = () => {
      if (programmaticTargetRef.current !== section) return;

      const targetTop = getSectionTop(section);
      if (targetTop === null || Math.abs(window.scrollY - targetTop) <= 2) {
        finishProgrammaticNavigation(section);
        return;
      }

      programmaticFrameRef.current = window.requestAnimationFrame(tick);
    };

    programmaticFrameRef.current = window.requestAnimationFrame(tick);
    programmaticTimerRef.current = window.setTimeout(() => {
      if (programmaticTargetRef.current === section) {
        finishProgrammaticNavigation(section);
      }
    }, prefersReducedMotion() ? 80 : 1800);
  };

  const handleNavigate = (section: SectionId) => {
    const top = getSectionTop(section);
    if (top === null) return;

    if (window.location.hash !== `#${section}`) {
      window.history.pushState(null, "", `#${section}`);
    }

    programmaticTargetRef.current = section;
    watchProgrammaticNavigation(section);
    scrollWindowTo(top);
  };

  useEffect(() => {
    const syncSectionFromHash = () => {
      clearProgrammaticNavigation();
      programmaticTargetRef.current = null;

      const section = getHashSection();
      const target = document.getElementById(section);

      setActiveSection(section);
      setMobileActiveSection(section);

      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - getScrollOffset();
        scrollWindowTo(top, { behavior: "auto" });
      }
    };

    if (window.location.hash) {
      window.requestAnimationFrame(syncSectionFromHash);
    }

    window.addEventListener("hashchange", syncSectionFromHash);
    return () => window.removeEventListener("hashchange", syncSectionFromHash);
  }, []);

  useEffect(() => {
    const sections = SECTION_IDS
      .map((section) => document.getElementById(section))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    let animationFrame = 0;

    const syncActiveSection = () => {
      animationFrame = 0;
      if (programmaticTargetRef.current) return;

      const readingLine = window.innerHeight * 0.36;
      const current =
        [...sections]
          .reverse()
          .find((section) => section.getBoundingClientRect().top <= readingLine) ||
        sections[0];
      const section = current.id;

      if (isSectionId(section)) {
        setActiveSection(section);
        setMobileActiveSection(section);

        if (window.location.hash !== `#${section}`) {
          window.history.replaceState(null, "", `#${section}`);
        }
      }
    };

    const scheduleSync = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(syncActiveSection);
    };

    scheduleSync();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
    };
  }, []);

  useEffect(() => {
    return () => {
      clearProgrammaticNavigation();
    };
  }, []);

  const handleMobileNavigate = (section: SectionId) => {
    handleNavigate(section);
  };

  const handleOpenFaq = (faqId: FaqId) => {
    setFocusedFaq((current) => ({ id: faqId, request: (current?.request ?? 0) + 1 }));
    handleNavigate("faq");
  };

  const toggleLanguage = () =>
    setLanguage((lang) => (lang === "en" ? "es" : "en"));

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-x-hidden bg-[#f7f8f5] text-neutral-950 transition-colors duration-300 dark:bg-[#050706] dark:text-neutral-50">
      <BackgroundSystem />

      <div className="hidden md:contents">
        <Navbar
          theme={theme}
          language={language}
          activeSection={activeSection}
          onNavigate={handleNavigate}
          onToggleTheme={toggleTheme}
          onToggleLanguage={toggleLanguage}
        />
      </div>

      <MobileTopBar
        theme={theme}
        language={language}
        onNavigate={handleMobileNavigate}
        onToggleTheme={toggleTheme}
        onToggleLanguage={toggleLanguage}
      />

      <MobileSectionIndicator
        language={language}
        activeSection={mobileActiveSection}
        onNavigate={handleMobileNavigate}
      />

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-12 pt-16 sm:px-6 md:pt-14">
        <LandingSection id="home" className="md:flex md:min-h-[calc(100svh-3.5rem)] md:items-center">
          <HeroSection
            language={language}
            isActive={activeSection === "home"}
            onNavigate={handleNavigate}
            onOpenFaq={handleOpenFaq}
          />
        </LandingSection>

        <LandingSection id="threats">
          <div className="md:hidden">
            <MobileThreatSnapshot
              language={language}
              isActive={activeSection === "threats"}
              onOpenFaq={handleOpenFaq}
            />
          </div>
          <div className="hidden md:block">
            <ThreatsSection
              language={language}
              isActive={activeSection === "threats"}
              onOpenFaq={handleOpenFaq}
            />
          </div>
        </LandingSection>

        <LandingSection id="services">
          <ServicesSection language={language} />
        </LandingSection>

        <LandingSection id="approach">
          <ApproachSection language={language} />
        </LandingSection>

        <LandingSection id="faq">
          <FAQSection language={language} focusedFaq={focusedFaq} />
        </LandingSection>

        <LandingSection id="contact" className="pb-16">
          <ContactSection language={language} />
        </LandingSection>
      </main>

      <Footer language={language} />
      <WhatsAppButton language={language} />
    </div>
  );
};

interface HeroSectionProps {
  language: Language;
  isActive: boolean;
  onNavigate: (section: SectionId) => void;
  onOpenFaq: (faqId: FaqId) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ language, isActive, onNavigate, onOpenFaq }) => {
  const isEn = language === "en";
  const consoleStats = regionalSnapshotStats;
  const heroPoints = [
    {
      icon: LockKeyhole,
      label: isEn ? "Independent research" : "Investigación independiente",
    },
    {
      icon: Building2,
      label: isEn ? "SME awareness" : "Concientización para pymes",
    },
    {
      icon: Network,
      label: isEn ? "Practical cyber hygiene" : "Higiene cibernética práctica",
    },
  ];

  return (
    <div className="grid w-full justify-items-center gap-8 text-center lg:grid-cols-[minmax(0,1.12fr)_420px] lg:items-center lg:justify-items-stretch lg:text-left xl:gap-12">
      <div className="mx-auto max-w-4xl lg:mx-0">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-300">
          {isEn ? "Cybersecurity research · Panama" : "Investigación en ciberseguridad · Panamá"}
        </p>

        <h1 className="mx-auto mt-5 max-w-[11ch] text-5xl font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:mx-0 lg:text-7xl xl:text-[5rem]">
          {isEn ? "Security, made clearer." : "Seguridad, más clara."}
        </h1>

        <ul className="mx-auto mt-7 max-w-3xl space-y-4 text-left text-sm leading-relaxed text-neutral-700 dark:text-neutral-200 lg:mx-0 lg:text-base">
          {heroPoints.map(({ icon: Icon, label }) => (
            <li key={label} className="flex gap-3">
              <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700 dark:text-emerald-300" />
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
          <AnchorButton
            href="#contact"
            onClick={(event) => {
              event.preventDefault();
              onNavigate("contact");
            }}
            className="lg:px-6 lg:py-3"
          >
            {isEn ? "Contact" : "Contacto"}
            <ArrowDown className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-y-0.5" />
          </AnchorButton>
          <AnchorButton
            href="#services"
            variant="outline"
            onClick={(event) => {
              event.preventDefault();
              onNavigate("services");
            }}
            className="lg:px-6 lg:py-3"
          >
            {isEn ? "Research" : "Investigación"}
          </AnchorButton>
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
          {consoleStats.map((stat) => (
            <div key={stat.value} className="grid grid-cols-[4.5rem_1fr] items-start gap-4 rounded-md border border-neutral-200 bg-neutral-50 p-3 dark:border-white/10 dark:bg-white/[0.025]">
              <div className="font-mono text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                {stat.animatedValue ? (
                  <CountUpValue
                    target={stat.animatedValue}
                    durationMs={stat.durationMs || 1400}
                    isActive={isActive}
                    format={stat.format}
                    precision={stat.precision}
                  />
                ) : (
                  stat.value
                )}
              </div>
              <div>
                {stat.id === "ransomware" ? (
                  <button
                    type="button"
                    onClick={() => onOpenFaq("ransomware")}
                    className="text-left text-xs font-medium leading-snug text-neutral-800 underline decoration-emerald-600/40 underline-offset-2 dark:text-neutral-100"
                  >
                    {isEn ? stat.label.en : stat.label.es}
                  </button>
                ) : (
                  <p className="text-xs font-medium leading-snug text-neutral-800 dark:text-neutral-100">
                    {isEn ? stat.label.en : stat.label.es}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-md border border-neutral-200 bg-neutral-50 p-3 dark:border-white/10 dark:bg-white/[0.03]">
          <AnchorButton
            href="#threats"
            onClick={(event) => {
              event.preventDefault();
              onNavigate("threats");
            }}
            className="w-full bg-emerald-300 text-neutral-950 hover:bg-emerald-200 dark:bg-emerald-300 dark:text-neutral-950 dark:hover:bg-emerald-200"
          >
            {isEn ? "See emerging threats" : "Ver amenazas actuales"}
            <ArrowDown className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-y-0.5" />
          </AnchorButton>
        </div>
      </div>
    </div>
  );
};

/* Legacy service-card implementation retained temporarily for diff clarity.
const ServiceBundleCard: React.FC<{
  service: ProductService;
  language: Language;
  onNavigate: (section: SectionId) => void;
}> = ({
  service,
  language,
  onNavigate,
}) => {
  const isComingSoon = service.availability === "coming-soon";
  const isEn = language === "en";
  const [optionsOpen, setOptionsOpen] = useState(false);
  const card = (
    <article
      className={`flex h-full flex-col rounded-xl border p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-300 dark:shadow-[0_18px_50px_rgba(0,0,0,0.24)] lg:p-6 ${
        isComingSoon
          ? "border-neutral-200/70 bg-white/60 opacity-75 dark:border-neutral-800/70 dark:bg-neutral-950/55"
          : "border-neutral-200/90 bg-white/90 dark:border-neutral-800/90 dark:bg-neutral-950/80"
      }`}
    >
      <div className="md:min-h-[14.5rem]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-white shadow-sm dark:bg-white dark:text-neutral-950">
              <service.icon className="h-4 w-4" />
            </span>
            <p className="pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
              {service.eyebrow[language]}
            </p>
          </div>

          {service.badge ? (
            <span
              className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                isComingSoon
                  ? "border-neutral-200 bg-neutral-100 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-200"
              }`}
            >
              {service.badge[language]}
            </span>
          ) : null}
        </div>

        <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-neutral-950 dark:text-neutral-50 lg:text-3xl">
          {service.title[language]}
        </h3>

        <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          {service.summary[language]}
        </p>
      </div>

      <div className="my-5 h-px w-full bg-gradient-to-r from-emerald-700/80 via-emerald-400/70 to-transparent dark:from-emerald-300/80 dark:via-emerald-500/50" />

      <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
        {isComingSoon ? (
          <div className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-xs font-semibold text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-200">
            {service.ctaLabel[language]}
          </div>
        ) : (
          <a
            href="#contact"
            onClick={(event) => {
              event.preventDefault();
              onNavigate("contact");
            }}
            className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:bg-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 dark:bg-white dark:text-neutral-950 dark:hover:bg-emerald-200"
          >
            {service.ctaLabel[language]}
            <ArrowDown className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-y-0.5" />
          </a>
        )}
        <button
          type="button"
          onClick={() => setOptionsOpen(true)}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white/80 px-4 text-xs font-semibold text-neutral-900 shadow-sm transition-all duration-300 hover:border-emerald-600 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 md:hidden dark:border-neutral-700 dark:bg-neutral-950/70 dark:text-neutral-100 dark:hover:border-emerald-300 dark:hover:bg-neutral-900"
        >
          {isEn ? "Research topics" : "Temas de investigación"}
        </button>
      </div>

      <div className="mt-6 hidden flex-1 border-t border-neutral-200 pt-5 md:block dark:border-neutral-800">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          {language === "en" ? "Research topics" : "Temas de investigación"}
        </p>
        <ul className="space-y-3">
          {service.subServices[language].map((subService) => (
            <li
              key={subService}
              className="flex items-start gap-3 text-sm leading-5"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300" />
              <span className="font-semibold text-neutral-950 dark:text-neutral-50">
                {subService}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {optionsOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex items-end bg-neutral-950/45 px-3 py-3 backdrop-blur-md sm:items-center sm:justify-center sm:px-4 md:hidden">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`service-options-title-${service.id}`}
              className="max-h-[88svh] w-full overflow-y-auto rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-2xl shadow-neutral-950/20 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 sm:max-w-2xl"
            >
              <div className="border-b border-neutral-200 p-5 dark:border-neutral-800">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                      {isEn ? "Research topics" : "Temas de investigación"}
                    </p>
                    <h3
                      id={`service-options-title-${service.id}`}
                      className="mt-2 text-2xl font-semibold tracking-tight"
                    >
                      {service.title[language]}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOptionsOpen(false)}
                    aria-label={isEn ? "Close research topics" : "Cerrar temas de investigación"}
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-neutral-200 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950 dark:border-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <div className="divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
                  {service.subServices[language].map((subService) => (
                    <div
                      key={subService}
                      className="flex items-start gap-3 bg-white px-3.5 py-3 text-sm font-medium leading-relaxed text-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-700 dark:text-emerald-300" />
                      {subService}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setOptionsOpen(false)}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
                >
                  {isEn ? "Close" : "Cerrar"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </article>
  );

  if (!service.featured) {
    return <div className="mx-auto w-[calc(100vw-3rem)] max-w-md md:w-full md:max-w-none">{card}</div>;
  }

  return (
    <div className="mx-auto h-full w-[calc(100vw-3rem)] max-w-md rounded-xl bg-gradient-to-br from-emerald-700 via-emerald-500 to-neutral-950 p-px shadow-[0_24px_70px_rgba(4,120,87,0.18)] dark:from-emerald-300 dark:via-emerald-700 dark:to-neutral-800 md:w-full md:max-w-none">
      {card}
    </div>
  );
};

*/

const ServicesSection: React.FC<SectionProps> = ({ language }) => {
  const isEn = language === "en";

  return (
    <div className="w-full py-4 sm:py-6">
      <div className="mx-auto mb-6 w-[calc(100vw-3rem)] max-w-md md:mx-0 md:w-auto md:max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
          {isEn ? "Research" : "Investigación"}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {isEn ? "Current focus" : "Enfoque actual"}
        </h2>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          {isEn ? "Public · Educational · Non-commercial" : "Público · Educativo · No comercial"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {researchTopics.map((topic) => (
          <article
            key={topic.id}
            className="rounded-xl border border-neutral-200/90 bg-white/90 p-5 shadow-sm backdrop-blur-sm dark:border-neutral-800/90 dark:bg-neutral-950/80"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
              <topic.icon className="h-4 w-4" />
            </span>
            <h3 className="mt-4 text-xl font-semibold tracking-tight">{topic.title[language]}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {topic.keywords[language].map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:text-neutral-300"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </article>
        ))}
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
          {isEn ? "Why trust us" : "Por qué confiar"}
        </h2>
      </div>

      <CertCarousel language={language} />
    </div>
  );
};

const CertCarousel: React.FC<SectionProps> = ({ language }) => {
  const isEn = language === "en";
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const pauseTimerRef = useRef<number>();
  const total = certLogos.length;
  const activeLogo = certLogos[index];

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const syncQueries = () => {
      setIsMobile(mobileQuery.matches);
    };

    syncQueries();
    mobileQuery.addEventListener("change", syncQueries);

    return () => {
      mobileQuery.removeEventListener("change", syncQueries);
    };
  }, []);

  useEffect(() => {
    if (total === 0 || isPaused) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, isMobile ? MOBILE_CERT_AUTOPLAY_MS : 5000);

    return () => window.clearInterval(id);
  }, [total, index, isMobile, isPaused]);

  useEffect(() => {
    setProgressKey((prev) => prev + 1);
  }, [index]);

  useEffect(() => {
    return () => {
      window.clearTimeout(pauseTimerRef.current);
    };
  }, []);

  if (total === 0 || !activeLogo) {
    return null;
  }

  const goNext = () => setIndex((prev) => (prev + 1) % total);
  const goPrev = () => setIndex((prev) => (prev - 1 + total) % total);
  const detail = isEn ? activeLogo.description.en : activeLogo.description.es;
  const goTo = (nextIndex: number) => setIndex(nextIndex);
  const progressRadius = 7;
  const progressCircumference = 2 * Math.PI * progressRadius;
  const pauseMobileAutoplay = () => {
    setIsPaused(true);
    window.clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = window.setTimeout(() => setIsPaused(false), 1600);
  };
  const handleMobileTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
    pauseMobileAutoplay();
  };
  const handleMobileTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const startX = touchStartXRef.current;
    touchStartXRef.current = null;
    if (startX === null) return;

    const endX = event.changedTouches[0]?.clientX ?? startX;
    const deltaX = endX - startX;
    if (Math.abs(deltaX) < 42) return;

    if (deltaX < 0) {
      goNext();
      return;
    }

    goPrev();
  };

  return (
    <>
      <div
        className="w-full max-w-full overflow-hidden md:hidden"
        onTouchStart={handleMobileTouchStart}
        onTouchEnd={handleMobileTouchEnd}
      >
        <div className="relative h-[15.5rem] w-full max-w-full overflow-hidden py-1">
          {certLogos.map((logo, logoIndex) => {
            const logoDetail = isEn ? logo.description.en : logo.description.es;
            const relativePosition = (logoIndex - index + total) % total;
            const isActive = relativePosition === 0;
            const isPrevious = relativePosition === total - 1;
            const isNext = relativePosition === 1;
            const isVisible = isActive || isPrevious || isNext;
            const cardTransform = isPrevious
              ? "translate3d(-132%, 18px, 0) scale(0.9)"
              : isNext
                ? "translate3d(32%, 18px, 0) scale(0.9)"
                : isActive
                  ? "translate3d(-50%, 0, 0) scale(1)"
                  : "translate3d(-50%, 26px, 0) scale(0.86)";
            const zIndex = isActive ? 30 : isVisible ? 10 : 0;

            return (
              <button
                key={logo.file}
                type="button"
                onClick={() => {
                  pauseMobileAutoplay();
                  goTo(logoIndex);
                }}
                onFocus={() => {
                  pauseMobileAutoplay();
                  goTo(logoIndex);
                }}
                aria-label={
                  isEn
                    ? `Show certification ${logoIndex + 1}: ${logo.title}`
                    : `Mostrar certificación ${logoIndex + 1}: ${logo.title}`
                }
                aria-current={isActive ? "true" : undefined}
                aria-hidden={!isActive}
                tabIndex={isActive ? 0 : -1}
                style={{ zIndex, transform: cardTransform, opacity: isVisible ? 1 : 0 }}
                className={`mobile-cert-card absolute left-1/2 top-1 h-[15rem] w-[82%] max-w-[20rem] overflow-hidden rounded-xl border bg-white p-3 text-left shadow-sm dark:bg-neutral-950 ${
                  isActive
                    ? "border-emerald-500/70 shadow-lg shadow-emerald-950/10 dark:border-emerald-300/60"
                    : "border-neutral-200 dark:border-neutral-800"
                } ${isVisible ? "" : "pointer-events-none"}`}
              >
                <div className="grid h-full grid-cols-[4.75rem_minmax(0,1fr)] gap-3">
                  <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-900/70">
                    <img
                      src={logo.src}
                      alt={logo.title}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 overflow-hidden">
                    {isActive && (
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                        {isEn ? "Active credential" : "Credencial activa"}
                      </p>
                    )}
                    <h3 className="mt-2 line-clamp-3 text-sm font-semibold leading-snug text-neutral-950 dark:text-neutral-50">
                      {logo.title}
                    </h3>
                    <p className="mt-2 line-clamp-5 text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-300">
                      {logoDetail}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col items-center gap-3">
          <div className="flex min-w-0 flex-wrap items-center justify-center gap-1.5">
            {certLogos.map((logo, logoIndex) => (
              <button
                key={`${logo.file}-dot`}
                type="button"
                onClick={() => {
                  pauseMobileAutoplay();
                  goTo(logoIndex);
                }}
                aria-label={
                  isEn
                    ? `Go to certification ${logoIndex + 1}`
                    : `Ir a certificación ${logoIndex + 1}`
                }
                aria-current={index === logoIndex ? "true" : undefined}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === logoIndex
                    ? "w-6 bg-emerald-700 dark:bg-emerald-300"
                    : "w-1.5 bg-neutral-300 dark:bg-neutral-700"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
            <span>{isEn ? "Swipe" : "Desliza"}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-4 w-4 -rotate-90 text-emerald-700 dark:text-emerald-300"
            >
              <circle
                cx="10"
                cy="10"
                r="7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="opacity-20"
              />
              <circle
                key={progressKey}
                cx="10"
                cy="10"
                r="7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={progressCircumference}
                strokeDashoffset={progressCircumference}
                className={isPaused ? "" : "mobile-cert-progress"}
                style={{
                  ["--cert-progress-offset" as string]: progressCircumference,
                }}
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="hidden gap-5 md:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)]">
        <Card interactive={false} className="overflow-hidden">
          <CardInner className="flex h-full flex-col p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/70">
                <img
                  src={activeLogo.src}
                  alt={activeLogo.title}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                  {isEn ? "Highlighted credential" : "Credencial destacada"}
                </p>
                <h3 className="mt-3 text-xl font-semibold leading-tight text-neutral-950 dark:text-neutral-50">
                  {activeLogo.title}
                </h3>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              {detail}
            </p>
            <p className="mt-auto pt-6 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              {isEn
                ? "Select any credential to review the experience area it represents."
                : "Selecciona cualquier credencial para revisar el área de experiencia que representa."}
            </p>
          </CardInner>
        </Card>

        <div className="credential-scrollbar grid max-h-[31rem] gap-3 overflow-y-auto pr-3 sm:grid-cols-2">
          {certLogos.map((logo, logoIndex) => {
            const isActive = logoIndex === index;

            return (
              <button
                key={logo.file}
                type="button"
                onClick={() => goTo(logoIndex)}
                aria-current={isActive ? "true" : undefined}
                className={`group grid min-h-[8rem] grid-cols-[4.5rem_minmax(0,1fr)] gap-3 rounded-lg border bg-white/80 p-3 text-left shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/60 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 dark:bg-neutral-950/75 dark:hover:bg-neutral-950 ${
                  isActive
                    ? "border-emerald-500/70 dark:border-emerald-300/60"
                    : "border-neutral-200 dark:border-neutral-800"
                }`}
              >
                <span className="flex aspect-square items-center justify-center rounded-md border border-neutral-200 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-900/70">
                  <img
                    src={logo.src}
                    alt=""
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                </span>
                <span className="min-w-0 overflow-hidden pr-1">
                  <span className="line-clamp-2 min-w-0 text-sm font-semibold leading-snug text-neutral-950 dark:text-neutral-50">
                    {logo.title}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};



interface ThreatSectionProps extends ActiveSectionProps {
  onOpenFaq: (faqId: FaqId) => void;
}

const ThreatsSection: React.FC<ThreatSectionProps> = ({ language, isActive, onOpenFaq }) => {
  const isEn = language === "en";

  return (
    <div className="py-4 sm:py-6">
      <div>
        <div className="mb-7 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
            {isEn ? "Emerging threats" : "Amenazas actuales"}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {isEn
              ? "Regional threat data"
              : "Datos regionales de amenazas"}
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {threatStats.map((stat) => (
            <article
              key={`${stat.value}-${stat.year}`}
              className="rounded-xl border border-neutral-200 bg-white/85 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/80"
            >
              <div className="flex min-h-[11rem] flex-col p-4 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-mono text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                      {stat.animatedValue ? (
                        <CountUpValue
                          target={stat.animatedValue}
                          durationMs={stat.durationMs || 1400}
                          isActive={isActive}
                          format={stat.format}
                          prefix={stat.value.startsWith("+") ? "+" : ""}
                          suffix={stat.value.endsWith("+") ? "+" : ""}
                        />
                      ) : (
                        stat.value
                      )}
                    </div>
                    {stat.id === "ransomware" ? (
                      <button type="button" onClick={() => onOpenFaq("ransomware")} className="mt-2 text-left text-sm font-semibold leading-snug text-neutral-900 underline decoration-emerald-600/40 underline-offset-2 dark:text-neutral-100">
                        {isEn ? stat.label.en : stat.label.es}
                      </button>
                    ) : (
                      <p className="mt-2 text-sm font-semibold leading-snug text-neutral-900 dark:text-neutral-100">{isEn ? stat.label.en : stat.label.es}</p>
                    )}
                  </div>
                  <span className="rounded-md border border-neutral-200 px-2 py-1 font-mono text-[10px] text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                    {stat.year}
                  </span>
                </div>
                <a href={stat.sourceUrl} target="_blank" rel="noreferrer" className="mt-auto flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-800">
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    {stat.sourceName}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-emerald-800 transition-transform duration-300 ease-out group-hover:translate-x-1 dark:text-emerald-300" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

const MobileThreatSnapshot: React.FC<ThreatSectionProps> = ({ language, isActive, onOpenFaq }) => {
  const isEn = language === "en";

  return (
    <div className="mx-auto w-[calc(100vw-3rem)] max-w-md py-4 text-center">
      <div className="mb-5 flex flex-col items-center justify-center gap-3 border-b border-neutral-200 pb-4 dark:border-neutral-800">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
            {isEn ? "Regional threat snapshot" : "Panorama regional de amenazas"}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            {isEn ? "Threat data, at a glance" : "Datos de amenaza, en breve"}
          </h2>
        </div>
        <Activity className="h-5 w-5 flex-shrink-0 text-emerald-700 dark:text-emerald-300" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {regionalSnapshotStats.map((stat) => (
          <article
            key={`${stat.value}-${stat.year}`}
            className="flex min-h-[9.25rem] flex-col justify-between rounded-lg border border-neutral-200 bg-white/85 p-3 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/80"
          >
            <div>
              <div className="font-mono text-xl font-semibold text-emerald-700 dark:text-emerald-300">
                {stat.animatedValue ? (
                  <CountUpValue
                    target={stat.animatedValue}
                    durationMs={stat.durationMs || 1400}
                    isActive={isActive}
                    format={stat.format}
                    precision={stat.precision}
                    prefix={stat.value.startsWith("+") ? "+" : ""}
                    suffix={stat.value.endsWith("+") ? "+" : ""}
                  />
                ) : (
                  stat.value
                )}
              </div>
              {stat.id === "ransomware" ? (
                <button type="button" onClick={() => onOpenFaq("ransomware")} className="mt-2 text-left text-[11px] font-semibold leading-snug text-neutral-900 underline decoration-emerald-600/40 underline-offset-2 dark:text-neutral-100">
                  {isEn ? stat.label.en : stat.label.es}
                </button>
              ) : (
                <p className="mt-2 text-[11px] font-semibold leading-snug text-neutral-900 dark:text-neutral-100">{isEn ? stat.label.en : stat.label.es}</p>
              )}
            </div>
            <a href={stat.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-between gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-800">
              <span className="truncate text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">
                {stat.sourceName}
              </span>
              <ExternalLink className="h-3 w-3 flex-shrink-0 text-emerald-800 transition-transform duration-300 group-hover:translate-x-0.5 dark:text-emerald-300" />
            </a>
          </article>
        ))}
      </div>
    </div>
  );
};


const FAQSection: React.FC<SectionProps & { focusedFaq: { id: FaqId; request: number } | null }> = ({ language, focusedFaq }) => {
  const isEn = language === "en";
  const [openItem, setOpenItem] = React.useState<number | null>(null);

  const faqItems = isEn
    ? [
        { id: "about" as const, question: "What is SafeGuard CCS?", answer: ["An independent cybersecurity research and education initiative based in Panama.", "We translate public security knowledge for emerging businesses."] },
        { id: "services" as const, question: "Do you offer services?", answer: ["No paid consulting, monitoring, or implementation.", "This domain is for nonpaid research and education."] },
        { id: "audience" as const, question: "Who is it for?", answer: ["SMEs, founders, and leadership teams seeking clearer security knowledge."] },
        { id: "topics" as const, question: "What do you study?", answer: ["Phishing, passwords, MFA, backups, data protection, and cyber hygiene."] },
        { id: "frameworks" as const, question: "How do you use frameworks?", answer: ["We translate public cybersecurity frameworks and data protection concepts into plain language.", "Content is educational—not legal, compliance, or professional security advice."] },
        { id: "data-sources" as const, question: "How do we capture data?", answer: ["We review public regional reporting from organizations such as FortiGuard Labs and Kaspersky.", "The figures provide context. SafeGuard CCS does not collect original threat telemetry."] },
        { id: "ransomware" as const, question: "What is ransomware?", answer: ["Malicious software that locks or encrypts files or systems and demands payment to restore access."] },
        { id: "contact" as const, question: "Can I contact SafeGuard CCS?", answer: ["Yes—for research, feedback, sources, or collaboration."] },
      ]
    : [
        { id: "about" as const, question: "¿Qué es SafeGuard CCS?", answer: ["Una iniciativa independiente de investigación y educación en ciberseguridad con sede en Panamá.", "Traducimos conocimiento público de seguridad para negocios emergentes."] },
        { id: "services" as const, question: "¿Ofrecen servicios?", answer: ["No ofrecemos consultoría, monitoreo ni implementación remunerados.", "Este dominio es para investigación y educación no remuneradas."] },
        { id: "audience" as const, question: "¿Para quién es?", answer: ["Pymes, fundadores y equipos directivos que buscan conocimiento claro de seguridad."] },
        { id: "topics" as const, question: "¿Qué estudian?", answer: ["Phishing, contraseñas, MFA, respaldos, protección de datos e higiene cibernética."] },
        { id: "frameworks" as const, question: "¿Cómo usan los marcos?", answer: ["Traducimos marcos públicos de ciberseguridad y protección de datos a lenguaje sencillo.", "El contenido es educativo; no es asesoría legal, de cumplimiento ni de seguridad profesional."] },
        { id: "data-sources" as const, question: "¿Cómo capturamos los datos?", answer: ["Revisamos reportes regionales públicos de organizaciones como FortiGuard Labs y Kaspersky.", "Las cifras aportan contexto. SafeGuard CCS no recopila telemetría propia de amenazas."] },
        { id: "ransomware" as const, question: "¿Qué es ransomware?", answer: ["Software malicioso que bloquea o cifra archivos o sistemas y exige un pago para restaurar el acceso."] },
        { id: "contact" as const, question: "¿Puedo contactar a SafeGuard CCS?", answer: ["Sí: para investigación, comentarios, fuentes o colaboración."] },
      ];

  React.useEffect(() => {
    if (!focusedFaq) return;
    const nextIndex = faqItems.findIndex((item) => item.id === focusedFaq.id);
    if (nextIndex >= 0) setOpenItem(nextIndex);
  }, [focusedFaq?.request, language]);

  return (
    <div className="py-4 sm:py-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {isEn ? "Frequently Asked Questions" : "Preguntas frecuentes"}
          </h2>
        </div>

        <div className="min-w-0 space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openItem === index;
            const contentId = `faq-answer-${index}`;

            return (
              <div
                key={item.id}
                id={`faq-${item.id}`}
                className="overflow-hidden rounded-xl border border-neutral-200/90 bg-white/90 shadow-[0_12px_30px_rgba(15,23,42,0.07)] backdrop-blur-sm dark:border-neutral-800/90 dark:bg-neutral-950/80 dark:shadow-[0_12px_30px_rgba(0,0,0,0.22)]"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => setOpenItem((current) => (current === index ? null : index))}
                  className="flex w-full items-start justify-between gap-4 px-4 py-3 text-left text-sm font-semibold text-neutral-950 transition hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500/50 dark:text-neutral-50 dark:hover:bg-neutral-900"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-700 transition-transform duration-200 dark:text-emerald-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={contentId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 border-t border-neutral-200 px-4 py-4 text-sm leading-relaxed text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
                        {item.answer.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};


const ContactSection: React.FC<SectionProps> = ({ language }) => {
  const isEn = language === "en";

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [submitStatus, setSubmitStatus] = React.useState<SubmitStatus>("idle");
  const [contactMode, setContactMode] = React.useState<ContactMode>("methods");
  const [successPopupOpen, setSuccessPopupOpen] = React.useState(false);
  const [redirectTarget, setRedirectTarget] = React.useState<RedirectTarget | null>(null);
  const messageWordCount = getWordCount(message);

  const mailLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    isEn ? "SafeGuard CCS research inquiry" : "Consulta de investigación SafeGuard CCS"
  )}`;

  React.useEffect(() => {
    if (!redirectTarget) return;

    const redirectTimer = window.setTimeout(() => {
      if (redirectTarget.kind === "whatsapp") {
        window.open(redirectTarget.href, "_blank", "noopener,noreferrer");
        return;
      }

      window.location.href = redirectTarget.href;
    }, 900);

    return () => window.clearTimeout(redirectTimer);
  }, [redirectTarget]);

  const openRedirectModal = (target: RedirectTarget) => {
    setRedirectTarget(target);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(limitWords(e.target.value, MESSAGE_WORD_LIMIT));
  };

  const contactMethods = [
    {
      kind: "whatsapp" as const,
      icon: SiWhatsapp,
      label: "WhatsApp",
      title: "WhatsApp",
      description: isEn
        ? "Research · Education"
        : "Investigación · Educación",
      href: WHATSAPP_LINK,
    },
    {
      kind: "email" as const,
      icon: Mail,
      label: isEn ? "Email" : "Correo",
      title: isEn ? "Send email" : "Correo",
      description: isEn
        ? "Details · Sources"
        : "Detalles · Fuentes",
      href: mailLink,
    },
    {
      kind: "form" as const,
      icon: Send,
      label: isEn ? "Form" : "Formulario",
      title: isEn ? "Contact form" : "Formulario",
      description: isEn
        ? "Send a note"
        : "Enviar una nota",
      href: "#contact-form",
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus("sending");

    const subject = isEn
      ? `SafeGuard CCS – Research inquiry from ${name || "Website visitor"}`
      : `SafeGuard CCS – Consulta de investigación de ${name || "Visitante del sitio"}`;

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
      setMessage("");
      setSuccessPopupOpen(true);
    } catch {
      setSubmitStatus("error");
    }
  };

  return (
    <div className="py-4 sm:py-6">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 180, damping: 26, mass: 0.8 }}
        className={`grid min-w-0 gap-4 lg:gap-8 min-h-0 lg:min-h-[33rem] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start ${
          contactMode === "form" ? "justify-items-center md:justify-items-stretch" : ""
        }`}
      >
        <motion.div
          layout="position"
          className={`min-w-0 space-y-6 ${contactMode === "form" ? "hidden md:block" : ""}`}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
              {isEn ? "Contact" : "Contacto"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {isEn ? "Other questions?" : "¿Otras preguntas?"}
            </h2>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
              {isEn ? "Connect with our research initiative. Send a short note." : "Conecta con nuestra iniciativa. Envía una nota breve."}
            </p>
          </div>

        </motion.div>

        <div
          className={`min-w-0 scroll-mt-24 lg:min-h-[33rem] ${
            contactMode === "form" ? "flex w-full items-center justify-center md:block" : ""
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {contactMode === "methods" ? (
              <motion.div
                key="contact-methods"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                className="min-w-0 space-y-3"
              >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 md:mb-0 dark:text-neutral-400">
              {isEn ? "Contact options" : "Opciones de contacto"}
            </p>
            <div className="grid grid-cols-1 gap-3">
              {contactMethods.map((method) => (
                <button
                  key={method.label}
                  type="button"
                  onClick={() => {
                    if (method.kind === "form") {
                      setContactMode("form");
                      return;
                    }

                    openRedirectModal({
                      label: method.label,
                      href: method.href,
                      kind: method.kind,
                    });
                  }}
                className="group flex min-h-0 w-full min-w-0 items-start justify-start gap-3 rounded-xl border border-neutral-200/90 bg-white/90 p-4 text-left shadow-[0_12px_30px_rgba(15,23,42,0.07)] backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/60 hover:bg-white hover:shadow-[0_16px_36px_rgba(15,23,42,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 active:scale-[0.99] dark:border-neutral-800/90 dark:bg-neutral-950/80 dark:shadow-[0_12px_30px_rgba(0,0,0,0.22)] dark:hover:bg-neutral-950"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-white shadow-sm transition-colors duration-300 group-hover:bg-emerald-700 dark:bg-white dark:text-neutral-950 dark:group-hover:bg-emerald-300">
                    <method.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold leading-snug text-neutral-950 dark:text-neutral-50">
                      {method.title}
                    </span>
                    <span className="mt-1 line-clamp-3 block text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                      {method.description}
                    </span>
                  </span>
                  {method.kind === "form" ? (
                    <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-neutral-400 transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:text-emerald-700 dark:group-hover:text-emerald-300" />
                  ) : (
                    <ExternalLink className="mt-1 h-4 w-4 flex-shrink-0 text-neutral-400 transition-colors duration-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-300" />
                  )}
                </button>
              ))}
            </div>
              </motion.div>
            ) : (
              <motion.div
                key="contact-form"
                id="contact-form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                className="w-[calc(100vw-3rem)] max-w-md min-w-0 md:w-full md:max-w-none"
              >
          <button
            type="button"
            onClick={() => setContactMode("methods")}
            className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 transition hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-neutral-50"
          >
            <ArrowRight className="h-3.5 w-3.5 rotate-180" />
            {isEn ? "Back" : "Volver"}
          </button>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {isEn ? "Send a note" : "Envía una nota"}
          </h2>
          <Card interactive={false} className="mt-5 overflow-hidden text-left">
            <CardInner className="min-w-0 space-y-4 text-xs text-neutral-700 dark:text-neutral-200">
              <form onSubmit={handleSubmit} className="min-w-0 space-y-3">
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
	                    placeholder={isEn ? "E.g. John Smith" : "Ej. Juan Perez"}
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
	                    placeholder="E.g. john.smith@company.com"
	                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 bg-white/80 px-3 py-2 text-xs outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 dark:border-neutral-700 dark:bg-neutral-950/70 dark:focus:border-emerald-300"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium">
                  {isEn
                    ? "Note"
                    : "Nota"}
                </label>
                <textarea
                  rows={4}
	                  name="message"
	                  required
                  placeholder={
                    isEn
                      ? "Question, source, or idea"
                      : "Pregunta, fuente o idea"
                  }
	                  value={message}
                  onChange={handleMessageChange}
                  className="min-h-[7rem] max-h-40 w-full max-w-full resize-y rounded-md border border-neutral-200 bg-white/80 px-3 py-2 text-xs outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 dark:border-neutral-700 dark:bg-neutral-950/70 dark:focus:border-emerald-300"
                />
                <div className="mt-1 flex justify-end text-[10px] text-neutral-500 dark:text-neutral-400">
                  {messageWordCount}/{MESSAGE_WORD_LIMIT} {isEn ? "words" : "palabras"}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
	                <Button
	                  type="submit"
	                  disabled={submitStatus === "sending"}
	                  className="w-fit whitespace-nowrap px-4 text-xs"
	                >
	                  {submitStatus === "sending"
	                    ? isEn
	                      ? "Sending..."
	                      : "Enviando..."
	                    : isEn
	                      ? "Send"
	                      : "Enviar"}
                </Button>

                <span className="max-w-[11rem] text-right text-[10px] leading-tight text-neutral-500 dark:text-neutral-400 sm:max-w-xs">
                  {submitStatus === "success"
                    ? isEn
                      ? "Message sent. We’ll reply soon."
                      : "Mensaje enviado. Te responderemos pronto."
                    : submitStatus === "error"
                      ? isEn
                        ? "Something went wrong. Please try again."
                        : "Algo salió mal. Intenta nuevamente."
                      : isEn
                        ? "Reply within 72 hours."
                        : "Respuesta en 72 horas."}
                </span>
              </div>
            </form>
          </CardInner>
        </Card>
              </motion.div>
            )}
          </AnimatePresence>
      </div>
      </motion.div>

      {typeof document !== "undefined" && createPortal(
        <>
          {successPopupOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-neutral-950/40 px-4 backdrop-blur-md">
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
                ? "Your message has been sent. Response time might take up to 72 hours, but we usually respond within a few hours."
                : "Tu mensaje fue enviado. La respuesta puede tomar hasta 72 horas, pero normalmente respondemos en pocas horas."}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              {isEn
                ? "Want an immediate answer? Send us a message via WhatsApp."
                : "¿Quieres una respuesta inmediata? Escríbenos por WhatsApp."}
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  openRedirectModal({
                    label: "WhatsApp",
                    href: WHATSAPP_LINK,
                    kind: "whatsapp",
                  })
                }
                className="px-4 py-2 text-xs"
              >
                <SiWhatsapp className="h-4 w-4" />
                WhatsApp
              </Button>
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

          {redirectTarget && (
        <div className="fixed inset-0 z-[1010] flex items-center justify-center bg-neutral-950/40 px-4 backdrop-blur-md">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="redirect-title"
            className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-5 text-neutral-900 shadow-xl dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 id="redirect-title" className="text-base font-semibold">
                  {isEn ? "Redirecting you" : "Redirigiéndote"}
                </h3>
                {redirectTarget.kind === "email" ? (
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {isEn
                      ? "You are being redirected to Email. If it does not happen automatically, write us at "
                      : "Te estamos redirigiendo al correo. Si no ocurre automáticamente, escríbenos a "}
                    <a
                      href={redirectTarget.href}
                      className="font-semibold text-emerald-700 underline decoration-emerald-700/30 underline-offset-4 transition hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                ) : (
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {isEn
                      ? `You are being redirected to ${redirectTarget.label}. If it does not happen automatically, click here.`
                      : `Te estamos redirigiendo a ${redirectTarget.label}. Si no ocurre automáticamente, haz clic aquí.`}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setRedirectTarget(null)}
                aria-label={isEn ? "Close" : "Cerrar"}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-neutral-200 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <a
                href={redirectTarget.href}
                target={redirectTarget.kind === "whatsapp" ? "_blank" : undefined}
                rel={redirectTarget.kind === "whatsapp" ? "noreferrer" : undefined}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                {redirectTarget.kind === "email"
                  ? isEn
                    ? "Open email app"
                    : "Abrir correo"
                  : isEn
                    ? "Click here"
                    : "Haz clic aquí"}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRedirectTarget(null)}
                className="px-4 py-2 text-xs"
              >
                {isEn ? "Stay here" : "Permanecer aquí"}
              </Button>
            </div>
          </div>
        </div>
          )}
        </>,
        document.body
      )}
    </div>
  );
};

// WhatsApp link constant must be defined before using it
const WHATSAPP_LINK =
  "https://wa.me/50765125606?text=Hi%20SafeGuard%20CCS%2C%20I%27d%20like%20to%20connect%20about%20your%20cybersecurity%20research.";

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
              ? "Independent cybersecurity research and education in Panama."
              : "Investigación y educación independiente en ciberseguridad en Panamá."}
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
            aria-label={isEn ? "Open WhatsApp" : "Abrir WhatsApp"}
            className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-neutral-950 text-white shadow-sm transition-all duration-300 ease-out hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            <SiWhatsapp className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ language }) => {
  const [footerVisible, setFooterVisible] = useState(false);
  const isEn = language === "en";

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
      aria-label={isEn ? "Open WhatsApp" : "Abrir WhatsApp"}
      className={`
        fixed bottom-5 right-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-xl
        bg-neutral-950 text-white shadow-lg transition-all duration-300
        hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200
        ${shouldHide ? "opacity-0 translate-y-3 pointer-events-none" : "opacity-100"}
      `}
    >
      <SiWhatsapp className="h-5 w-5" />
    </a>
  );
};


export default App;
