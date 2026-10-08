import { Breakpoint, ResponsiveValue, LocalizedText, SpacingValue } from "@/types/project";

/**
 * Desktop-First responsive value resolver:
 * desktop -> tablet -> mobile
 */
export function resolveResponsiveValue<T>(
  value: ResponsiveValue<T> | undefined,
  breakpoint: Breakpoint,
  defaultValue?: T
): T | undefined {
  if (!value) return defaultValue;

  if (breakpoint === "desktop") {
    return value.desktop ?? defaultValue;
  }

  if (breakpoint === "tablet") {
    return value.tablet ?? value.desktop ?? defaultValue;
  }

  if (breakpoint === "mobile") {
    return value.mobile ?? value.tablet ?? value.desktop ?? defaultValue;
  }

  return defaultValue;
}

/**
 * Helper to get localized string with fallback to first available locale or empty string
 */
export function getLocalizedText(
  text: LocalizedText | undefined,
  locale: string = "ru"
): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[locale] || text["ru"] || text["en"] || Object.values(text)[0] || "";
}

/**
 * Convert SpacingValue to inline CSS padding or margin style
 */
export function formatSpacingStyle(spacing?: SpacingValue) {
  if (!spacing) return {};
  return {
    paddingTop: `${spacing.top ?? 0}px`,
    paddingRight: `${spacing.right ?? 0}px`,
    paddingBottom: `${spacing.bottom ?? 0}px`,
    paddingLeft: `${spacing.left ?? 0}px`,
  };
}
