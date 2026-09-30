export type WidgetPosition = 'bottom-right' | 'bottom-left'

export type Locale = 'es' | 'en'

/** Texto fijo, o un texto por idioma (se elige según `locale`). */
export type LocalizedText = string | Partial<Record<Locale, string>>

export interface WidgetConfig {
  apiUrl?: string
  webhookKey?: string
  propertyId?: string
  pageId?: string
  title?: LocalizedText
  subtitle?: LocalizedText
  primaryColor?: string
  position?: WidgetPosition
  greeting?: LocalizedText
  placeholder?: LocalizedText
  /** 'auto' (por defecto) toma el idioma del atributo `lang` de la página host. */
  locale?: Locale | 'auto'
}

/** Textos de interfaz que no se configuran desde `init()`. */
export interface UiStrings {
  error: string
  closeChat: string
  openChat: string
  messageLabel: string
  sendLabel: string
  userMessage: string
  assistantMessage: string
  typing: string
}

export interface ResolvedConfig {
  apiUrl: string
  webhookKey: string
  propertyId: string
  pageId: string
  title: string
  subtitle: string
  primaryColor: string
  position: WidgetPosition
  greeting: string
  placeholder: string
  locale: Locale
  ui: UiStrings
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  status?: 'sending' | 'sent' | 'error'
}

export interface GarooChatInstance {
  open: () => void
  close: () => void
  toggle: () => void
  destroy: () => void
  sendMessage: (text: string) => void
}

declare global {
  interface Window {
    GarooChat?: {
      init: (config?: WidgetConfig) => GarooChatInstance
    }
  }
}
