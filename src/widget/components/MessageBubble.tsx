import type { ChatMessage } from '../types'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isError = message.status === 'error'

  return (
    <div
      className={`garoo-bubble ${isUser ? 'garoo-bubble--user' : 'garoo-bubble--assistant'}${isError ? ' garoo-bubble--error' : ''}`}
      role="article"
      aria-label={isUser ? 'Tu mensaje' : 'Respuesta del asistente'}
    >
      {message.content}
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="garoo-typing" aria-label="Escribiendo..." role="status">
      <span />
      <span />
      <span />
    </div>
  )
}
