export type Breakpoint = 'desktop' | 'tablet' | 'mobile';

export type LocalizedText = Record<string, string>;

export type ResponsiveValue<T> = {
  desktop?: T;
  tablet?: T;
  mobile?: T;
};

export type SpacingValue = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type LinkType = 'page' | 'url' | 'tel' | 'email';

export interface LinkConfig {
  type: LinkType;
  pageId?: string;
  url?: string;
  openInNewTab?: boolean;
}

export interface FormActionConfig {
  actionUrl: string;
  method: 'POST' | 'GET';
  successMessage?: LocalizedText;
  errorMessage?: LocalizedText;
  redirectUrl?: string;
  hiddenFields?: Record<string, string>;
}

export type BlockId = string;

export interface BlockStyles {
  spacing?: {
    padding?: ResponsiveValue<SpacingValue>;
    margin?: ResponsiveValue<SpacingValue>;
    gap?: ResponsiveValue<number>;
  };
  sizing?: {
    width?: ResponsiveValue<number | string>;
    maxWidth?: ResponsiveValue<number | string>;
    minHeight?: ResponsiveValue<number | string>;
  };
  background?: {
    type?: 'color' | 'gradient' | 'image';
    color?: string;
    value?: string;
    imageUrl?: string;
    overlay?: string;
  };
  border?: {
    width?: number;
    style?: 'solid' | 'dashed' | 'dotted' | 'none';
    color?: string;
    radius?: ResponsiveValue<number>;
  };
  typography?: {
    fontFamily?: string;
    fontSize?: ResponsiveValue<number>;
    fontWeight?: number;
    lineHeight?: ResponsiveValue<number>;
    letterSpacing?: ResponsiveValue<number>;
    textAlign?: ResponsiveValue<'left' | 'center' | 'right' | 'justify'>;
    color?: string;
  };
  layout?: {
    display?: 'block' | 'flex' | 'grid';
    columns?: ResponsiveValue<number>;
    direction?: ResponsiveValue<'row' | 'column'>;
    alignItems?: string;
    justifyContent?: string;
  };
}

export interface PageBlock {
  id: BlockId;
  type: string;
  variant: string;
  content: Record<string, unknown>;
  styles: BlockStyles;
  hidden?: boolean;
}

export interface PageSEO {
  title?: LocalizedText;
  description?: LocalizedText;
  canonical?: string;
  ogTitle?: LocalizedText;
  ogDescription?: LocalizedText;
  ogImage?: string;
  noIndex?: boolean;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  blocks: PageBlock[];
  seo: PageSEO;
  createdAt: string;
  updatedAt: string;
}

export interface GlobalStyles {
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
  };
  containerMaxWidth: number;
}

export interface SiteProject {
  id: string;
  name: string;
  defaultLocale: string;
  locales: string[];
  pages: Page[];
  globalStyles: GlobalStyles;
  translations: Record<string, LocalizedText>;
  schemaVersion?: number;
}
