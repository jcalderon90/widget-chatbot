import { useEffect, useRef } from 'react'
import type { ChatMessage, UiStrings } from '../types'
import { MessageBubble, TypingIndicator } from './MessageBubble'

interface MessageListProps {
  messages: ChatMessage[]
  isTyping: boolean
  ui: UiStrings
}

export function MessageList({ messages, isTyping, ui }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="garoo-messages" role="log" aria-live="polite" aria-relevant="additions">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} ui={ui} />
      ))}
      {isTyping && <TypingIndicator label={ui.typing} />}
      <div ref={bottomRef} />
    </div>
  )
}
