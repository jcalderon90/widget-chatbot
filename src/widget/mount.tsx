import { createRoot, type Root } from 'react-dom/client'
import { createRef } from 'react'
import { ChatWidget, type ChatWidgetHandle } from './components/ChatWidget'
import type { GarooChatInstance, WidgetConfig } from './types'
import widgetStyles from './styles/widget.css?inline'

const HOST_ID = 'garoo-chat-widget-host'

let activeRoot: Root | null = null
let widgetRef = createRef<ChatWidgetHandle>()
let hostElement: HTMLElement | null = null

export function mountWidget(config: WidgetConfig = {}): GarooChatInstance {
  destroyWidget()

  hostElement = document.createElement('div')
  hostElement.id = HOST_ID
  document.body.appendChild(hostElement)

  const shadow = hostElement.attachShadow({ mode: 'open' })

  const styleEl = document.createElement('style')
  styleEl.textContent = widgetStyles
  shadow.appendChild(styleEl)

  const mountPoint = document.createElement('div')
  mountPoint.className = 'garoo-widget'
  shadow.appendChild(mountPoint)

  widgetRef = createRef<ChatWidgetHandle>()
  activeRoot = createRoot(mountPoint)
  activeRoot.render(<ChatWidget ref={widgetRef} config={config} />)

  return {
    open: () => widgetRef.current?.open(),
    close: () => widgetRef.current?.close(),
    toggle: () => widgetRef.current?.toggle(),
    destroy: destroyWidget,
    sendMessage: (text: string) => widgetRef.current?.sendMessage(text),
  }
}

export function destroyWidget(): void {
  activeRoot?.unmount()
  activeRoot = null
  hostElement?.remove()
  hostElement = null
}
