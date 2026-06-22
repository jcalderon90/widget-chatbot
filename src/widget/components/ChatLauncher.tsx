import { ChatIcon } from './Icons'

interface ChatLauncherProps {
  isOpen: boolean
  showBadge?: boolean
  onClick: () => void
}

export function ChatLauncher({ isOpen, showBadge = true, onClick }: ChatLauncherProps) {
  return (
    <button
      type="button"
      className="garoo-launcher"
      onClick={onClick}
      aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
      aria-expanded={isOpen}
      style={{ position: 'relative' }}
    >
      <ChatIcon />
      {!isOpen && showBadge && <span className="garoo-launcher__badge" aria-hidden="true" />}
    </button>
  )
}
