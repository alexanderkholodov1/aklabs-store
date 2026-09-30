import type { Locale } from "./i18n/locales"

/**
 * Author profile shown on the about page. Text provided by the owner; keep
 * facts here in sync with the LinkedIn profile and never add claims that
 * are not in it.
 */
type Profile = {
  role: string
  tagline: string
  short: string
  long: string[]
  highlights: { label: string; detail: string }[]
  skills: string[]
}

const en: Profile = {
  role: "Computer Science Engineering student",
  tagline:
    "Computer Science Engineering student, driven by curiosity and continuous learning. Balancing engineering with interdisciplinary creativity while building practical systems.",
  short:
    "Computer Science Engineering student at Universidad San Francisco de Quito, driven by curiosity and continuous learning. I balance engineering with interdisciplinary creativity and enjoy exploring diverse fields while building practical systems.",
  long: [
    "Computer Science Engineering student at the Universidad San Francisco de Quito (2023–2028) with interests in software development, web and application development, and applied technology projects.",
    "My work and learning span several areas of technology, and I actively pursue continuous learning through certifications, technical events, and independent projects. I approach problems with both an engineering mindset and a creative perspective that values interdisciplinary thinking.",
    "I am particularly motivated by building systems that transform ideas into practical solutions and improve real-world processes.",
    "Active participant in international programming competitions and hackathons such as TCS CodeVita and IEEEXtreme, as well as innovation and entrepreneurship events like the Diners Club Blue Challenge. Vice President of the IEEE Computer Society USFQ Chapter, mentor in the Competitive Programming Club, and private tutor in programming, mathematics, sciences, and languages (Spanish, English, and Russian).",
    "Background in audiovisual production with over three years of freelance experience as a video editor working with international clients, with strong proficiency in Adobe Premiere Pro and experience using Adobe Photoshop and Adobe Illustrator.",
    "Driven by curiosity and a philosophy of lifelong learning, I enjoy exploring different fields while building practical systems that bridge ideas, technology, and real-world impact.",
  ],
  highlights: [
    { label: "Education", detail: "Computer Science Engineering, Universidad San Francisco de Quito (2023–2028)" },
    { label: "Leadership", detail: "Vice President, IEEE Computer Society USFQ Chapter" },
    { label: "Competitions", detail: "TCS CodeVita, IEEEXtreme, Diners Club Blue Challenge" },
    { label: "Mentoring", detail: "Competitive Programming Club mentor and private tutor" },
    { label: "Creative work", detail: "3+ years as a freelance video editor for international clients" },
    { label: "Languages", detail: "Spanish, English and Russian" },
  ],
  skills: ["Software development", "Web and app development", "Competitive programming", "Video editing", "Adobe Premiere Pro", "Photoshop", "Illustrator"],
}

const es: Profile = {
  role: "Estudiante de Ingeniería en Ciencias de la Computación",
  tagline:
    "Estudiante de Ing. en Ciencias de la Computación, motivado por la curiosidad y el aprendizaje continuo. Balanceo la ingeniería con creatividad interdisciplinaria y disfruto explorar áreas más diversas mientras construyo sistemas prácticos.",
  short:
    "Estudiante de Ingeniería en Ciencias de la Computación en la Universidad San Francisco de Quito, motivado por la curiosidad y el aprendizaje continuo. Balanceo la ingeniería con creatividad interdisciplinaria y disfruto explorar áreas diversas mientras construyo sistemas prácticos.",
  long: [
    "Estudiante de Ingeniería en Ciencias de la Computación en la Universidad San Francisco de Quito (2023–2028), con intereses en el desarrollo de software, desarrollo web y de aplicaciones, y proyectos tecnológicos aplicados.",
    "Mi formación y experiencia abarcan diversas áreas de la tecnología, y busco activamente el aprendizaje continuo mediante certificaciones, eventos tecnológicos y proyectos independientes. Abordo los problemas combinando una mentalidad de ingeniería con una perspectiva creativa que valora el pensamiento interdisciplinario.",
    "Me motiva especialmente el desarrollo de sistemas que transformen ideas en soluciones prácticas y contribuyan a mejorar procesos del mundo real.",
    "Participante activo en competencias internacionales de programación y hackathons como TCS CodeVita e IEEEXtreme, así como en eventos de innovación y emprendimiento como el Diners Club Blue Challenge. Vicepresidente del capítulo de la IEEE Computer Society en la USFQ, mentor en el Club de Programación Competitiva, y tutor privado en programación, matemáticas, ciencias e idiomas (español, inglés y ruso).",
    "Cuento además con experiencia en producción audiovisual, con más de tres años de trabajo independiente como editor de video para clientes internacionales, con dominio de Adobe Premiere Pro, Adobe Photoshop y Adobe Illustrator.",
    "Motivado por la curiosidad intelectual y una filosofía de aprendizaje continuo, disfruto explorar distintos campos mientras desarrollo sistemas prácticos que conectan ideas, tecnología e impacto en el mundo real.",
  ],
  highlights: [
    { label: "Formación", detail: "Ingeniería en Ciencias de la Computación, Universidad San Francisco de Quito (2023–2028)" },
    { label: "Liderazgo", detail: "Vicepresidente, IEEE Computer Society, capítulo USFQ" },
    { label: "Competencias", detail: "TCS CodeVita, IEEEXtreme, Diners Club Blue Challenge" },
    { label: "Mentoría", detail: "Mentor del Club de Programación Competitiva y tutor privado" },
    { label: "Trabajo creativo", detail: "Más de 3 años como editor de video freelance para clientes internacionales" },
    { label: "Idiomas", detail: "Español, inglés y ruso" },
  ],
  skills: ["Desarrollo de software", "Desarrollo web y de apps", "Programación competitiva", "Edición de video", "Adobe Premiere Pro", "Photoshop", "Illustrator"],
}

const profiles: Record<Locale, Profile> = { en, es }

export function profileFor(locale: Locale): Profile {
  return profiles[locale] ?? profiles.en
}
