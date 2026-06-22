import { BotIcon, CloseIcon } from './Icons'

interface ChatHeaderProps {
  title: string
  subtitle: string
  onClose: () => void
}

export function ChatHeader({ title, subtitle, onClose }: ChatHeaderProps) {
  return (
    <header className="garoo-header">
      <div className="garoo-header__avatar">
        <BotIcon />
      </div>
      <div className="garoo-header__info">
        <h2 className="garoo-header__title">{title}</h2>
        <p className="garoo-header__subtitle">{subtitle}</p>
      </div>
      <button
        type="button"
        className="garoo-header__close"
        onClick={onClose}
        aria-label="Cerrar chat"
      >
        <CloseIcon />
      </button>
    </header>
  )
}
