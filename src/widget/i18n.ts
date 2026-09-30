import type { Locale, LocalizedText, UiStrings } from './types'

interface LocaleDefaults {
  title: string
  subtitle: string
  greeting: string
  placeholder: string
  ui: UiStrings
}

export const LOCALE_DEFAULTS: Record<Locale, LocaleDefaults> = {
  es: {
    title: 'RedTec Assistant',
    subtitle: 'Suele responder en segundos',
    greeting: '¡Hola! 👋 ¿En qué puedo ayudarte hoy?',
    placeholder: 'Escribe tu mensaje...',
    ui: {
      error: 'Lo siento, hubo un error al procesar tu mensaje. Inténtalo de nuevo.',
      closeChat: 'Cerrar chat',
      openChat: 'Abrir chat',
      messageLabel: 'Mensaje',
      sendLabel: 'Enviar mensaje',
      userMessage: 'Tu mensaje',
      assistantMessage: 'Respuesta del asistente',
      typing: 'Escribiendo...',
    },
  },
  en: {
    title: 'RedTec Assistant',
    subtitle: 'Usually replies in seconds',
    greeting: 'Hi! 👋 How can I help you today?',
    placeholder: 'Type your message...',
    ui: {
      error: 'Sorry, something went wrong processing your message. Please try again.',
      closeChat: 'Close chat',
      openChat: 'Open chat',
      messageLabel: 'Message',
      sendLabel: 'Send message',
      userMessage: 'Your message',
      assistantMessage: 'Assistant reply',
      typing: 'Typing...',
    },
  },
}

/** 'auto' → idioma del `<html lang>` de la página host; cualquier cosa que no sea español cae en inglés. */
export function resolveLocale(locale: Locale | 'auto' | undefined): Locale {
  if (locale === 'es' || locale === 'en') return locale
  const lang = typeof document !== 'undefined' ? document.documentElement.lang : ''
  return lang.toLowerCase().startsWith('es') ? 'es' : 'en'
}

export function pickText(value: LocalizedText | undefined, locale: Locale, fallback: string): string {
  if (typeof value === 'string') return value
  if (value) return value[locale] ?? value.en ?? value.es ?? fallback
  return fallback
}
