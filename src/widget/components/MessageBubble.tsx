import type { ChatMessage } from '../types'

interface MessageBubbleProps {
  message: ChatMessage
}

function linkify(text: string) {
  const urlRegex = /(https?:\/\/[^\s<]+)/g
  const parts = text.split(urlRegex)
  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      urlRegex.lastIndex = 0
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="garoo-bubble__link">
          {part}
        </a>
      )
    }
    return part
  })
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
      {linkify(message.content)}
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
