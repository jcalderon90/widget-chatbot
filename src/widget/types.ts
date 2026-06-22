export type WidgetPosition = 'bottom-right' | 'bottom-left'

export interface WidgetConfig {
  apiUrl?: string
  title?: string
  subtitle?: string
  primaryColor?: string
  position?: WidgetPosition
  greeting?: string
  placeholder?: string
  locale?: 'es' | 'en'
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
