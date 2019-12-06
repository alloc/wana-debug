import is from 'is'
import { $$, no } from 'wana'
import { renderObjectPreview } from './renderObjectPreview'

interface ConsoleFormatter {
  header: (object: any, config: any) => any
  hasBody?: (object: any, config: any) => boolean | null
  body?: (object: any, config: any) => any
}

declare const window: any
window.formatted = []

export const proxyFormatter: ConsoleFormatter = {
  header: target => {
    const header = renderHeader(target)
    window.formatted.push({ target, header })
    return header
  },
  hasBody: target => {
    return unwrap(target) !== target
  },
  body: target => {
    // TODO: render the properties only
    return ['object', { object: unwrap(target) }]
  },
}

function unwrap(target: any) {
  return is.function_(target) ? target[$$] || target : no(target)
}

function renderHeader(target: any) {
  const object = unwrap(target)
  if (object !== target) {
    return renderObjectPreview(object).toJsonML()
  }
  return null
}
