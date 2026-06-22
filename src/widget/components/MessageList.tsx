import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../types'
import { MessageBubble, TypingIndicator } from './MessageBubble'

interface MessageListProps {
  messages: ChatMessage[]
  isTyping: boolean
}

export function MessageList({ messages, isTyping }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="garoo-messages" role="log" aria-live="polite" aria-relevant="additions">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}
