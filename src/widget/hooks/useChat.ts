import { useCallback, useEffect, useRef, useState } from 'react'
import { createMessageId } from '../config'
import { getOrCreateSessionId, loadHistory, saveHistory } from '../storage'
import type { ChatMessage, ResolvedConfig } from '../types'

/** El agente agrupa mensajes (espera en Redis) antes de responder; 90 s cubre el peor caso con holgura. */
const REQUEST_TIMEOUT_MS = 90_000

const MOCK_REPLIES = [
  'Gracias por tu mensaje. Un agente te atenderá en breve.',
  'Entiendo tu consulta. ¿Puedes darme un poco más de contexto?',
  'Perfecto, estoy revisando la información para ayudarte.',
  '¿Hay algo más en lo que pueda asistirte?',
]

async function fetchN8nReply(config: ResolvedConfig, message: string, sessionId: string): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        key: config.webhookKey,
        body: {
          id: sessionId,
          page_id: config.pageId,
          last_input_text: message,
          custom_fields: {
            propiedad: config.propertyId,
            canal_ingreso: 'widget',
          },
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = (await response.json()) as { response?: string; response_text?: string; reply?: string; message?: string }
    const reply = data.response_text ?? data.response ?? data.reply ?? data.message
    if (!reply) throw new Error('Empty reply')
    return reply
  } finally {
    clearTimeout(timer)
  }
}

function getMockReply(): string {
  return MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)]
}

export function useChat(config: ResolvedConfig) {
  const sessionId = useRef(getOrCreateSessionId(config.propertyId))
  const [messages, setMessages] = useState<ChatMessage[]>(
    () =>
      loadHistory(config.propertyId) ?? [
        {
          id: createMessageId(),
          role: 'assistant',
          content: config.greeting,
          timestamp: Date.now(),
          status: 'sent',
        },
      ],
  )
  const [isTyping, setIsTyping] = useState(false)

  // La conversación visible sobrevive a la navegación entre páginas del sitio.
  useEffect(() => {
    saveHistory(config.propertyId, messages)
  }, [config.propertyId, messages])

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

        if (config.apiUrl) {
          reply = await fetchN8nReply(config, trimmed, sessionId.current)
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
            content: config.ui.error,
            timestamp: Date.now(),
            status: 'error',
          },
        ])
      } finally {
        setIsTyping(false)
      }
    },
    [isTyping, config],
  )

  return { messages, isTyping, sendMessage }
}
