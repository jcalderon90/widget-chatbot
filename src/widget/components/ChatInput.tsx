import { useRef, type FormEvent, type KeyboardEvent } from 'react'
import { SendIcon } from './Icons'

interface ChatInputProps {
  placeholder: string
  disabled?: boolean
  onSend: (text: string) => void
}

export function ChatInput({ placeholder, disabled, onSend }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const value = textareaRef.current?.value ?? ''
    if (!value.trim()) return

    onSend(value)
    if (textareaRef.current) {
      textareaRef.current.value = ''
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit(event)
    }
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }

  return (
    <div className="garoo-input-area">
      <form className="garoo-input-form" onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className="garoo-input"
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          aria-label="Mensaje"
        />
        <button
          type="submit"
          className="garoo-send"
          disabled={disabled}
          aria-label="Enviar mensaje"
        >
          <SendIcon />
        </button>
      </form>
      <p className="garoo-powered">Powered by Garoo Services</p>
    </div>
  )
}
