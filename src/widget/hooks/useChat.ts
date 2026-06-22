import { useCallback, useState } from 'react'
import { createMessageId, mergeConfig } from '../config'
import type { ChatMessage, WidgetConfig } from '../types'

const MOCK_REPLIES = [
  'Gracias por tu mensaje. Un agente te atenderá en breve.',
  'Entiendo tu consulta. ¿Puedes darme un poco más de contexto?',
  'Perfecto, estoy revisando la información para ayudarte.',
  '¿Hay algo más en lo que pueda asistirte?',
]

async function fetchBotReply(apiUrl: string, message: string): Promise<string> {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = (await response.json()) as { reply?: string; message?: string }
  return data.reply ?? data.message ?? MOCK_REPLIES[0]
}

function getMockReply(): string {
  return MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)]
}

export function useChat(config: WidgetConfig) {
  const merged = mergeConfig(config)
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: createMessageId(),
      role: 'assistant',
      content: merged.greeting,
      timestamp: Date.now(),
      status: 'sent',
    },
  ])
  const [isTyping, setIsTyping] = useState(false)

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isTyping) return

      const userMessage: ChatMessage = {
        id: createMessageId(),
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
        status: 'sent',
      }

      setMessages((prev) => [...prev, userMessage])
      setIsTyping(true)

      try {
        let reply: string

        if (merged.apiUrl) {
          reply = await fetchBotReply(merged.apiUrl, trimmed)
        } else {
          await new Promise((resolve) => setTimeout(resolve, 900 + Math.random() * 800))
          reply = getMockReply()
        }

        const assistantMessage: ChatMessage = {
          id: createMessageId(),
          role: 'assistant',
          content: reply,
          timestamp: Date.now(),
          status: 'sent',
        }

        setMessages((prev) => [...prev, assistantMessage])
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: createMessageId(),
            role: 'assistant',
            content: 'Lo siento, hubo un error al procesar tu mensaje. Inténtalo de nuevo.',
            timestamp: Date.now(),
            status: 'error',
          },
        ])
      } finally {
        setIsTyping(false)
      }
    },
    [isTyping, merged.apiUrl],
  )

  return { messages, isTyping, sendMessage }
}
