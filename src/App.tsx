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
type SubmitStatus = "idle" | "sending" | "success" | "error";
type ContactMode = "methods" | "form";
type RedirectTarget = {
  label: string;
  href: string;
  kind: "whatsapp" | "email";
};
type ProductService = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: Record<Language, string>;
  title: Record<Language, string>;
  summary: Record<Language, string>;
  mobileSummary: Record<Language, string>;
  detailTitle: Record<Language, string>;
  detail: Record<Language, string>;
  mobileDetail: Record<Language, string>;
  ctaLabel: Record<Language, string>;
  availability?: "available" | "coming-soon";
  featured?: boolean;
  badge?: Record<Language, string>;
  subServices: Record<Language, string[]>;
  highlights: Record<Language, string[]>;
  keywords: Record<Language, string>;
};

const SECTION_IDS: SectionId[] = ["home", "threats", "services", "approach", "faq", "contact"];
const WEB3FORMS_ACCESS_KEY = "b15631e6-e590-4acf-9085-ff56b23526b7";
const CONTACT_EMAIL = "consulting@safeguardccs.com";
const MESSAGE_WORD_LIMIT = 120;
const MOBILE_CERT_AUTOPLAY_MS = 5000;
const productServices: ProductService[] = [
  {
    id: "isms",
    icon: Building2,
    eyebrow: {
      en: "Governance & ISO 27001",
      es: "Gobierno e ISO 27001",
    },
    title: {
      en: "ISMS Services",
      es: "Servicios de SGSI",
    },
    summary: {
      en: "We use the ISO 27000 family as the strategy foundation around scope, risk, controls, evidence, responsibilities, maintenance, and certification readiness.",
      es: "Usamos la familia ISO 27000 como base estratégica alrededor de alcance, riesgo, controles, evidencias, responsabilidades, mantenimiento y preparación para certificación.",
    },
    mobileSummary: {
      en: "ISMS support based on ISO 27001 and the ISO 27000 family.",
      es: "Soporte de SGSI basado en ISO 27001 y la familia ISO 27000.",
    },
    detailTitle: {
      en: "ISMS services based on ISO 27001 and the ISO 27000 family",
      es: "Servicios de SGSI basados en ISO 27001 y la familia ISO 27000",
    },
    detail: {
      en: "We use the ISO 27000 family as the strategy foundation around scope, risk, controls, evidence, responsibilities, maintenance, and certification readiness.",
      es: "Usamos la familia ISO 27000 como base estratégica alrededor de alcance, riesgo, controles, evidencias, responsabilidades, mantenimiento y preparación para certificación.",
    },
    mobileDetail: {
      en: "ISO 27000-based ISMS work for implementation, maintenance, audits, and certification support.",
      es: "Trabajo de SGSI basado en ISO 27000 para implementación, mantenimiento, auditoría y certificación.",
    },
    ctaLabel: {
      en: "Discuss ISMS support",
      es: "Hablar sobre SGSI",
    },
    subServices: {
      en: [
        "Hands-on ISMS implementation",
        "Certification audit support",
        "ISMS maintenance",
        "ISMS audit",
      ],
      es: [
        "Implementación directa de SGSI",
        "Acompañamiento ante auditoría de certificación",
        "Mantenimiento de SGSI",
        "Auditoría de SGSI",
      ],
    },
    highlights: {
      en: ["ISO 27001 implementation roadmap", "Risk, control, and evidence structure", "Governance routines that can be maintained"],
      es: ["Ruta de implementación ISO 27001", "Estructura de riesgos, controles y evidencias", "Rutinas de gobierno sostenibles"],
    },
    keywords: {
      en: "ISO 27001 implementation, ISMS, information security management system, ISMS audit, ISO 27001 maintenance",
      es: "implementación ISO 27001, SGSI, sistema de gestión de seguridad de la información, auditoría de SGSI, mantenimiento ISO 27001",
    },
  },
  {
    id: "cybersecurity-consulting",
    icon: LockKeyhole,
    eyebrow: {
      en: "Practical advisory",
      es: "Asesoría práctica",
    },
    title: {
      en: "Cybersecurity Consulting",
      es: "Consultoría y asesoría de seguridad",
    },
    summary: {
      en: "Practical advisory from experts with 7+ years of regional Latin America experience and 1,000+ cumulative support and advisory requests across their careers.",
      es: "Asesoría práctica de expertos con más de 7 años de experiencia regional en Latinoamérica y más de 1,000 solicitudes acumuladas de soporte y asesoría a lo largo de sus carreras.",
    },
    mobileSummary: {
      en: "Expert advisory backed by 7+ years in Latin America and 1,000+ cumulative support requests.",
      es: "Asesoría experta con más de 7 años en Latinoamérica y 1,000+ solicitudes acumuladas.",
    },
    detailTitle: {
      en: "Cybersecurity consulting and security advisory services",
      es: "Consultoría de ciberseguridad y asesoría estratégica de seguridad",
    },
    detail: {
      en: "Practical advisory from experts with 7+ years of regional Latin America experience and 1,000+ cumulative support and advisory requests across their careers.",
      es: "Asesoría práctica de expertos con más de 7 años de experiencia regional en Latinoamérica y más de 1,000 solicitudes acumuladas de soporte y asesoría a lo largo de sus carreras.",
    },
    mobileDetail: {
      en: "Regional advisory experience applied to posture, risk, applications, networks, and security habits.",
      es: "Experiencia regional aplicada a postura, riesgo, aplicaciones, redes y hábitos de seguridad.",
    },
    ctaLabel: {
      en: "Request consulting",
      es: "Solicitar asesoría",
    },
    featured: true,
    badge: {
      en: "Featured",
      es: "Recomendado",
    },
    subServices: {
      en: [
        "General advisory",
        "Security training",
        "Network security",
        "Application security",
        "Security posture diagnostic",
      ],
      es: [
        "Asesoría general",
        "Formación",
        "Seguridad de redes",
        "Seguridad de aplicaciones",
        "Diagnóstico de postura de seguridad",
      ],
    },
    highlights: {
      en: ["Risk-based roadmaps", "Network and application security guidance", "Training that changes daily behavior"],
      es: ["Rutas de mejora basadas en riesgo", "Guía de seguridad de redes y aplicaciones", "Formación que cambia hábitos diarios"],
    },
    keywords: {
      en: "cybersecurity consulting, security advisory, security training, network security, application security, security posture diagnostic",
      es: "consultoría de ciberseguridad, asesoría de seguridad, formación en seguridad, seguridad de redes, seguridad de aplicaciones, diagnóstico de postura de seguridad",
    },
  },
  {
    id: "mssp-operational-monitoring",
    icon: Activity,
    eyebrow: {
      en: "Managed security operations",
      es: "Operaciones de seguridad gestionadas",
    },
    title: {
      en: "MSSP Operational Monitoring",
      es: "Monitoreo y análisis operacional MSSP",
    },
    summary: {
      en: "Managed security operations aligned to NIST CSF, IRT, and RMF for continuous monitoring. Detect suspicious activity, respond to incidents and harden security.",
      es: "Operaciones de seguridad gestionadas alineadas a NIST CSF, IRT y RMF para monitoreo continuo. Detecta actividad sospechosa, responde a incidentes y endurece la seguridad.",
    },
    mobileSummary: {
      en: "Managed monitoring aligned to NIST CSF, IRT, and RMF.",
      es: "Monitoreo gestionado alineado a NIST CSF, IRT y RMF.",
    },
    detailTitle: {
      en: "Managed Security Service Provider monitoring and operational support",
      es: "Monitoreo MSSP y soporte operacional de seguridad gestionada",
    },
    detail: {
      en: "Managed security operations aligned to NIST CSF, IRT, and RMF for continuous monitoring. Detect suspicious activity, respond to incidents and harden security.",
      es: "Operaciones de seguridad gestionadas alineadas a NIST CSF, IRT y RMF para monitoreo continuo. Detecta actividad sospechosa, responde a incidentes y endurece la seguridad.",
    },
    mobileDetail: {
      en: "Monitoring, incident handling, vulnerabilities, updates, hardening, and continuous visibility in one operational service area.",
      es: "Monitoreo, incidentes, vulnerabilidades, actualizaciones, endurecimiento y visibilidad continua en una sola área operacional.",
    },
    ctaLabel: {
      en: "Coming soon",
      es: "Próximamente",
    },
    availability: "coming-soon",
    badge: {
      en: "Coming soon",
      es: "Próximamente",
    },
    subServices: {
      en: [
        "Incident handling",
        "IT support",
        "Vulnerability scanning",
        "Updates and hardening",
        "Continuous monitoring",
      ],
      es: [
        "Manejo de incidentes",
        "Soporte de TI",
        "Escaneo de vulnerabilidades",
        "Actualizaciones y endurecimiento",
        "Monitoreo continuo",
      ],
    },
    highlights: {
      en: ["Security event triage", "Operational visibility", "Actionable remediation support"],
      es: ["Priorización de eventos de seguridad", "Visibilidad operacional", "Soporte de remediación accionable"],
    },
    keywords: {
      en: "MSSP, managed security monitoring, incident handling, vulnerability scanning, continuous monitoring, IT support, hardening",
      es: "MSSP, monitoreo gestionado de seguridad, manejo de incidentes, escaneo de vulnerabilidades, monitoreo continuo, soporte de TI, hardening",
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
      en: "Attacks right now in Latin America",
      es: "Ataques ahora mismo en Latinoamérica",
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
    { section: "services", label: isEn ? "Services" : "Servicios" },
    { section: "approach", label: isEn ? "Why trust us" : "Por qué confiar" },
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
              {isEn ? "Services" : "Servicios"}
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
              {isEn ? "Why trust us" : "Por qué confiar"}
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
  services: { en: "Services", es: "Servicios" },
  approach: { en: "Why trust us", es: "Por qué confiar" },
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

  const toggleLanguage = () =>
    setLanguage((lang) => (lang === "en" ? "es" : "en"));

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
          />
        </LandingSection>

        <LandingSection id="threats">
          <div className="md:hidden">
            <MobileThreatSnapshot
              language={language}
              isActive={activeSection === "threats"}
            />
          </div>
          <div className="hidden md:block">
            <ThreatsSection
              language={language}
              isActive={activeSection === "threats"}
            />
          </div>
        </LandingSection>

        <LandingSection id="services">
          <ServicesSection language={language} onNavigate={handleNavigate} />
        </LandingSection>

        <LandingSection id="approach">
          <ApproachSection language={language} />
        </LandingSection>

        <LandingSection id="faq">
          <FAQSection language={language} onNavigate={handleNavigate} />
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
}

const HeroSection: React.FC<HeroSectionProps> = ({ language, isActive, onNavigate }) => {
  const isEn = language === "en";
  const consoleStats = regionalSnapshotStats;
  const heroPoints = [
    {
      icon: LockKeyhole,
      label: isEn
        ? "Work directly with senior engineers who understand business risk and security operations."
        : "Trabaja directamente con ingenieros senior que entienden riesgo de negocio y operaciones de seguridad.",
      mobileLines: isEn
        ? ["Work directly with senior engineers", "who understand business risk and security operations."]
        : ["Trabaja directamente con ingenieros senior", "que entienden riesgo de negocio y seguridad."],
    },
    {
      icon: Building2,
      label: isEn
        ? "Get cybersecurity decisions sized for SMB budgets, teams, and operational reality."
        : "Recibe decisiones de ciberseguridad ajustadas a presupuestos, equipos y realidad operativa de pymes.",
      mobileLines: isEn
        ? ["Get cybersecurity decisions sized for", "SMB budgets, teams, and operational reality."]
        : ["Recibe decisiones ajustadas a presupuestos", "equipos y realidad operativa de pymes."],
    },
    {
      icon: Network,
      label: isEn
        ? "Lean on engineers with 7+ years across Latin America and deep enterprise infrastructure exposure."
        : "Apóyate en ingenieros con más de 7 años en Latinoamérica y amplia exposición a infraestructura empresarial.",
      mobileLines: isEn
        ? ["Lean on engineers with 7+ years across Latin America", "and deep enterprise infrastructure exposure."]
        : ["Apóyate en ingenieros con más de 7 años", "y experiencia en infraestructura empresarial."],
    },
  ];

  return (
    <div className="grid w-full justify-items-center gap-8 text-center lg:grid-cols-[minmax(0,1.12fr)_420px] lg:items-center lg:justify-items-stretch lg:text-left xl:gap-12">
      <div className="mx-auto max-w-4xl lg:mx-0">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-300">
          {isEn ? "Cybersecurity consulting in Panama" : "Consultoría de ciberseguridad en Panamá"}
        </p>

        <h1 className="mx-auto mt-5 max-w-[11ch] text-5xl font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:mx-0 lg:text-7xl xl:text-[5rem]">
          {isEn ? "Security is all we do." : "Seguridad sin distracciones."}
        </h1>

        <ul className="mx-auto mt-7 max-w-3xl space-y-4 text-left text-sm leading-relaxed text-neutral-700 dark:text-neutral-200 lg:mx-0 lg:text-base">
          {heroPoints.map(({ icon: Icon, label, mobileLines }) => (
            <li key={label} className="flex gap-3">
              <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700 dark:text-emerald-300" />
              <span className="hidden md:inline">{label}</span>
              <span className="min-w-0 text-[clamp(0.68rem,3.2vw,0.875rem)] leading-relaxed md:hidden">
                <span className="block whitespace-nowrap">{mobileLines[0]}</span>
                <span className="block whitespace-nowrap">{mobileLines[1]}</span>
              </span>
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
            {isEn ? "Talk about your environment" : "Hablar de tu entorno"}
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
            {isEn ? "Review services" : "Revisar servicios"}
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
                <p className="text-xs font-medium leading-snug text-neutral-800 dark:text-neutral-100">
                  {isEn ? stat.label.en : stat.label.es}
                </p>
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
          {isEn ? "Service Options" : "Opciones de servicio"}
        </button>
      </div>

      <div className="mt-6 hidden flex-1 border-t border-neutral-200 pt-5 md:block dark:border-neutral-800">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          {language === "en" ? "Service options" : "Opciones de servicio"}
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
                      {isEn ? "Service options" : "Opciones de servicio"}
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
                    aria-label={isEn ? "Close service options" : "Cerrar opciones de servicio"}
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

const ServicesSection: React.FC<SectionProps & {
  onNavigate: (section: SectionId) => void;
}> = ({ language, onNavigate }) => {
  const isEn = language === "en";

  return (
    <div className="w-full py-4 sm:py-6">
      <div className="mx-auto mb-6 w-[calc(100vw-3rem)] max-w-md md:mx-0 md:w-auto md:max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
          {isEn ? "Cybersecurity services" : "Servicios de ciberseguridad"}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {isEn
            ? "Security services built for real operations"
            : "Servicios de seguridad para tu operación"}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          {isEn
            ? "Explore focused service areas designed around governance, operations, and advisory support."
            : "Explora áreas de servicio enfocadas en gobierno, operación y asesoría."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {productServices.map((service) => (
          <ServiceBundleCard
            key={service.id}
            service={service}
            language={language}
            onNavigate={onNavigate}
          />
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
            const logoDetail = isEn ? logo.description.en : logo.description.es;
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
                  <span className="mt-2 line-clamp-3 block min-w-0 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {logoDetail}
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



const ThreatsSection: React.FC<ActiveSectionProps> = ({ language, isActive }) => {
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

const MobileThreatSnapshot: React.FC<ActiveSectionProps> = ({ language, isActive }) => {
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
          <a
            key={`${stat.value}-${stat.year}`}
            href={stat.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="group flex min-h-[9.25rem] flex-col justify-between rounded-lg border border-neutral-200 bg-white/85 p-3 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/60 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 dark:border-neutral-800 dark:bg-neutral-950/80 dark:hover:bg-neutral-950"
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
              <p className="mt-2 text-[11px] font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
                {isEn ? stat.label.en : stat.label.es}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-800">
              <span className="truncate text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">
                {stat.sourceName}
              </span>
              <ExternalLink className="h-3 w-3 flex-shrink-0 text-emerald-800 transition-transform duration-300 group-hover:translate-x-0.5 dark:text-emerald-300" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};


const FAQSection: React.FC<SectionProps & {
  onNavigate: (section: SectionId) => void;
}> = ({ language, onNavigate }) => {
  const isEn = language === "en";
  const [openItem, setOpenItem] = React.useState<number | null>(null);

  const faqItems = isEn
    ? [
        {
          question: "How much does a cybersecurity service cost?",
          answer: [
            "Practical security steps that stop many basic threats can be cheaper than people think. A strong foundation is achievable with small budgets when the priorities and advisors are right.",
            "A full program depends on the scope, company size, systems involved, urgency, and whether the work is one-time or ongoing.",
            "A short discovery conversation is usually the best way to recommend a practical starting point.",
          ],
        },
        {
          question: "Who do you usually help?",
          answer: [
            "We work with small and medium businesses, with special attention to protecting business owners' budgets while improving security.",
            "Common clients include accounting and tax firms, legal and compliance practices, professional services, health and wellness clinics, small retail, and local businesses.",
          ],
        },
        {
          question: "Where should we start if we do not have a cybersecurity program?",
          answer: [
            "Start by understanding what systems you use, what data you handle, who has access, and which risks could hurt the business first.",
            "Our first step is helping you discover where you are, then turning that into a practical roadmap without overwhelming your team.",
          ],
        },
        {
          question: "Do you replace our IT provider?",
          answer: [
            "We can own or support security-heavy IT tasks, but we do not replace a regular helpdesk or day-to-day IT support team.",
            "We work alongside your IT team or provider to heavy lift, advise, improve visibility, harden systems, and reduce risk.",
          ],
        },
        {
          question: "Ley 81 and GDPR: what are they, and can you help?",
          answer: [
            "Ley 81 in Panama and the GDPR in Europe are data protection rules that matter when a business handles personal data.",
            "We help with the security side of those obligations by identifying gaps and implementing strong standards, including ISMS practices aligned with ISO 27000, so the business is better prepared for demanding compliance expectations.",
            "For legal interpretation, we recommend qualified legal counsel.",
          ],
        },
        {
          question: "What is an ISMS, and why does ISO 27001 matter?",
          answer: [
            "An ISMS is the structured way a company manages information security: risks, policies, responsibilities, controls, evidence, and improvement following international standards like ISO 27001.",
            "We can help you prepare, maintain, or improve it by translating these concepts into simpler terms: who does what, how it is done, and how to follow international best practices without unnecessary hurdles.",
          ],
        },
        {
          question: "Do you offer one-time consulting or ongoing support?",
          answer: [
            "Yes. Some clients need a focused review, audit preparation, or help with a specific risk. Others need ongoing monitoring, vulnerability management, hardening, and security improvement.",
            "We scope the work around the need and budget. We adapt the engagement to the company, not the other way around.",
          ],
        },
        {
          question: "Can you help with vulnerability scanning and security monitoring?",
          answer: [
            "Yes. We help organizations see vulnerabilities, exposed systems, security weaknesses, and operational risks more clearly.",
            "Depending on scope, we can support scanning, findings review, remediation guidance, hardening recommendations, and monitoring.",
          ],
        },
        {
          question: "Do you guarantee that my company will not be hacked?",
          answer: [
            "No honest provider can guarantee that. Cybersecurity requires shifting the question from \"Will I be hacked?\" to \"How do we operate when it happens?\"",
            "We work from a Zero Trust and assume-breach mindset: protect systems, data, and access even if someone is already inside the environment.",
          ],
        },
      ]
    : [
        {
          question: "Cuanto cuesta un servicio de ciberseguridad?",
          answer: [
            "Los pasos practicos de seguridad que detienen muchas amenazas basicas pueden ser mas economicos de lo que la gente piensa. Una base solida es alcanzable con presupuestos pequenos cuando las prioridades y los asesores son correctos.",
            "Un programa completo depende del alcance, tamano de la empresa, sistemas involucrados, urgencia y si el trabajo es puntual o continuo.",
            "Una conversacion corta de descubrimiento suele ser la mejor forma de recomendar un punto de partida practico.",
          ],
        },
        {
          question: "A que tipo de empresas ayudan?",
          answer: [
            "Trabajamos con empresas pequenas y medianas, con especial atencion a proteger el presupuesto del dueno mientras mejora la seguridad.",
            "Clientes comunes incluyen firmas contables y fiscales, practicas legales y de cumplimiento, servicios profesionales, clinicas de salud y bienestar, pequenos comercios y negocios locales.",
          ],
        },
        {
          question: "Por donde empezamos si no tenemos un programa de ciberseguridad?",
          answer: [
            "Empieza entendiendo que sistemas usas, que datos manejas, quien tiene acceso y que riesgos pueden afectar primero al negocio.",
            "Nuestro primer paso es ayudarte a descubrir donde estas y convertir eso en una hoja de ruta practica sin abrumar a tu equipo.",
          ],
        },
        {
          question: "Reemplazan a nuestro proveedor de TI?",
          answer: [
            "Podemos asumir o apoyar tareas de TI con alto componente de seguridad, pero no reemplazamos un helpdesk regular ni el soporte diario de TI.",
            "Trabajamos junto a tu equipo o proveedor actual para hacer trabajo pesado, asesorar, mejorar visibilidad, endurecer sistemas y reducir riesgo.",
          ],
        },
        {
          question: "Ley 81 y GDPR: que son y podemos ayudar?",
          answer: [
            "La Ley 81 en Panama y el GDPR en Europa son normas de proteccion de datos que importan cuando una empresa maneja datos personales.",
            "Ayudamos con el lado de seguridad de esas obligaciones identificando brechas e implementando estandares fuertes, incluyendo practicas de SGSI alineadas con ISO 27000, para que el negocio este mejor preparado ante exigencias de cumplimiento.",
            "Para interpretacion legal, recomendamos asesoria legal calificada.",
          ],
        },
        {
          question: "Que es un SGSI y por que importa ISO 27001?",
          answer: [
            "Un SGSI es la forma estructurada de gestionar seguridad de la informacion: riesgos, politicas, responsabilidades, controles, evidencias y mejora siguiendo estandares internacionales como ISO 27001.",
            "Podemos ayudarte a prepararlo, mantenerlo o mejorarlo traduciendo estos conceptos a terminos simples: quien hace que, como se hace y como seguir buenas practicas internacionales sin trabas innecesarias.",
          ],
        },
        {
          question: "Ofrecen consultoria puntual o soporte continuo?",
          answer: [
            "Si. Algunos clientes necesitan una revision puntual, preparacion para auditoria o apoyo con un riesgo especifico. Otros necesitan monitoreo, gestion de vulnerabilidades, hardening y mejora continua.",
            "Definimos el alcance segun la necesidad y el presupuesto. Adaptamos el servicio a la empresa, no al reves.",
          ],
        },
        {
          question: "Pueden ayudar con escaneo de vulnerabilidades y monitoreo?",
          answer: [
            "Si. Ayudamos a ver vulnerabilidades, sistemas expuestos, debilidades de seguridad y riesgos operativos con mayor claridad.",
            "Segun el alcance, podemos apoyar con escaneo, revision de hallazgos, guia de remediacion, recomendaciones de hardening y monitoreo.",
          ],
        },
        {
          question: "Garantizan que mi empresa no sera hackeada?",
          answer: [
            "Ningun proveedor honesto puede garantizar eso. La ciberseguridad requiere cambiar la pregunta de \"Me van a hackear?\" a \"Como operamos cuando pase?\"",
            "Trabajamos con una mentalidad de Zero Trust y asumir brecha: proteger sistemas, datos y accesos incluso si alguien ya esta dentro del entorno.",
          ],
        },
      ];

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
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            {isEn
              ? "Short answers to common questions. For anything specific, contact us and we will point you in the right direction."
              : "Respuestas cortas a preguntas comunes. Para algo especifico, contactanos y te orientamos en la direccion correcta."}
          </p>
        </div>

        <div className="min-w-0 space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openItem === index;
            const contentId = `faq-answer-${index}`;

            return (
              <div
                key={item.question}
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

        <div className="rounded-xl border border-neutral-200 bg-white/80 p-5 text-center shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/70">
          <h3 className="text-lg font-semibold tracking-tight">
            {isEn ? "Other questions?" : "Otras preguntas?"}
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            {isEn
              ? "Send us a short note and we will address your questions promptly."
              : "Envianos una nota breve y atenderemos tus preguntas con prontitud."}
          </p>
          <AnchorButton
            href="#contact"
            onClick={(event) => {
              event.preventDefault();
              onNavigate("contact");
            }}
            className="mt-4"
          >
            {isEn ? "Contact SafeGuard CCS" : "Contactar a SafeGuard CCS"}
            <ArrowDown className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-y-0.5" />
          </AnchorButton>
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
  const [contactMode, setContactMode] = React.useState<ContactMode>("methods");
  const [successPopupOpen, setSuccessPopupOpen] = React.useState(false);
  const [redirectTarget, setRedirectTarget] = React.useState<RedirectTarget | null>(null);
  const messageWordCount = getWordCount(message);

  const mailLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    isEn ? "SafeGuard CCS security consultation" : "Consulta de seguridad SafeGuard CCS"
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
        ? "Quick question / immediate direction"
        : "Pregunta rápida / dirección inmediata",
      href: WHATSAPP_LINK,
    },
    {
      kind: "email" as const,
      icon: Mail,
      label: isEn ? "Email" : "Correo",
      title: isEn ? "Send email" : "Correo",
      description: isEn
        ? "Details, content or documents"
        : "Detalles, contexto o documentos",
      href: mailLink,
    },
    {
      kind: "form" as const,
      icon: Send,
      label: isEn ? "Form" : "Formulario",
      title: isEn ? "Contact form" : "Formulario",
      description: isEn
        ? "If you want us to reach back"
        : "Para que te contactemos",
      href: "#contact-form",
    },
  ];

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
              {isEn
                ? "Everyone deserves security that respects the budget"
                : "Todos merecen seguridad que respete el presupuesto"}
            </h2>
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
              {isEn ? "Choose how to reach us" : "Elige cómo contactarnos"}
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
            {isEn ? "Back to contact options" : "Volver a opciones de contacto"}
          </button>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {isEn ? "Tell us about your environment" : "Cuéntanos sobre tu entorno"}
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

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium">
                    {isEn ? "Company" : "Empresa"}
                  </label>
                  <input
                    type="text"
                    name="company"
                    placeholder={isEn ? "Company S.A." : "Empresa S.A."}
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 bg-white/80 px-3 py-2 text-xs outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 dark:border-neutral-700 dark:bg-neutral-950/70 dark:focus:border-emerald-300"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium">
                    {isEn ? "Number of employees" : "Número de empleados"}
                  </label>
                  <input
                    type="text"
                    name="employees"
                    placeholder={isEn ? "E.g. 1-50" : "Ej. 1-50"}
                    value={employees}
                    onChange={(e) => setEmployees(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 bg-white/80 px-3 py-2 text-xs outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 dark:border-neutral-700 dark:bg-neutral-950/70 dark:focus:border-emerald-300"
                  />
                </div>
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
                  placeholder={
                    isEn
                      ? "Share a short description and we’ll reply with whether we’re a good fit and what a first engagement could look like."
                      : "Comparte una breve descripción y responderemos si somos un buen ajuste y cómo podría verse un primer servicio."
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
                        ? "Typical response: fast, with a 24-72 hour commitment."
                        : "Respuesta típica: rápida, con compromiso de 24-72 horas."}
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
