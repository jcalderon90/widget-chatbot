import type { UiStrings } from '../types'
import { ChatIcon } from './Icons'

interface ChatLauncherProps {
  isOpen: boolean
  showBadge?: boolean
  ui: UiStrings
  onClick: () => void
}

export function ChatLauncher({ isOpen, showBadge = true, ui, onClick }: ChatLauncherProps) {
  return (
    <button
      type="button"
      className="garoo-launcher"
      onClick={onClick}
      aria-label={isOpen ? ui.closeChat : ui.openChat}
      aria-expanded={isOpen}
    >
      <ChatIcon />
      {!isOpen && showBadge && <span className="garoo-launcher__badge" aria-hidden="true" />}
    </button>
  )
}
