import { useEffect, useImperativeHandle, useState, forwardRef, useRef } from 'react'
import { mergeConfig } from '../config'
import { useChat } from '../hooks/useChat'
import type { WidgetConfig } from '../types'
import { ChatHeader } from './ChatHeader'
import { ChatInput } from './ChatInput'
import { ChatLauncher } from './ChatLauncher'
import { MessageList } from './MessageList'

export interface ChatWidgetHandle {
  open: () => void
  close: () => void
  toggle: () => void
  sendMessage: (text: string) => void
}

interface ChatWidgetProps {
  config: WidgetConfig
}

export const ChatWidget = forwardRef<ChatWidgetHandle, ChatWidgetProps>(function ChatWidget(
  { config },
  ref,
) {
  const merged = mergeConfig(config)
  const [isOpen, setIsOpen] = useState(false)
  const { messages, isTyping, sendMessage } = useChat(config)
  const rootRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
    sendMessage,
  }))

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    root.style.setProperty('--garoo-primary', merged.primaryColor)
    root.style.setProperty('--garoo-primary-dark', adjustColor(merged.primaryColor, -20))
    root.style.setProperty('--garoo-primary-soft', hexToRgba(merged.primaryColor, 0.12))
  }, [merged.primaryColor])

  const positionClass =
    merged.position === 'bottom-left' ? 'garoo-root--bottom-left' : 'garoo-root--bottom-right'

  return (
    <div ref={rootRef} className={`garoo-root ${positionClass}`}>
      {isOpen && (
        <div className="garoo-panel" role="dialog" aria-modal="true" aria-label={merged.title}>
          <ChatHeader
            title={merged.title}
            subtitle={merged.subtitle}
            onClose={() => setIsOpen(false)}
          />
          <MessageList messages={messages} isTyping={isTyping} />
          <ChatInput
            placeholder={merged.placeholder}
            disabled={isTyping}
            onSend={sendMessage}
          />
        </div>
      )}
      <ChatLauncher isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />
    </div>
  )
})

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '')
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized
  const num = parseInt(full, 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function adjustColor(hex: string, amount: number): string {
  const normalized = hex.replace('#', '')
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized
  const num = parseInt(full, 16)
  let r = (num >> 16) & 255
  let g = (num >> 8) & 255
  let b = num & 255

  r = Math.max(0, Math.min(255, r + amount))
  g = Math.max(0, Math.min(255, g + amount))
  b = Math.max(0, Math.min(255, b + amount))

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}
