# SPEC — Visual Site Builder

## 1. Технологический стек

### Frontend

- Next.js App Router
- React
- TypeScript strict
- Tailwind CSS
- shadcn/ui
- Lucide Icons

### State

- Zustand для состояния редактора
- history slice / отдельный history manager для undo/redo

### Drag-and-drop

- @dnd-kit/core
- @dnd-kit/sortable

### Forms / validation

- React Hook Form
- Zod

### MVP persistence

Этап 1:

- IndexedDB (через библиотеку `idb-keyval` для надежного хранения проектов и медиа без лимита в 5 МБ LocalStorage)

Позже:

- база данных через repository/service abstraction

Это позволяет собрать полноценный работающий editor без backend, поддерживающий загрузку изображений любого размера.

---

## 2. Главный архитектурный принцип

Не связывать editor напрямую с конкретными React-компонентами.

Использовать:

```text
Page JSON
   ↓
Block Registry
   ↓
Page Renderer
```

Editor изменяет JSON.

Renderer строит UI по JSON.

Export Engine использует ту же структуру данных.

---

## 3. Основные сущности

```ts
type Breakpoint = 'desktop' | 'tablet' | 'mobile';

type LocalizedText = Record<string, string>;

type ResponsiveValue<T> = {
  desktop?: T;
  tablet?: T;
  mobile?: T;
};

type SpacingValue = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type LinkType = 'page' | 'url' | 'tel' | 'email';

interface LinkConfig {
  type: LinkType;
  pageId?: string;       // для type === 'page'
  url?: string;          // для type === 'url' | 'tel' | 'email'
  openInNewTab?: boolean; // rel="noopener noreferrer"
}

interface FormActionConfig {
  actionUrl: string;     // URL эндпоинта (Formspree, Netlify, Getform и др.)
  method: 'POST' | 'GET';
  successMessage?: LocalizedText;
  errorMessage?: LocalizedText;
  redirectUrl?: string;
  hiddenFields?: Record<string, string>;
}

type BlockId = string;

interface PageBlock {
  id: BlockId;
  type: string;
  variant: string;
  content: Record<string, unknown>;
  styles: BlockStyles;
  hidden?: boolean;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  blocks: PageBlock[];
  seo: PageSEO;
  createdAt: string;
  updatedAt: string;
}

interface SiteProject {
  id: string;
  name: string;
  defaultLocale: string;
  locales: string[];
  pages: Page[];
  globalStyles: GlobalStyles;
  translations: Record<string, LocalizedText>;
  schemaVersion?: number; // для миграций backup
}
```

---

## 4. Style model

```ts
interface BlockStyles {
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
```

---

## 5. Responsive inheritance (Desktop-First)

Функция:

```ts
resolveResponsiveValue<T>(value: ResponsiveValue<T> | undefined, breakpoint: Breakpoint, defaultValue?: T): T | undefined
```

Логика (Desktop-First):

```text
desktop:
  desktop ?? defaultValue

tablet:
  tablet ?? desktop ?? defaultValue

mobile:
  mobile ?? tablet ?? desktop ?? defaultValue
```

Это должно использоваться централизованно через единый helper.

Не размазывать fallback-логику по компонентам.

---

## 6. Block Registry

Каждый блок регистрируется через декларативную конфигурацию.

```ts
interface BlockDefinition {
  type: string;
  label: string;
  category: string;

  variants: BlockVariant[];

  createDefault: () => PageBlock;

  renderer: React.ComponentType<BlockRendererProps>;

  inspector: {
    content: ControlDefinition[];
    style: ControlDefinition[];
  };
}
```

Пример:

```ts
const heroDefinition: BlockDefinition = {
  type: 'hero',
  label: 'Hero',
  category: 'marketing',

  variants: [
    { id: 'centered', label: 'Centered' },
    { id: 'split', label: 'Split' }
  ],

  createDefault: () => ({
    id: crypto.randomUUID(),
    type: 'hero',
    variant: 'centered',
    content: {
      title: {
        ru: 'Заголовок',
        en: 'Heading',
        uz: 'Sarlavha'
      },
      buttonLink: {
        type: 'page',
        pageId: 'page-contacts',
        openInNewTab: false
      }
    },
    styles: {}
  }),

  renderer: HeroBlock,

  inspector: {
    content: [],
    style: []
  }
};
```

---

## 7. Registry API

```ts
registerBlock(definition)
getBlockDefinition(type)
getAllBlocks()
getBlocksByCategory(category)
createBlock(type, variant?)
```

Новый тип блока должен подключаться через registry без изменений ядра PageRenderer.

---

## 8. Page Renderer

```tsx
<PageRenderer
  page={page}
  mode="editor"
/>
```

Режимы:

```ts
type RendererMode = 'editor' | 'preview' | 'export';
```

Renderer:

1. перебирает `page.blocks`;
2. находит definition;
3. получает renderer;
4. передает данные (с автоматической резолюцией ссылок через `resolveLinkHref(linkConfig, pages)`);
5. применяет resolved styles (Desktop-First);
6. в editor mode добавляет selection/hover оболочку.

---

## 9. Editor Store

Рекомендуемая структура Zustand:

```ts
interface EditorState {
  project: SiteProject | null;

  selectedPageId: string | null;
  selectedBlockId: string | null;

  currentLocale: string;
  currentBreakpoint: Breakpoint;

  isDirty: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';

  selectPage(id: string): void;
  selectBlock(id: string | null): void;

  addBlock(block: PageBlock, index?: number): void;
  removeBlock(id: string): void;
  duplicateBlock(id: string): void;
  moveBlock(fromIndex: number, toIndex: number): void;

  updateBlockContent(id: string, path: string, value: unknown): void;
  updateBlockStyle(id: string, path: string, value: unknown): void;

  setLocale(locale: string): void;
  setBreakpoint(bp: Breakpoint): void;

  // Backup & Import
  exportProjectBackup(): Promise<string>;
  importProjectBackup(jsonString: string): Promise<void>;

  undo(): void;
  redo(): void;
}
```

---

## 10. История изменений

Не сохранять каждое движение slider как отдельный полноценный snapshot.

Рекомендуется:

- debounce/transaction;
- группировать последовательные изменения одного поля;
- лимит 50 состояний.

Минимальный MVP допускает snapshot history:

```ts
past[]
present
future[]
```

Оптимизация может быть позже.

---

## 11. Editor Layout

Структура:

```text
EditorShell
├─ Topbar
│  ├─ Breakpoints (Desktop / Tablet / Mobile)
│  ├─ Undo / Redo
│  ├─ Project Backup (Export / Import JSON)
│  └─ Save Status
├─ LeftSidebar
│  ├─ BlocksTab
│  ├─ PagesTab
│  └─ LayersTab (later)
├─ Canvas
│  └─ PageRenderer
└─ Inspector
   ├─ ContentTab (Text, Images, LinkControl, FormActionControl)
   ├─ LayoutTab
   ├─ StyleTab
   └─ ResponsiveTab
```

---

## 12. Selection

В editor mode каждый блок оборачивается в:

```tsx
<EditorBlockFrame />
```

Он отвечает за:

- hover outline;
- selected outline;
- drag handle;
- duplicate;
- delete;
- hide;
- block label.

Renderer самого блока не должен знать про toolbar редактора.

---

## 13. Drag-and-drop

MVP:

- reorder блоков внутри одной страницы;
- добавление блока из библиотеки;
- drag overlay.

Не делать сначала:

- свободный drag элементов внутри блока;
- вложенные sortable-контейнеры;
- absolute positioning.

---

## 14. Inspector controls

Создать переиспользуемые контролы:

```text
SliderControl
NumberControl
SelectControl
SegmentedControl
ColorControl
ToggleControl
SpacingControl
ResponsiveControl
ImageControl
TextControl
TextareaControl
LinkControl
FormActionControl
```

### SliderControl

Props:

```ts
interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange(value: number): void;
  onReset?(): void;
}
```

Slider и numeric input всегда синхронизированы.

### LinkControl

Props:

```ts
interface LinkControlProps {
  label: string;
  value: LinkConfig;
  pages: { id: string; title: string; slug: string }[];
  onChange(value: LinkConfig): void;
}
```

Поддерживает переключение между:
- Внутренней страницей проекта (с динамическим списком страниц);
- Внешним URL (с переключателем `target="_blank"`);
- Телефоном (`tel:+1234567890`);
- Почтой (`mailto:info@example.com`).

### FormActionControl

Props:

```ts
interface FormActionControlProps {
  value: FormActionConfig;
  onChange(value: FormActionConfig): void;
}
```

Управляет:
- `actionUrl`: строка URL эндпоинта отправки формы (совместимо с Formspree, Netlify Forms, Getform);
- `method`: метод HTTP POST;
- `redirectUrl`: опциональная страница перенаправления после отправки.

---

## 15. SpacingControl

Поддерживает:

- linked;
- unlinked;
- top/right/bottom/left;
- breakpoint-specific values.

При linked:

```text
48 -> {top:48,right:48,bottom:48,left:48}
```

---

## 16. Global Styles

```ts
interface GlobalStyles {
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
```

Проект формирует CSS variables:

```css
:root {
  --color-primary: ...;
  --color-secondary: ...;
  --font-heading: ...;
  --font-body: ...;
  --container-width: ...;
}
```

---

## 17. Localized content

Контент, который переводится:

```ts
title: {
  ru: 'Наши услуги',
  en: 'Our services',
  uz: 'Bizning xizmatlar'
}
```

Renderer получает `locale` и выбирает нужное значение.

Не дублировать весь Page JSON под каждый язык.

---

## 18. Page model

```ts
interface PageSEO {
  title?: LocalizedText;
  description?: LocalizedText;
  canonical?: string;
  ogTitle?: LocalizedText;
  ogDescription?: LocalizedText;
  ogImage?: string;
  noIndex?: boolean;
}
```

---

## 19. Posts

```ts
interface Post {
  id: string;
  slug: string;

  title: LocalizedText;
  excerpt: LocalizedText;

  cover?: string;

  categoryIds: string[];

  blocks: ArticleBlock[];

  status: 'draft' | 'published';
  publishedAt?: string;

  seo: PageSEO;
}
```

---

## 20. Persistence abstraction (IndexedDB)

Для работы с хранилищем создается абстракция:

```ts
interface ProjectRepository {
  load(projectId: string): Promise<SiteProject | null>;
  save(project: SiteProject): Promise<void>;
  listProjects?(): Promise<Array<{ id: string; name: string; updatedAt: string }>>;
  deleteProject?(projectId: string): Promise<void>;
}
```

Реализация MVP:

```text
IndexedDbProjectRepository (на базе `idb-keyval`)
```

Преимущества:
- Асинхронное API (Promise);
- Нет лимита 5 МБ LocalStorage (поддерживаются сотни мегабайт медиа и base64 assets);
- Готовность к плавной замене на `ApiProjectRepository`.

Позже:

```text
ApiProjectRepository
```

Это позволит перейти на backend без переписывания editor store.

### Project Backup Service

```ts
interface BackupService {
  exportProjectToJson(project: SiteProject): string;
  downloadBackupFile(project: SiteProject): void;
  importProjectFromJson(jsonString: string): Promise<SiteProject>;
}
```

---

## 21. Autosave

Схема:

```text
state changed
  ↓
isDirty = true
  ↓
debounce 700ms
  ↓
repository.save() (IndexedDB)
  ↓
Saved
```

Не делать API-запрос на каждый pixel slider.

---

## 22. Export architecture

Экспорт строится как отдельный слой:

```text
SiteProject
   ↓
ExportService
   ├─ render pages
   ├─ collect styles
   ├─ collect assets
   ├─ generate sitemap
   ├─ generate robots
   └─ create ZIP
```

Интерфейс:

```ts
interface ExportService {
  export(project: SiteProject): Promise<Blob>;
}
```

Для MVP допустим client-side ZIP через JSZip.

---

## 23. Export output

```text
dist/
├─ index.html
├─ about/index.html
├─ services/index.html
├─ assets/
│  ├─ styles.css
│  ├─ app.js
│  └─ images/
├─ sitemap.xml
├─ robots.txt
└─ favicon.ico
```

---

## 24. SEO export

При экспорте каждая страница должна получить:

- `<title>`;
- meta description;
- canonical;
- OpenGraph;
- lang;
- alternate hreflang при мультиязычности;
- robots directives.

---

## 25. Templates

Template — это готовый `SiteProject` или набор `Page` JSON.

Не делать отдельный renderer для шаблонов.

Шаблон должен использовать те же блоки.

---

## 26. AI extension point

AI слой не должен напрямую модифицировать JSX.

Он получает schema доступных блоков и возвращает валидируемый JSON.

```text
Prompt
 ↓
AI
 ↓
Zod validation
 ↓
Page JSON
 ↓
PageRenderer
```

Любой AI JSON обязательно валидировать.

---

## 27. Suggested folder structure

```text
src/
├─ app/
│  ├─ page.tsx
│  ├─ editor/[projectId]/page.tsx
│  ├─ preview/[projectId]/[pageId]/page.tsx
│  └─ dashboard/
│
├─ components/
│  ├─ editor/
│  │  ├─ EditorShell.tsx
│  │  ├─ EditorTopbar.tsx
│  │  ├─ BlockLibrary.tsx
│  │  ├─ EditorCanvas.tsx
│  │  ├─ Inspector.tsx
│  │  └─ EditorBlockFrame.tsx
│  │
│  ├─ controls/
│  │  ├─ SliderControl.tsx
│  │  ├─ SpacingControl.tsx
│  │  ├─ ColorControl.tsx
│  │  └─ ...
│  │
│  └─ ui/
│
├─ builder/
│  ├─ registry/
│  │  ├─ blockRegistry.ts
│  │  └─ definitions/
│  ├─ renderer/
│  │  ├─ PageRenderer.tsx
│  │  └─ styleResolver.ts
│  ├─ blocks/
│  │  ├─ hero/
│  │  ├─ services/
│  │  └─ ...
│  └─ export/
│
├─ store/
│  ├─ editorStore.ts
│  └─ history.ts
│
├─ repositories/
│  ├─ ProjectRepository.ts
│  └─ IndexedDbProjectRepository.ts
│
├─ services/
│  ├─ backupService.ts
│  └─ exportService.ts
│  ├─ project.schema.ts
│  └─ block.schema.ts
│
├─ types/
│  ├─ project.ts
│  ├─ block.ts
│  └─ editor.ts
│
└─ lib/
```

---

## 28. Definition of Done для каждого учебного спринта

После каждого пакета из 5–10 задач обязательно:

1. `npm run dev` запускается без runtime errors.
2. `npm run build` проходит, если текущий этап уже поддерживает production build.
3. Нет TypeScript ошибок.
4. Существующий функционал продолжает работать.
5. Ученик вручную выполняет указанный smoke-test.
6. Только после этого следующий sprint.

Если агент не закончил весь sprint из-за лимита токенов:

- он должен остановиться;
- перечислить завершённые задачи;
- перечислить незавершённые;
- не начинать следующий sprint.

---

## 29. Правило для AI-агента

В начале каждого нового запуска:

1. Прочитать `PRD.md`.
2. Прочитать `SPEC.md`.
3. Прочитать `TASKS.md`.
4. Найти первый незавершённый checkbox текущего sprint.
5. Выполнять только текущий sprint.
6. Не реализовывать функции следующих sprint заранее.
7. После выполнения обновить checkbox.
8. Выполнить проверки sprint.
9. Остановиться.

Это специально снижает расход токенов и предотвращает хаотичную генерацию проекта.
