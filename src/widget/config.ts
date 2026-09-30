import { LOCALE_DEFAULTS, pickText, resolveLocale } from './i18n'
import type { ResolvedConfig, WidgetConfig } from './types'

export function mergeConfig(config: WidgetConfig = {}): ResolvedConfig {
  const locale = resolveLocale(config.locale)
  const defaults = LOCALE_DEFAULTS[locale]

  return {
    apiUrl: config.apiUrl ?? '',
    webhookKey: config.webhookKey ?? '',
    propertyId: config.propertyId ?? '',
    pageId: config.pageId ?? 'widget',
    title: pickText(config.title, locale, defaults.title),
    subtitle: pickText(config.subtitle, locale, defaults.subtitle),
    primaryColor: config.primaryColor ?? '#1e443a',
    position: config.position ?? 'bottom-right',
    greeting: pickText(config.greeting, locale, defaults.greeting),
    placeholder: pickText(config.placeholder, locale, defaults.placeholder),
    locale,
    ui: defaults.ui,
  }
}

export function createMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}
