import { getCurrentAuto, globals, useAutoContext } from 'wana'
import { logRender } from './logRender'

// Track which component began rendering most recently.
let lastComponent: React.ComponentType | undefined

if (__DEV__) {
  const { onRender } = globals
  globals.onRender = (auto, depth, component) => {
    lastComponent = component
    if (onRender) {
      onRender(auto, depth, component)
    }
  }
}

export function useRenderLog() {
  const auto = getCurrentAuto()
  if (!auto || !lastComponent) {
    throw Error('Cannot call "useRenderLog" outside a "withAuto" component')
  }
  const { depth } = useAutoContext()
  logRender(auto, depth, lastComponent)
}
