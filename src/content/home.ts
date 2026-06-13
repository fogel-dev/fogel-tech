export type Locale = "ru" | "en";

export type Project = {
  slug: string;
  title: string;
  description: string;
  role: string;
  year: string;
  index: string;
  technologies: string[];
  href: string;
  visual: "signal" | "atlas" | "flow";
};

export type HomeDictionary = {
  meta: { title: string; description: string };
  nav: {
    work: string;
    approach: string;
    stack: string;
    contact: string;
    menu: string;
  };
  hero: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    description: string;
    viewWork: string;
    contact: string;
    availability: string;
    scroll: string;
  };
  statement: {
    eyebrow: string;
    lineOne: string;
    lineTwo: string;
    description: string;
    metrics: { value: string; label: string }[];
  };
  projects: {
    eyebrow: string;
    title: string;
    view: string;
    items: Project[];
  };
  approach: {
    eyebrow: string;
    title: string;
    items: { number: string; title: string; description: string }[];
  };
  stack: {
    eyebrow: string;
    title: string;
    description: string;
    technologies: string[];
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    email: string;
    copy: string;
    copied: string;
  };
  footer: string;
};

const sharedProjects = {
  ru: [
    {
      slug: "signal-platform",
      title: "Signal / Platform",
      description:
        "Продуктовая платформа для команд, которым важно видеть сложные процессы как единую живую систему.",
      role: "Lead Frontend / Product",
      year: "2026",
      index: "01",
      technologies: ["Next.js", "TypeScript", "WebGL"],
      href: "#contact",
      visual: "signal" as const,
    },
    {
      slug: "atlas-workspace",
      title: "Atlas / Workspace",
      description:
        "Интеллектуальное рабочее пространство с фокусом на скорость, ясность и сложные сценарии данных.",
      role: "Frontend Architecture",
      year: "2025",
      index: "02",
      technologies: ["React", "Design System", "Motion"],
      href: "#contact",
      visual: "atlas" as const,
    },
    {
      slug: "flow-commerce",
      title: "Flow / Commerce",
      description:
        "Новый покупательский опыт, где интерфейс помогает принимать решения, а не мешает им.",
      role: "Senior Frontend",
      year: "2025",
      index: "03",
      technologies: ["Performance", "A11y", "Analytics"],
      href: "#contact",
      visual: "flow" as const,
    },
  ],
  en: [
    {
      slug: "signal-platform",
      title: "Signal / Platform",
      description:
        "A product platform that turns complex team processes into one clear, living system.",
      role: "Lead Frontend / Product",
      year: "2026",
      index: "01",
      technologies: ["Next.js", "TypeScript", "WebGL"],
      href: "#contact",
      visual: "signal" as const,
    },
    {
      slug: "atlas-workspace",
      title: "Atlas / Workspace",
      description:
        "An intelligent workspace designed for speed, clarity and demanding data workflows.",
      role: "Frontend Architecture",
      year: "2025",
      index: "02",
      technologies: ["React", "Design System", "Motion"],
      href: "#contact",
      visual: "atlas" as const,
    },
    {
      slug: "flow-commerce",
      title: "Flow / Commerce",
      description:
        "A commerce experience where the interface supports decisions instead of interrupting them.",
      role: "Senior Frontend",
      year: "2025",
      index: "03",
      technologies: ["Performance", "A11y", "Analytics"],
      href: "#contact",
      visual: "flow" as const,
    },
  ],
};

export const dictionaries: Record<Locale, HomeDictionary> = {
  ru: {
    meta: {
      title: "Егор Фогель — Senior Frontend Developer",
      description:
        "Проектирую и создаю выразительные цифровые продукты, где инженерная точность встречается с визуальным характером.",
    },
    nav: {
      work: "Проекты",
      approach: "Подход",
      stack: "Стек",
      contact: "Контакты",
      menu: "Меню",
    },
    hero: {
      eyebrow: "Senior Frontend Developer / Novosibirsk",
      titleLead: "Создаю интерфейсы,",
      titleAccent: "которые ощущаются.",
      description:
        "Соединяю продуктовый взгляд, frontend-архитектуру и motion-дизайн в быстрых и запоминающихся цифровых продуктах.",
      viewWork: "Смотреть проекты",
      contact: "Обсудить задачу",
      availability: "Открыт к сильным идеям",
      scroll: "Исследовать",
    },
    statement: {
      eyebrow: "01 / Позиционирование",
      lineOne: "Не просто собираю экраны.",
      lineTwo: "Проектирую поведение продукта.",
      description:
        "От первой гипотезы и структуры интерфейса до архитектуры, анимации и производительности. Мне важно, чтобы сложное становилось ясным, а технология усиливала идею.",
      metrics: [
        { value: "8+", label: "лет в разработке" },
        { value: "∞", label: "внимания к деталям" },
        { value: "01", label: "цельный продукт" },
      ],
    },
    projects: {
      eyebrow: "02 / Избранные проекты",
      title: "Работы, в которых идея стала системой.",
      view: "Открыть кейс",
      items: sharedProjects.ru,
    },
    approach: {
      eyebrow: "03 / Подход",
      title: "Три масштаба одной работы.",
      items: [
        {
          number: "01",
          title: "Продукт",
          description:
            "Начинаю с задачи, контекста и человека. Код имеет смысл только после ответа на вопрос «зачем».",
        },
        {
          number: "02",
          title: "Инженерия",
          description:
            "Строю прозрачную архитектуру, которая выдерживает развитие продукта и остается понятной команде.",
        },
        {
          number: "03",
          title: "Выразительность",
          description:
            "Использую типографику, движение и детали как функциональный язык, а не декоративный слой.",
        },
      ],
    },
    stack: {
      eyebrow: "04 / Инструменты",
      title: "Технологии меняются. Принципы остаются.",
      description:
        "Выбираю инструменты под задачу, но особенно хорошо знаю современную React-экосистему, дизайн-системы и производительные интерфейсы.",
      technologies: [
        "TypeScript",
        "React",
        "Next.js",
        "Architecture",
        "Design Systems",
        "WebGL",
        "Motion",
        "Performance",
        "Accessibility",
      ],
    },
    contact: {
      eyebrow: "05 / Контакт",
      title: "Есть идея, которой нужен сильный интерфейс?",
      description:
        "Давайте превратим ее в продукт, который будет приятно использовать и сложно забыть.",
      email: "hello@egorfogel.dev",
      copy: "Скопировать email",
      copied: "Email скопирован",
    },
    footer: "Спроектировано и собрано с вниманием к деталям.",
  },
  en: {
    meta: {
      title: "Egor Fogel — Senior Frontend Developer",
      description:
        "I design and build expressive digital products where engineering precision meets visual character.",
    },
    nav: {
      work: "Work",
      approach: "Approach",
      stack: "Stack",
      contact: "Contact",
      menu: "Menu",
    },
    hero: {
      eyebrow: "Senior Frontend Developer / Novosibirsk",
      titleLead: "I build interfaces",
      titleAccent: "you can feel.",
      description:
        "Bringing product thinking, frontend architecture and motion design together in fast, memorable digital products.",
      viewWork: "Explore selected work",
      contact: "Start a conversation",
      availability: "Open to bold ideas",
      scroll: "Explore",
    },
    statement: {
      eyebrow: "01 / Position",
      lineOne: "I do more than assemble screens.",
      lineTwo: "I design how products behave.",
      description:
        "From the first hypothesis and interface structure to architecture, motion and performance. I make complexity clear and use technology to strengthen the idea.",
      metrics: [
        { value: "8+", label: "years building" },
        { value: "∞", label: "attention to detail" },
        { value: "01", label: "coherent product" },
      ],
    },
    projects: {
      eyebrow: "02 / Selected work",
      title: "Ideas developed into systems.",
      view: "Open case study",
      items: sharedProjects.en,
    },
    approach: {
      eyebrow: "03 / Approach",
      title: "Three scales of one craft.",
      items: [
        {
          number: "01",
          title: "Product",
          description:
            "I start with the problem, context and person. Code only makes sense after answering why.",
        },
        {
          number: "02",
          title: "Engineering",
          description:
            "I build transparent architecture that can grow with the product and remain clear to the team.",
        },
        {
          number: "03",
          title: "Expression",
          description:
            "Typography, motion and detail become a functional language, not a decorative layer.",
        },
      ],
    },
    stack: {
      eyebrow: "04 / Toolkit",
      title: "Technologies change. Principles remain.",
      description:
        "I choose tools for the problem, with particular depth in the modern React ecosystem, design systems and high-performance interfaces.",
      technologies: [
        "TypeScript",
        "React",
        "Next.js",
        "Architecture",
        "Design Systems",
        "WebGL",
        "Motion",
        "Performance",
        "Accessibility",
      ],
    },
    contact: {
      eyebrow: "05 / Contact",
      title: "Have an idea that deserves a strong interface?",
      description:
        "Let’s turn it into a product that feels good to use and is hard to forget.",
      email: "hello@egorfogel.dev",
      copy: "Copy email",
      copied: "Email copied",
    },
    footer: "Designed and built with attention to detail.",
  },
};
