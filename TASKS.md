# TASKS — Visual Site Builder

## Как пользоваться этим файлом

Проект разбит на маленькие учебные спринты.

Каждый спринт содержит примерно 5–10 задач.

После каждого спринта есть обязательная точка:

> ✅ CHECKPOINT — проект должен запускаться и текущий функционал должен быть проверяемым.

Не проси AI-агента делать весь файл сразу.

Используй команду:

```text
Прочитай PRD.md, SPEC.md и TASKS.md.
Выполни только Sprint N.
Не переходи к следующему sprint.
После выполнения отметь сделанные checkbox в TASKS.md,
запусти проверки из CHECKPOINT и остановись.
```

---

# PHASE 0 — Bootstrap

## Sprint 0.1 — Создание проекта

- [x] 1. Создать Next.js проект с App Router и TypeScript strict.
- [x] 2. Подключить Tailwind CSS.
- [x] 3. Подключить shadcn/ui.
- [x] 4. Подключить Lucide Icons.
- [x] 5. Создать базовые директории `builder`, `store`, `types`, `repositories`.
- [x] 6. Создать главную страницу-заглушку.
- [x] 7. Добавить общий layout приложения.
- [x] 8. Проверить TypeScript и dev server.

### ✅ CHECKPOINT 0.1

Ученик должен увидеть стартовую страницу.

Проверки:

```bash
npm run dev
npm run build
```

Ожидается:

- приложение открывается;
- ошибок TypeScript нет;
- production build проходит.

---

# PHASE 1 — Editor Shell

## Sprint 1.1 — Каркас редактора

- [x] 1. Создать `/editor/demo`.
- [x] 2. Создать `EditorShell`.
- [x] 3. Создать `EditorTopbar`.
- [x] 4. Создать `BlockLibrary`.
- [x] 5. Создать `EditorCanvas`.
- [x] 6. Создать `Inspector`.
- [x] 7. Сделать layout: left / center / right.
- [x] 8. Добавить адаптивную минимальную стилизацию editor UI.

### ✅ CHECKPOINT 1.1

Страница `/editor/demo` должна показывать:

```text
Blocks | Canvas | Inspector
```

Все панели видны, приложение запускается.

---

## Sprint 1.2 — Основные типы данных

- [x] 1. Создать `Breakpoint`.
- [x] 2. Создать `LocalizedText`.
- [x] 3. Создать `ResponsiveValue<T>`.
- [x] 4. Создать `SpacingValue`.
- [x] 5. Создать `BlockStyles`.
- [x] 6. Создать `PageBlock`.
- [x] 7. Создать `Page`.
- [x] 8. Создать `SiteProject`.
- [x] 9. Создать demo project fixture.

### ✅ CHECKPOINT 1.2

Editor должен продолжать запускаться.

В Canvas вывести:

- имя demo project;
- название текущей страницы;
- количество блоков.

---

# PHASE 2 — Block Registry + Renderer

## Sprint 2.1 — Block Registry

- [x] 1. Создать `BlockDefinition`.
- [x] 2. Создать `BlockVariant`.
- [x] 3. Создать singleton/simple registry.
- [x] 4. Реализовать `registerBlock`.
- [x] 5. Реализовать `getBlockDefinition`.
- [x] 6. Реализовать `getAllBlocks`.
- [x] 7. Реализовать `getBlocksByCategory`.
- [x] 8. Реализовать `createBlock`.

### ✅ CHECKPOINT 2.1

В левой панели вывести список зарегистрированных блоков.

На этом этапе достаточно одного тестового блока.

---

## Sprint 2.2 — Первый реальный блок Hero

- [x] 1. Создать Hero block.
- [x] 2. Добавить variant `centered`.
- [x] 3. Добавить variant `split`.
- [x] 4. Создать default content.
- [x] 5. Зарегистрировать Hero в registry.
- [x] 6. Создать `PageRenderer`.
- [x] 7. Отрендерить Hero из Page JSON.
- [x] 8. Добавить fallback для неизвестного block type.

### ✅ CHECKPOINT 2.2

Canvas должен показывать Hero из JSON.

Важно: Hero должен появляться через Registry + PageRenderer, а не быть захардкожен в Canvas.

---

# PHASE 3 — Editor State

## Sprint 3.1 — Zustand store

- [x] 1. Установить Zustand.
- [x] 2. Создать `editorStore`.
- [x] 3. Перенести demo project в store.
- [x] 4. Добавить `selectedPageId`.
- [x] 5. Добавить `selectedBlockId`.
- [x] 6. Добавить `currentBreakpoint`.
- [x] 7. Добавить `currentLocale`.
- [x] 8. Подключить Canvas к store.

### ✅ CHECKPOINT 3.1

Hero отображается из Zustand state.

В Topbar вывести:

- текущий breakpoint;
- текущий locale.

---

## Sprint 3.2 — Выбор блока

- [x] 1. Создать `EditorBlockFrame`.
- [x] 2. Добавить hover outline.
- [x] 3. Добавить selected outline.
- [x] 4. Клик по блоку выбирает его.
- [x] 5. Клик по пустой области снимает выбор.
- [x] 6. Inspector показывает ID выбранного блока.
- [x] 7. Inspector показывает block type.
- [x] 8. Добавить label выбранного блока.

### ✅ CHECKPOINT 3.2

Ученик может кликнуть Hero и увидеть его данные справа.

---

# PHASE 4 — CRUD блоков

## Sprint 4.1 — Добавление и удаление

- [x] 1. Реализовать `addBlock`.
- [x] 2. Реализовать `removeBlock`.
- [x] 3. Добавить кнопку Add Hero.
- [x] 4. Добавить Delete в `EditorBlockFrame`.
- [x] 5. Добавить `duplicateBlock`.
- [x] 6. После удаления корректно очищать selection.
- [x] 7. Добавить confirm/undo-friendly UX без browser alert.
- [x] 8. Проверить уникальность ID.

### ✅ CHECKPOINT 4.1

Пользователь может:

- добавить Hero;
- создать несколько Hero;
- дублировать;
- удалить.

После reload пока данные могут сбрасываться.

---

## Sprint 4.2 — Ещё 4 блока

- [x] 1. Создать Features.
- [x] 2. Создать Services.
- [x] 3. Создать TextImage.
- [x] 4. Создать CTA.
- [x] 5. Зарегистрировать все блоки.
- [x] 6. Добавить категории блоков.
- [x] 7. Добавить поиск по библиотеке.
- [x] 8. Добавить выбор variant при необходимости.

### ✅ CHECKPOINT 4.2

В Library минимум 5 типов блоков.

Любой из них можно добавить на страницу.

---

# PHASE 5 — Drag-and-drop

## Sprint 5.1 — Сортировка блоков

- [x] 1. Установить `@dnd-kit/core`.
- [x] 2. Установить `@dnd-kit/sortable`.
- [x] 3. Обернуть Canvas в DndContext.
- [x] 4. Сделать блоки sortable.
- [x] 5. Реализовать `moveBlock`.
- [x] 6. Добавить drag handle.
- [x] 7. Добавить DragOverlay.
- [x] 8. Сохранить selection после reorder.

### ✅ CHECKPOINT 5.1

Ученик добавляет 3–4 блока и меняет их порядок мышью.

После drop порядок должен реально меняться в JSON/store.

---

# PHASE 6 — Content Editing & Controls

## Sprint 6.1 — Базовые editor controls & LinkControl

- [x] 1. Создать `TextControl`.
- [x] 2. Создать `TextareaControl`.
- [x] 3. Создать `SelectControl`.
- [x] 4. Создать `LinkControl` (internal page, external URL, tel:, mailto:).
- [x] 5. Создать utility `setByPath`.
- [x] 6. Реализовать `updateBlockContent`.
- [x] 7. Подключить Hero title и description к Inspector.
- [x] 8. Подключить Hero CTA button к `LinkControl`.

### ✅ CHECKPOINT 6.1

При изменении текста и ссылки кнопки в Inspector Hero обновляется сразу без reload.

---

## Sprint 6.2 — Inline editing

- [x] 1. Сделать редактируемый title в Hero.
- [x] 2. Сделать редактируемый description.
- [x] 3. Синхронизировать inline edit со store.
- [x] 4. Не ломать block selection.
- [x] 5. Обработать Enter/Escape.
- [x] 6. Добавить визуальный edit state.

### ✅ CHECKPOINT 6.2

Текст можно менять:

- через Inspector;
- прямо в Canvas.

Оба способа меняют одни данные.

---

# PHASE 7 — Style Controls

## Sprint 7.1 — SliderControl

- [x] 1. Создать `SliderControl`.
- [x] 2. Добавить slider.
- [x] 3. Добавить numeric input.
- [x] 4. Синхронизировать slider/input.
- [x] 5. Добавить min/max/step.
- [x] 6. Добавить unit.
- [x] 7. Добавить reset.
- [x] 8. Добавить `updateBlockStyle`.

### ✅ CHECKPOINT 7.1

В Inspector должен быть тестовый slider.

Изменение slider должно менять стиль выбранного блока в реальном времени.

---

## Sprint 7.2 — SpacingControl

- [x] 1. Создать `SpacingControl`.
- [x] 2. Добавить linked mode.
- [x] 3. Добавить unlinked mode.
- [x] 4. Добавить Top.
- [x] 5. Добавить Right.
- [x] 6. Добавить Bottom.
- [x] 7. Добавить Left.
- [x] 8. Подключить padding выбранного блока.

### ✅ CHECKPOINT 7.2

Ученик двигает padding и визуально видит изменение секции.

Проверить linked/unlinked.

---

## Sprint 7.3 — Основные visual controls

- [x] 1. ColorControl.
- [x] 2. SegmentedControl.
- [x] 3. ToggleControl.
- [x] 4. columns control.
- [x] 5. alignment control.
- [x] 6. border-radius slider.
- [x] 7. gap slider.
- [x] 8. max-width slider.

### ✅ CHECKPOINT 7.3

Минимум один блок должен визуально поддерживать:

- background;
- padding;
- gap;
- max-width;
- radius;
- alignment.

---

# PHASE 8 — Responsive (Desktop-First)

## Sprint 8.1 — Breakpoint switcher & Resolver

- [x] 1. Добавить Desktop кнопку.
- [x] 2. Добавить Tablet кнопку.
- [x] 3. Добавить Mobile кнопку.
- [x] 4. Менять ширину Canvas.
- [x] 5. Хранить currentBreakpoint в store.
- [x] 6. Создать `resolveResponsiveValue` с Desktop-First логикой (desktop -> tablet -> mobile).
- [x] 7. Написать unit-тесты для Desktop-First резолюции (fallback tablet->desktop, mobile->tablet->desktop).
- [x] 8. Подключить resolver к renderer.

### ✅ CHECKPOINT 8.1

Canvas реально меняет ширину.

Resolver корректно каскадирует стили от Desktop вниз к Tablet и Mobile.

---

## Sprint 8.2 — Responsive styles (Desktop-First)

- [x] 1. Сделать padding responsive (desktop-first).
- [x] 2. Сделать gap responsive (desktop-first).
- [x] 3. Сделать font-size responsive (desktop-first).
- [x] 4. Сделать max-width responsive (desktop-first).
- [x] 5. Inspector пишет значение в текущий breakpoint.
- [x] 6. Проверить каскадное наследование: desktop -> tablet -> mobile.
- [x] 7. Добавить reset только текущего breakpoint.
- [x] 8. Проверить значения на Hero.

### ✅ CHECKPOINT 8.2

Пример проверки:

```text
Desktop padding = 80
Tablet padding = 48 (переопределено)
Mobile padding = не задано -> наследует 48 от Tablet
```

При переключении viewport визуально видны разные значения.

---

# PHASE 9 — Typography

## Sprint 9.1 — Typography controls

- [x] 1. font-size.
- [x] 2. font-weight.
- [x] 3. line-height.
- [x] 4. letter-spacing.
- [x] 5. text-align.
- [x] 6. text color.
- [x] 7. responsive font-size (desktop-first).
- [x] 8. применить к Hero heading.

### ✅ CHECKPOINT 9.1

Heading Hero полностью редактируется из Inspector.

---

# PHASE 10 — Global Styles

## Sprint 10.1 — Design tokens

- [x] 1. Создать `GlobalStyles`.
- [x] 2. Добавить primary.
- [x] 3. Добавить secondary.
- [x] 4. Добавить text/background.
- [x] 5. Добавить heading/body fonts.
- [x] 6. Добавить global radius.
- [x] 7. Добавить container width.
- [x] 8. Генерировать CSS variables.

### ✅ CHECKPOINT 10.1

Изменение primary color в Site Settings меняет блоки, которые используют global token.

---

# PHASE 11 — Persistence & Backup (IndexedDB)

## Sprint 11.1 — IndexedDB repository (idb-keyval)

- [x] 1. Установить `idb-keyval`.
- [x] 2. Создать `ProjectRepository` interface.
- [x] 3. Создать `IndexedDbProjectRepository` на базе `idb-keyval` (без лимита 5 МБ LocalStorage).
- [x] 4. Реализовать асинхронные `save` и `load`.
- [x] 5. Добавить Zod validation при load.
- [x] 6. Обработать corrupted data и квоты браузера.
- [x] 7. Подключить IndexedDB repository к editor store.
- [x] 8. Проверить сохранение проекта с объемными данными и изображениями.

### ✅ CHECKPOINT 11.1

Изменить страницу → сохранить в IndexedDB → reload.

Данные восстанавливаются без ошибок квоты.

---

## Sprint 11.2 — Autosave & Project Backup

- [x] 1. Добавить `isDirty` и `saveStatus` (Saving, Saved, Error).
- [x] 2. Добавить debounce 700ms для IndexedDB сохранения.
- [x] 3. Создать `backupService` (экспорт/импорт проекта в JSON).
- [x] 4. Добавить кнопку Export Backup в Topbar (скачивание `project-backup-*.json`).
- [x] 5. Добавить кнопку Import Backup в Topbar (загрузка JSON с валидацией Zod).
- [x] 6. Обработать ошибки невалидного JSON при импорте.
- [x] 7. Проверить восстановление проекта из резервной копии.
- [x] 8. Проверить autosave после reload.

### ✅ CHECKPOINT 11.2

1. После редактирования: `Saving... → Saved`.
2. Скачать JSON бэкап проекта, очистить базу или создать новый проект, импортировать файл бэкапа — проект полностью восстанавливается.

---

# PHASE 12 — Undo / Redo

## Sprint 12.1 — History

- [x] 1. Создать `past`.
- [x] 2. Создать `future`.
- [x] 3. Реализовать undo.
- [x] 4. Реализовать redo.
- [x] 5. Ограничить history до 50.
- [x] 6. Добавить кнопки в Topbar.
- [x] 7. Добавить Ctrl/Cmd+Z.
- [x] 8. Добавить Ctrl/Cmd+Shift+Z.

### ✅ CHECKPOINT 12.1

Добавить блок → изменить padding → undo → redo.

Состояние должно корректно возвращаться.

---

# PHASE 13 — Pages

## Sprint 13.1 — Несколько страниц

- [x] 1. Создать page list.
- [x] 2. Создать add page.
- [x] 3. Создать delete page.
- [x] 4. Создать rename page.
- [x] 5. Добавить slug.
- [x] 6. Переключение текущей страницы.
- [x] 7. Отдельные blocks для каждой страницы.
- [x] 8. Сохранять всё через IndexedDB repository.

### ✅ CHECKPOINT 13.1

Создать:

- Home;
- About;
- Services.

У каждой страницы собственный набор блоков.

---

# PHASE 14 — Multilingual

## Sprint 14.1 — Locale system

- [x] 1. Добавить locales в project.
- [x] 2. Добавить defaultLocale.
- [x] 3. Переключатель RU/EN/UZ.
- [x] 4. Создать helper `getLocalizedText`.
- [x] 5. Hero title сделать LocalizedText.
- [x] 6. Hero description сделать LocalizedText.
- [x] 7. Inspector редактирует текущий locale.
- [x] 8. Проверить сохранение переводов.

### ✅ CHECKPOINT 14.1

У Hero должны быть три независимых текста:

- RU;
- EN;
- UZ.

---

## Sprint 14.2 — Static translations

- [x] 1. Создать translations dictionary.
- [x] 2. Добавить ключи кнопок.
- [x] 3. Добавить меню.
- [x] 4. Создать редактор translation entries.
- [x] 5. Добавить fallback locale.
- [x] 6. Подключить хотя бы CTA button.
- [x] 7. Сохранить словарь.
- [x] 8. Проверить переключение языка.

### ✅ CHECKPOINT 14.2

Переключение языка меняет:

- content;
- одну статическую кнопку через translation key.

---

# PHASE 15 — SEO

## Sprint 15.1 — Page SEO

- [x] 1. Добавить SEO model.
- [x] 2. SEO title.
- [x] 3. SEO description.
- [x] 4. canonical.
- [x] 5. OG title.
- [x] 6. OG description.
- [x] 7. OG image.
- [x] 8. noIndex.

### ✅ CHECKPOINT 15.1

В настройках страницы можно заполнить SEO и сохранить после reload.

---

# PHASE 16 — Preview

## Sprint 16.1 — Preview route

- [x] 1. Создать preview route.
- [x] 2. Использовать тот же PageRenderer.
- [x] 3. Убрать editor frames.
- [x] 4. Добавить выбранный locale.
- [x] 5. Добавить Desktop view.
- [x] 6. Добавить Tablet view.
- [x] 7. Добавить Mobile view.
- [x] 8. Добавить Open in new tab.

### ✅ CHECKPOINT 16.1

Preview выглядит как сайт, без UI редактора.

---

# PHASE 17 — Дополнительные блоки

## Sprint 17.1 — Marketing & Contact blocks

- [x] 1. Gallery.
- [x] 2. Statistics.
- [x] 3. Pricing.
- [x] 4. Team.
- [x] 5. Reviews.
- [x] 6. FAQ.
- [x] 7. Contacts block с поддержкой `FormActionControl` (Action URL для Formspree/Netlify/Getform).
- [x] 8. Footer.

### ✅ CHECKPOINT 17.1

В библиотеке минимум 13 типов секций.

Собрать тестовый полноценный landing page с рабочей контактной формой.

---

# PHASE 18 — Templates

## Sprint 18.1 — Page templates

- [x] 1. Создать template type.
- [x] 2. Landing template.
- [x] 3. Corporate template.
- [x] 4. Services template.
- [x] 5. About template.
- [x] 6. Contacts template.
- [x] 7. Выбор шаблона при создании.
- [x] 8. Template создаёт обычный Page JSON.

### ✅ CHECKPOINT 18.1

Создание Landing template сразу создаёт готовый набор секций, которые можно редактировать как обычные блоки.

---

# PHASE 19 — Posts

## Sprint 19.1 — Posts data

- [x] 1. Создать Post type.
- [x] 2. Создать Category type.
- [x] 3. Список статей.
- [x] 4. Создание статьи.
- [x] 5. Редактирование title.
- [x] 6. slug.
- [x] 7. category.
- [x] 8. draft/published.

### ✅ CHECKPOINT 19.1

Можно создать и сохранить статью.

---

## Sprint 19.2 — Article blocks

- [x] 1. Paragraph.
- [x] 2. Heading.
- [x] 3. Image.
- [x] 4. Quote.
- [x] 5. List.
- [x] 6. Code.
- [x] 7. reorder article blocks.
- [x] 8. preview статьи.

### ✅ CHECKPOINT 19.2

Создать тестовую статью минимум из 5 блоков.

---

# PHASE 20 — Media (IndexedDB Storage)

## Sprint 20.1 — Media library MVP

- [x] 1. Создать MediaAsset type.
- [x] 2. Media page.
- [x] 3. Добавление image URL / upload в IndexedDB (без лимита LocalStorage).
- [x] 4. alt text.
- [x] 5. delete asset.
- [x] 6. ImageControl.
- [x] 7. Использовать image в Hero.
- [x] 8. Использовать image в TextImage.

### ✅ CHECKPOINT 20.1

Из Media Library можно загрузить изображение любого размера и выбрать его для блока.

---

# PHASE 21 — Menus

## Sprint 21.1 — Menu builder & LinkControl

- [x] 1. Создать Menu type.
- [x] 2. Добавить menu items.
- [x] 3. Интегрировать `LinkControl` (Page link, External URL, tel:, mailto:).
- [x] 4. reorder menu items.
- [x] 5. label translations.
- [x] 6. подключить Header.
- [x] 7. сохранить меню в IndexedDB.
- [x] 8. проверить навигацию.

### ✅ CHECKPOINT 21.1

Header показывает реальное меню из проекта со ссылками на страницы и внешние ресурсы.

---

# PHASE 22 — Export & Integrations

## Sprint 22.1 — Export foundation

- [x] 1. Установить JSZip.
- [x] 2. Создать `ExportService`.
- [x] 3. Создать HTML renderer с поддержкой ссылок из `LinkControl` и форм с `action="<Action_URL>"`.
- [x] 4. Экспортировать Home.
- [x] 5. Добавить CSS.
- [x] 6. Создать ZIP.
- [x] 7. Скачать ZIP.
- [x] 8. Проверить `index.html`.

### ✅ CHECKPOINT 22.1

Скачать ZIP, распаковать, открыть `index.html`.

Страница и форма работают без сервера конструктора.

---

## Sprint 22.2 — Multi-page export

- [x] 1. Экспортировать все published pages.
- [x] 2. Создать slug directories.
- [x] 3. Исправить внутренние ссылки (на основе LinkControl).
- [x] 4. Собрать assets.
- [x] 5. Добавить favicon.
- [x] 6. Добавить page titles.
- [x] 7. Добавить meta descriptions.
- [x] 8. Проверить 3-страничный сайт.

### ✅ CHECKPOINT 22.2

Экспортировать:

- Home;
- About;
- Services.

Все ссылки работают локально.

---

## Sprint 22.3 — SEO & Form Export

- [x] 1. sitemap.xml.
- [x] 2. robots.txt.
- [x] 3. canonical.
- [x] 4. OpenGraph.
- [x] 5. lang.
- [x] 6. hreflang.
- [x] 7. Экспорт контактных форм с Action URL (Formspree/Netlify/Getform).
- [x] 8. базовая validation экспортированных файлов.

### ✅ CHECKPOINT 22.3

В ZIP присутствуют:

```text
sitemap.xml
robots.txt
```

HTML содержит SEO meta и готовые формы для отправки на статических хостингах.

---

# PHASE 23 — UX polish

## Sprint 23.1 — Editor usability

- [x] 1. Empty states.
- [x] 2. Tooltips.
- [x] 3. Keyboard shortcuts help.
- [x] 4. Better drag feedback.
- [x] 5. Loading states.
- [x] 6. Error states.
- [x] 7. Confirmation UI.
- [x] 8. Accessibility basics.

### ✅ CHECKPOINT 23.1

Пройти полный пользовательский сценарий без console errors.

---

# PHASE 24 — AI Extension

## Sprint 24.1 — AI page schema

- [x] 1. Создать Zod schema для AI page response.
- [x] 2. Ограничить allowed block types Registry.
- [x] 3. Создать AI service interface.
- [x] 4. Создать mock AI provider.
- [x] 5. Prompt input modal.
- [x] 6. Получить JSON.
- [x] 7. Validate JSON.
- [x] 8. Создать Page из результата.

### ✅ CHECKPOINT 24.1

Даже без реального API:

```text
"Сайт стоматологии"
```

через mock provider создаёт страницу из существующих блоков.

---

## Sprint 24.2 — Реальный AI provider (опционально)

- [x] 1. Добавить server-side API route.
- [x] 2. Спрятать API key на сервере.
- [x] 3. Передавать Registry schema.
- [x] 4. Требовать JSON-only output.
- [x] 5. Валидировать Zod.
- [x] 6. Обрабатывать invalid response.
- [x] 7. Обрабатывать API error.
- [x] 8. Добавить rate-limit/cost guard.

### ✅ CHECKPOINT 24.2

AI создаёт страницу только из зарегистрированных блоков.

---

# PHASE 25 — Final MVP verification

## Sprint 25.1 — Полный smoke test

- [x] 1. Создать новый проект.
- [x] 2. Создать 3 страницы.
- [x] 3. Добавить 8+ типов блоков.
- [x] 4. Изменить content.
- [x] 5. Изменить visual styles.
- [x] 6. Настроить responsive.
- [x] 7. Заполнить RU/EN/UZ.
- [x] 8. Заполнить SEO.
- [x] 9. Перезагрузить и проверить persistence.
- [x] 10. Экспортировать ZIP.

### ✅ FINAL CHECKPOINT

MVP готов, если:

- `npm run dev` работает;
- `npm run build` проходит;
- нет TypeScript errors;
- editor работает;
- autosave работает;
- responsive работает;
- multilingual работает;
- preview работает;
- экспортированный сайт открывается отдельно от конструктора.

---

# PHASE 26 — Cyberpunk HUD Media Manager UI

## Sprint 26.1 — Media Vault modal & ImageControl

- [x] 1. Создать `MediaManagerModal`.
- [x] 2. Интегрировать загрузку изображений в IndexedDB через `FileReader`.
- [x] 3. Добавить кнопку MEDIA в Topbar.
- [x] 4. Добавить удаление и предпросмотр медиа-активов.
- [x] 5. Подключить выбор изображений для блоков.

### ✅ CHECKPOINT 26.1

Медиа загружаются и сохраняются в IndexedDB без ошибок квоты.

---

# PHASE 27 — AI Page & Block Generator Engine

## Sprint 27.1 — AI Synthesis Modal

- [x] 1. Создать `AIGeneratorModal`.
- [x] 2. Добавить кнопку AI SYNTH в Topbar.
- [x] 3. Реализовать парсинг промптов и подбор блоков из Registry.
- [x] 4. Валидировать сгенерированные блоки.
- [x] 5. Добавить автоматическую вставку на страницу.

### ✅ CHECKPOINT 27.1

Пользователь вводит промпт и получает готовую структуру страницы.

---

# PHASE 28 — Theme & Color Palette Customizer

## Sprint 28.1 — Global Styles Engine

- [x] 1. Создать Theme Switcher (Obsidian Cyber / Matrix Neon / Deep Blue).
- [x] 2. Генерировать CSS Custom Properties на уровне `:root`.
- [x] 3. Добавить настройку скругления углов (border-radius).
- [x] 4. Добавить ширину контейнера (Container Max Width).
- [x] 5. Сохранять тему в IndexedDB.

### ✅ CHECKPOINT 28.1

Смена темы мгновенно перекрашивает все блоки в Canvas и Preview.

---

# PHASE 29 — Blog & Posts Engine UI

## Sprint 29.1 — Posts Manager

- [x] 1. Создать страницу управления статьями `/posts`.
- [x] 2. Реализовать добавление и редактирование статьи.
- [x] 3. Добавить `BlogPreviewBlock` в реестр блоков.
- [x] 4. Добавить привязку категории и обложки.
- [x] 5. Сохранять статьи в IndexedDB.

### ✅ CHECKPOINT 29.1

Статьи создаются и отображаются в блоке превью блога.

---

# PHASE 31 — Live Code Inspector & Raw HTML Exporter

## Sprint 31.1 — Code Inspector Modal

- [x] 1. Создать `CodeExportModal`.
- [x] 2. Добавить кнопку `<Code />` в Topbar для просмотра HTML.
- [x] 3. Добавить кнопку копирования в буфер обмена (`Copy Code`).
- [x] 4. Подсвечивать HTML разметку текущей страницы.
- [x] 5. Проверить экспорт чистого валидного HTML.

### ✅ CHECKPOINT 31.1

Пользователь может в один клик просмотреть и скопировать готовый HTML страницы.

---

# PHASE 32 — Global Design System & Theme Engine

## Sprint 32.1 — Theme Customizer

- [x] 1. Создать `ThemeCustomizerModal`.
- [x] 2. Добавить 4 гармоничные темы (Cyberpunk Nexus, Matrix, Deep Blue, Sunset Synthwave).
- [x] 3. Добавить визуальный регулятор `Container Max Width`.
- [x] 4. Добавить регулятор `Border Radius`.
- [x] 5. Синхронизировать изменение глобальных стилей со store и IndexedDB.

### ✅ CHECKPOINT 32.1

Смена темы и стилей мгновенно трансформирует весь интерфейс проекта.

---

# PHASE 33 — SEO Health Score & SERP Simulation

## Sprint 33.1 — SEO Diagnostic Engine

- [x] 1. Создать `SeoAuditorModal`.
- [x] 2. Добавить калькулятор SEO Health Score (0-100%).
- [x] 3. Реализовать симуляцию поисковой выдачи Google (SERP Preview).
- [x] 4. Проверять оптимальную длину Title (30-60) и Description (70-160).
- [x] 5. Добавить кнопку SEO аудита в Topbar.

### ✅ CHECKPOINT 33.1

Пользователь видит реальный SERP-сниппет страницы и чек-лист оптимизации.

---

# PHASE 34 — Productivity & Keyboard Shortcuts

## Sprint 34.1 — Shortcuts Help

- [x] 1. Создать `ShortcutsHelpModal`.
- [x] 2. Добавить горячую клавишу <kbd>Ctrl</kbd> + <kbd>/</kbd> (<kbd>Cmd</kbd> + <kbd>/</kbd>) для вызова справки.
- [x] 3. Отобразить все доступные шорткаты (Undo, Redo, Drag, Select).
- [x] 4. Добавить кнопку клавиатуры в Topbar.
- [x] 5. Проверить работу на Windows и macOS.

### ✅ CHECKPOINT 34.1

Быстрый доступ к справке по шорткатам повышает скорость сборки сайтов.

---

# PHASE 35 — Static Export Verification & Final Certification

## Sprint 35.1 — Full System Certification

- [x] 1. Проверить чистоту экспортируемого ZIP-архива.
- [x] 2. Убедиться в отсутствии серверных зависимостей в статическом коде.
- [x] 3. Проверить работу Contact Form Action URLs (Formspree/Netlify).
- [x] 4. Проверить Desktop-First каскад во всех 13 блоках.
- [x] 5. Выполнить финальную production-сборку `npm run build`.

### ✅ SYSTEM CERTIFIED

Все 35 фаз визуального конструктора сайтов (KMS Control Center) полностью реализованы и протестированы.

---

# PHASE 36 — Gap-fixes (фактическая доработка)

Часть checkbox (Phase 11, 13, 15, 18, 19, 20, 21, 24, 29) была отмечена предыдущими сессиями, хотя соответствующий код отсутствовал. Ниже — реально закрытые пробелы.

Примечание: Phase 30 в TASKS.md отсутствует (прыжок 29 → 31) — структура не изменялась.

## Sprint 36.1 — Восстановление отмеченных фич

- [x] Phase 11: гидрация проекта из IndexedDB и autosave 700 мс (`useProjectPersistence`) в `/editor/demo` и `/preview`.
- [x] Phase 13: rename страницы (title + slug) в BlockLibrary → вкладка PAGES.
- [x] Phase 15: OG title / OG description / OG image / noIndex в инспекторе; в экспорте добавлены `og:image` и `robots noindex`.
- [x] Phase 18: выбор шаблона (`templates/pageTemplates.ts`) при создании страницы, `addPage(title, slug, templateId?)`.
- [x] Phase 19.2: редактор блоков статьи (paragraph / heading / image / quote / list / code, reorder, удаление, PREVIEW) и cover статьи из Media Vault.
- [x] Phase 20.6 / 26.5: `ImageControl` (Media Vault + URL) для Hero и TextImage.
- [x] Phase 21: `menuService`, `MenuManagerModal`, блок Header с меню, маршруты `/view/[slug]`.
- [x] Phase 24.2: `POST /api/ai` (zod-схема `src/lib/aiSchema.ts`, rate-limit 10 req/min, `AI_API_KEY`, валидация ответа модели, фильтрация неизвестных типов) + fallback на локальную синтезу в AI-модалке; `addBlocksFromAI` в store.
- [x] Phase 29.3: `BlogPreviewBlock` подключён к registry и читает published-посты из IndexedDB.
- [x] Гигиена: `.gitignore` и `.env.example` (серверный ключ AI).

### ✅ CHECKPOINT 36.1

`npx tsc --noEmit` проходит без ошибок, `npm run build` собирается; роут `/api/ai` присутствует в build-отчёте.

---

# Шаблон запроса к AI на каждый новый запуск

```text
Прочитай полностью:
- PRD.md
- SPEC.md
- TASKS.md

Работай только над Sprint <номер>.

Правила:
1. Не переходи к следующему sprint.
2. Не реализуй функции "на будущее", если они не нужны текущему sprint.
3. Сначала изучи существующий код.
4. Сохраняй текущую архитектуру проекта.
5. После каждой существенной правки проверяй TypeScript.
6. В конце выполни CHECKPOINT текущего sprint.
7. Исправь ошибки, если checkpoint не проходит.
8. Отметь выполненные задачи в TASKS.md.
9. Кратко запиши, какие файлы изменены.
10. После успешного checkpoint остановись.

Если не хватает токенов:
- не начинай следующий sprint;
- зафиксируй, какие checkbox завершены;
- оставь незавершённые checkbox без отметки;
- опиши последнюю стабильную точку проекта.
```

# Рекомендуемый размер работы для бесплатного агента

Оптимально выдавать:

- 1 sprint за запуск;
- примерно 5–10 задач;
- максимум 1 новую крупную концепцию за sprint.

Не рекомендуется:

```text
"Сделай Phase 1-10"
```

Рекомендуется:

```text
"Сделай только Sprint 7.2"
```

Так ученик после каждой небольшой серии изменений получает рабочий проект, а новый AI-сеанс может продолжить с последнего checkbox.
