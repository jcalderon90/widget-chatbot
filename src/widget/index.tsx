import { destroyWidget, mountWidget } from './mount'
import type { GarooChatInstance, WidgetConfig } from './types'

function init(config: WidgetConfig = {}): GarooChatInstance {
  return mountWidget(config)
}

const GarooChat = { init }

if (typeof window !== 'undefined') {
  window.GarooChat = GarooChat
}

export { init, destroyWidget, mountWidget }
export type { GarooChatInstance, WidgetConfig }
