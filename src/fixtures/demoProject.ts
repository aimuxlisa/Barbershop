import { SiteProject } from "@/types/project";

export const demoProject: SiteProject = {
  id: "proj_cyber_01",
  name: "KMS Cyber Matrix",
  defaultLocale: "ru",
  locales: ["ru", "en", "uz"],
  globalStyles: {
    colors: {
      primary: "#ff0080",
      secondary: "#00f0ff",
      text: "#f8fafc",
      background: "#07070c",
    },
    typography: {
      headingFont: "Inter",
      bodyFont: "Inter",
    },
    radius: {
      sm: 4,
      md: 8,
      lg: 12,
    },
    containerMaxWidth: 1200,
  },
  translations: {
    btn_start: {
      ru: "Начать работу",
      en: "Get Started",
      uz: "Boshlash",
    },
    btn_learn_more: {
      ru: "Узнать больше",
      en: "Learn More",
      uz: "Batafsil",
    },
  },
  pages: [
    {
      id: "page_home",
      title: "Главная",
      slug: "index",
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      seo: {
        title: {
          ru: "KMS — Кибернетический Конструктор Сайтов",
          en: "KMS — Cybernetic Site Builder",
          uz: "KMS — Kibernetik Sayt Yaratuvchisi",
        },
        description: {
          ru: "Продвинутый конструктор веб-приложений с поддержкой IndexedDB и статического экспорта.",
          en: "Advanced web builder with IndexedDB persistence and static export.",
          uz: "IndexedDB va statik eksport bilan ilg'or veb-sayt yaratuvchisi.",
        },
      },
      blocks: [
        {
          id: "block_hero_1",
          type: "hero",
          variant: "centered",
          content: {
            title: {
              ru: "Кибернетический центр мониторинга и сборки сайтов",
              en: "Cybernetic Monitoring & Site Generation Command",
              uz: "Kibernetik monitoring va sayt yaratish markazi",
            },
            description: {
              ru: "Создавайте многостраничные адаптивные сайты нового поколения с надежным хранилищем IndexedDB и мгновенным экспортом.",
              en: "Build next-generation multi-page responsive sites with unlimited IndexedDB persistence and fast static export.",
              uz: "IndexedDB xotirasi va tezkor statik eksport bilan yangi avlod veb-saytlarini yarating.",
            },
            primaryButtonText: {
              ru: "Запустить систему",
              en: "Launch System",
              uz: "Tizimni ishga tushirish",
            },
            primaryButtonLink: {
              type: "url",
              url: "#explore",
              openInNewTab: false,
            },
            secondaryButtonText: {
              ru: "Документация",
              en: "Documentation",
              uz: "Hujjatlar",
            },
            badgeText: {
              ru: "KMS CORE v2.4 // ONLINE",
              en: "KMS CORE v2.4 // ONLINE",
              uz: "KMS CORE v2.4 // ONLINE",
            },
          },
          styles: {
            spacing: {
              padding: {
                desktop: { top: 64, bottom: 64, left: 24, right: 24 },
                tablet: { top: 48, bottom: 48, left: 16, right: 16 },
                mobile: { top: 32, bottom: 32, left: 12, right: 12 },
              },
            },
          },
        },
        {
          id: "block_features_1",
          type: "features",
          variant: "grid",
          content: {
            title: {
              ru: "Архитектурные модули платформы",
              en: "Core Architecture Modules",
              uz: "Platformaning asosiy arxitektura modullari",
            },
            subtitle: {
              ru: "Высокая производительность, надежность и гибкость",
              en: "High performance, bulletproof reliability and extreme flexibility",
              uz: "Yuqori samaradorlik va ishonchlilik",
            },
            items: [
              {
                title: { ru: "IndexedDB Хранилище", en: "IndexedDB Memory", uz: "IndexedDB Xotira" },
                desc: { ru: "Работа с медиафайлами любого размера без ограничений LocalStorage", en: "Zero quota errors with idb-keyval media storage", uz: "Cheklovlarsiz media saqlash" },
              },
              {
                title: { ru: "Desktop-First Каскад", en: "Desktop-First Cascade", uz: "Desktop-First Kaskad" },
                desc: { ru: "Интуитивное нисходящее наследование стилей от больших экранов к мобильным", en: "Predictable downward responsive inheritance", uz: "Katta ekrandan mobilga uslub merosi" },
              },
              {
                title: { ru: "Статический экспорт", en: "Static Form Export", uz: "Statik eksport" },
                desc: { ru: "Готовые формы с Action URL под Formspree, Netlify и Getform в чистом HTML", en: "Clean HTML bundle with full form integration", uz: "Formspree va Netlify uchun toza HTML" },
              },
            ],
          },
          styles: {
            spacing: {
              padding: {
                desktop: { top: 48, bottom: 48, left: 24, right: 24 },
              },
            },
          },
        },
      ],
    },
  ],
};
