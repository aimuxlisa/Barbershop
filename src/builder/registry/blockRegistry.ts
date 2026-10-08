import React from "react";
import { PageBlock } from "@/types/project";
import {
  HeroBlock,
  FeaturesBlock,
  ServicesBlock,
  TextImageBlock,
  GalleryBlock,
  StatisticsBlock,
  PricingBlock,
  TeamBlock,
  ReviewsBlock,
  FAQBlock,
  ContactsBlock,
  FooterBlock,
  CTABlock,
  BlogPreviewBlock,
  HeaderBlock,
} from "@/builder/blocks/BlockComponents";

export interface BlockDefinition {
  type: string;
  label: string;
  category: string;
  description: string;
  variants: Array<{ id: string; label: string }>;
  createDefault: () => PageBlock;
  renderer: React.ComponentType<{
    block: PageBlock;
    locale: string;
    breakpoint: any;
    isEditing?: boolean;
  }>;
}

class BlockRegistry {
  private definitions = new Map<string, BlockDefinition>();

  register(definition: BlockDefinition) {
    this.definitions.set(definition.type, definition);
  }

  get(type: string): BlockDefinition | undefined {
    return this.definitions.get(type);
  }

  getAll(): BlockDefinition[] {
    return Array.from(this.definitions.values());
  }

  getByCategory(category: string): BlockDefinition[] {
    return this.getAll().filter((def) => def.category === category);
  }

  createBlock(type: string, variant?: string): PageBlock | null {
    const def = this.get(type);
    if (!def) return null;
    const block = def.createDefault();
    if (variant) block.variant = variant;
    return block;
  }
}

export const blockRegistry = new BlockRegistry();

// 0. Header
blockRegistry.register({
  type: "header",
  label: "Header / Navigation",
  category: "layout",
  description: "Sticky navigation bar bound to the project Main Menu",
  variants: [{ id: "default", label: "Default" }],
  createDefault: () => ({
    id: `block_header_${Date.now()}`,
    type: "header",
    variant: "default",
    content: {
      title: { ru: "KMS::CMS", en: "KMS::CMS", uz: "KMS::CMS" },
    },
    styles: { spacing: { padding: { desktop: { top: 0, bottom: 0, left: 16, right: 16 } } } },
  }),
  renderer: HeaderBlock,
});

// 1. Hero
blockRegistry.register({
  type: "hero",
  label: "Hero Section",
  category: "marketing",
  description: "Centered or split layout with CTA and badge",
  variants: [{ id: "centered", label: "Centered" }, { id: "split", label: "Split" }],
  createDefault: () => ({
    id: `block_hero_${Date.now()}`,
    type: "hero",
    variant: "centered",
    content: {
      title: { ru: "Новый заголовок Hero", en: "New Hero Title", uz: "Yangi Hero Sarlavhasi" },
      description: {
        ru: "Краткое описание секции для привлечения внимания пользователей.",
        en: "Engaging section description to captivate visitors.",
        uz: "Foydalanuvchilarni jalb qilish uchun qisqacha tavsif.",
      },
      primaryButtonText: { ru: "Начать", en: "Get Started", uz: "Boshlash" },
      primaryButtonLink: { type: "url", url: "#", openInNewTab: false },
      badgeText: { ru: "FEATURED // v2.0", en: "FEATURED // v2.0", uz: "FEATURED // v2.0" },
    },
    styles: { spacing: { padding: { desktop: { top: 64, bottom: 64, left: 24, right: 24 } } } },
  }),
  renderer: HeroBlock,
});

// 2. Features
blockRegistry.register({
  type: "features",
  label: "Features Grid",
  category: "marketing",
  description: "3-column grid highlighting key features",
  variants: [{ id: "grid", label: "Grid" }],
  createDefault: () => ({
    id: `block_feat_${Date.now()}`,
    type: "features",
    variant: "grid",
    content: {
      title: { ru: "Ключевые возможности", en: "Key Features", uz: "Asosiy imkoniyatlar" },
      subtitle: { ru: "Все необходимое для быстрого старта", en: "Everything you need to launch fast", uz: "Barcha vositalar" },
      items: [
        { title: { ru: "Скорость работы", en: "Fast Execution", uz: "Tezkor" }, desc: { ru: "Мгновенный рендеринг", en: "Lightning fast", uz: "Tezkor render" } },
        { title: { ru: "Надежность", en: "Reliable Memory", uz: "Ishonchli" }, desc: { ru: "IndexedDB гарантирует сохранность", en: "IndexedDB keeps safe", uz: "IndexedDB xotirasi" } },
        { title: { ru: "Адаптивность", en: "Desktop-First", uz: "Moslashuvchan" }, desc: { ru: "Каскад стилей от Desktop", en: "Seamless cascade", uz: "Kaskad merosi" } },
      ],
    },
    styles: { spacing: { padding: { desktop: { top: 48, bottom: 48, left: 24, right: 24 } } } },
  }),
  renderer: FeaturesBlock,
});

// 3. Services
blockRegistry.register({
  type: "services",
  label: "Services",
  category: "marketing",
  description: "Display service offerings and solutions",
  variants: [{ id: "default", label: "Default" }],
  createDefault: () => ({
    id: `block_serv_${Date.now()}`,
    type: "services",
    variant: "default",
    content: {
      title: { ru: "Наши Услуги", en: "Our Services", uz: "Bizning Xizmatlar" },
      description: { ru: "Полный спектр технологических решений", en: "Full suite of tech solutions", uz: "Texnologik yechimlar" },
    },
    styles: { spacing: { padding: { desktop: { top: 48, bottom: 48, left: 24, right: 24 } } } },
  }),
  renderer: ServicesBlock,
});

// 4. Text + Image
blockRegistry.register({
  type: "text_image",
  label: "Text + Image",
  category: "content",
  description: "Split content with descriptive text and media preview",
  variants: [{ id: "default", label: "Default" }],
  createDefault: () => ({
    id: `block_txtimg_${Date.now()}`,
    type: "text_image",
    variant: "default",
    content: {
      title: { ru: "Инновационная архитектура", en: "Innovative Architecture", uz: "Innovatsion arxitektura" },
      description: { ru: "Модульный подход к разработке.", en: "Modular architecture approach.", uz: "Modulli yondashuv." },
    },
    styles: { spacing: { padding: { desktop: { top: 48, bottom: 48, left: 24, right: 24 } } } },
  }),
  renderer: TextImageBlock,
});

// 5. Gallery
blockRegistry.register({
  type: "gallery",
  label: "Media Gallery",
  category: "media",
  description: "Grid showcase of project images",
  variants: [{ id: "grid", label: "Grid" }],
  createDefault: () => ({
    id: `block_gal_${Date.now()}`,
    type: "gallery",
    variant: "grid",
    content: { title: { ru: "Медиа Галерея", en: "Media Gallery", uz: "Media Galereya" } },
    styles: { spacing: { padding: { desktop: { top: 48, bottom: 48, left: 24, right: 24 } } } },
  }),
  renderer: GalleryBlock,
});

// 6. Statistics
blockRegistry.register({
  type: "statistics",
  label: "Statistics",
  category: "marketing",
  description: "Display numerical counters and KPIs",
  variants: [{ id: "default", label: "Default" }],
  createDefault: () => ({
    id: `block_stat_${Date.now()}`,
    type: "statistics",
    variant: "default",
    content: { title: { ru: "Системные показатели", en: "System Metrics", uz: "Tizim ko'rsatkichlari" } },
    styles: { spacing: { padding: { desktop: { top: 48, bottom: 48, left: 24, right: 24 } } } },
  }),
  renderer: StatisticsBlock,
});

// 7. Pricing
blockRegistry.register({
  type: "pricing",
  label: "Pricing Tables",
  category: "marketing",
  description: "Tiered pricing comparison table",
  variants: [{ id: "cards", label: "Cards" }],
  createDefault: () => ({
    id: `block_price_${Date.now()}`,
    type: "pricing",
    variant: "cards",
    content: { title: { ru: "Тарифные планы", en: "Pricing Plans", uz: "Tarif rejalari" } },
    styles: { spacing: { padding: { desktop: { top: 48, bottom: 48, left: 24, right: 24 } } } },
  }),
  renderer: PricingBlock,
});

// 8. Team
blockRegistry.register({
  type: "team",
  label: "Team Members",
  category: "marketing",
  description: "Grid display of team members",
  variants: [{ id: "default", label: "Default" }],
  createDefault: () => ({
    id: `block_team_${Date.now()}`,
    type: "team",
    variant: "default",
    content: { title: { ru: "Наша Команда", en: "Our Team", uz: "Bizning Jamoa" } },
    styles: { spacing: { padding: { desktop: { top: 48, bottom: 48, left: 24, right: 24 } } } },
  }),
  renderer: TeamBlock,
});

// 9. Reviews
blockRegistry.register({
  type: "reviews",
  label: "Testimonials",
  category: "marketing",
  description: "Customer feedback and reviews with stars",
  variants: [{ id: "default", label: "Default" }],
  createDefault: () => ({
    id: `block_rev_${Date.now()}`,
    type: "reviews",
    variant: "default",
    content: { title: { ru: "Отзывы клиентов", en: "Client Reviews", uz: "Mijozlar fikrlari" } },
    styles: { spacing: { padding: { desktop: { top: 48, bottom: 48, left: 24, right: 24 } } } },
  }),
  renderer: ReviewsBlock,
});

// 10. FAQ
blockRegistry.register({
  type: "faq",
  label: "FAQ",
  category: "content",
  description: "Accordion style frequently asked questions",
  variants: [{ id: "default", label: "Default" }],
  createDefault: () => ({
    id: `block_faq_${Date.now()}`,
    type: "faq",
    variant: "default",
    content: { title: { ru: "Частые Вопросы", en: "FAQ", uz: "Ko'p beriladigan savollar" } },
    styles: { spacing: { padding: { desktop: { top: 48, bottom: 48, left: 24, right: 24 } } } },
  }),
  renderer: FAQBlock,
});

// 11. Contacts
blockRegistry.register({
  type: "contacts",
  label: "Contact Form",
  category: "forms",
  description: "Form with Action URL support for Formspree/Netlify",
  variants: [{ id: "default", label: "Default" }],
  createDefault: () => ({
    id: `block_contact_${Date.now()}`,
    type: "contacts",
    variant: "default",
    content: {
      title: { ru: "Связаться с нами", en: "Contact Command", uz: "Biz bilan bog'lanish" },
      actionUrl: "https://formspree.io/f/demo",
    },
    styles: { spacing: { padding: { desktop: { top: 48, bottom: 48, left: 24, right: 24 } } } },
  }),
  renderer: ContactsBlock,
});

// 12. Footer
blockRegistry.register({
  type: "footer",
  label: "Footer Section",
  category: "layout",
  description: "Bottom navigation and copyright",
  variants: [{ id: "default", label: "Default" }],
  createDefault: () => ({
    id: `block_footer_${Date.now()}`,
    type: "footer",
    variant: "default",
    content: {},
    styles: { spacing: { padding: { desktop: { top: 32, bottom: 32, left: 24, right: 24 } } } },
  }),
  renderer: FooterBlock,
});

// 13. CTA
blockRegistry.register({
  type: "cta",
  label: "Call to Action",
  category: "marketing",
  description: "High conversion CTA banner",
  variants: [{ id: "default", label: "Default" }],
  createDefault: () => ({
    id: `block_cta_${Date.now()}`,
    type: "cta",
    variant: "default",
    content: {
      title: { ru: "Готовы развернуть ваш следующий проект?", en: "Ready to deploy your next vision?", uz: "Keyingi loyihangizni boshlashga tayyormisiz?" },
      buttonText: { ru: "Начать бесплатно", en: "Start Free", uz: "Bepul boshlash" },
    },
    styles: { spacing: { padding: { desktop: { top: 48, bottom: 48, left: 24, right: 24 } } } },
  }),
  renderer: CTABlock,
});

// 14. Blog Preview
blockRegistry.register({
  type: "blog_preview",
  label: "Blog Preview Grid",
  category: "content",
  description: "Live grid of published articles loaded from the Posts Manager",
  variants: [{ id: "grid", label: "Grid" }],
  createDefault: () => ({
    id: `block_blog_${Date.now()}`,
    type: "blog_preview",
    variant: "grid",
    content: {
      title: { ru: "Последние статьи", en: "Latest Articles", uz: "So'nggi maqolalar" },
      subtitle: {
        ru: "Новости команды, разборы и обновления продукта",
        en: "Team news, deep dives and product updates",
        uz: "Jamoa yangiliklari va mahsulot yangilanishlari",
      },
      limit: 6,
    },
    styles: { spacing: { padding: { desktop: { top: 48, bottom: 48, left: 24, right: 24 } } } },
  }),
  renderer: BlogPreviewBlock,
});
