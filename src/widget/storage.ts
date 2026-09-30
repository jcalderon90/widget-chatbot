import type { ChatMessage } from './types'

// Toda lectura/escritura va en try/catch: en Safari privado, iframes con cookies
// bloqueadas o políticas del sitio host, el acceso a storage lanza excepción.

/** La conversación visible se descarta tras 24 h sin actividad. */
const HISTORY_TTL_MS = 24 * 60 * 60 * 1000
/** Tope de mensajes guardados (la memoria del agente en el servidor es de 30). */
const HISTORY_MAX = 60

function read(storage: 'local' | 'session', key: string): string | null {
  try {
    return (storage === 'local' ? window.localStorage : window.sessionStorage).getItem(key)
  } catch {
    return null
  }
}

function write(storage: 'local' | 'session', key: string, value: string): void {
  try {
    ;(storage === 'local' ? window.localStorage : window.sessionStorage).setItem(key, value)
  } catch {
    // Sin storage el widget sigue funcionando, solo sin persistencia entre páginas.
  }
}

function suffix(propertyId: string): string {
  return propertyId ? `_${propertyId}` : ''
}

function randomId(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
  }
}

/** Una sesión por propiedad, para que dos hoteles en el mismo dominio no compartan memoria. */
export function getOrCreateSessionId(propertyId: string): string {
  const key = `gsid_garoo${suffix(propertyId)}`
  let id = read('local', key)
  if (!id) {
    id = randomId()
    write('local', key, id)
  }
  return id
}

interface StoredHistory {
  savedAt: number
  messages: ChatMessage[]
}

export function loadHistory(propertyId: string): ChatMessage[] | null {
  const raw = read('local', `gmsg_garoo${suffix(propertyId)}`)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as StoredHistory
    if (!Array.isArray(parsed.messages) || Date.now() - parsed.savedAt > HISTORY_TTL_MS) return null
    return parsed.messages
  } catch {
    return null
  }
}

export function saveHistory(propertyId: string, messages: ChatMessage[]): void {
  const stored: StoredHistory = { savedAt: Date.now(), messages: messages.slice(-HISTORY_MAX) }
  write('local', `gmsg_garoo${suffix(propertyId)}`, JSON.stringify(stored))
}

/** El panel abierto/cerrado se recuerda solo dentro de la pestaña, para que siga abierto al navegar. */
export function loadOpenState(propertyId: string): boolean {
  return read('session', `gopen_garoo${suffix(propertyId)}`) === '1'
}

export function saveOpenState(propertyId: string, isOpen: boolean): void {
  write('session', `gopen_garoo${suffix(propertyId)}`, isOpen ? '1' : '0')
}
