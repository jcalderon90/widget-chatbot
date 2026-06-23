import type { WidgetConfig } from './types'

export const DEFAULT_CONFIG: Required<WidgetConfig> = {
  apiUrl: '',
  webhookKey: '',
  propertyId: 'ITZ',
  pageId: 'widget',
  title: 'Garoo Assistant',
  subtitle: 'Suele responder en segundos',
  primaryColor: '#0d9488',
  position: 'bottom-right',
  greeting: '¡Hola! 👋 ¿En qué puedo ayudarte hoy?',
  placeholder: 'Escribe tu mensaje...',
  locale: 'es',
}

export function mergeConfig(config: WidgetConfig = {}): Required<WidgetConfig> {
  return { ...DEFAULT_CONFIG, ...config }
}

export function createMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}
