import is from '@alloc/is'
import { JsonMLElement } from './JsonMLElement'

// Defer rendering to the "object" tag.
const shouldUseObjectTag = (object: object) =>
  is.nativePromise(object) ||
  is.function_(object) ||
  is.array(object) ||
  is.map(object) ||
  is.set(object) ||
  is.regExp(object)

export function renderObjectPreview(object: object) {
  const root = new JsonMLElement(
    'span',
    'console-object console-object-preview wana-debug'
  )

  if (shouldUseObjectTag(object)) {
    root.createObjectTag(object)
    return root
  }

  // Short description
  const name = root.createChild('span', 'object-description')
  name.createTextChild(object.constructor.name + ' ')

  // Properties
  const props = root.createChild('span', 'object-properties-preview')
  props.createTextChild('{')
  let i = 0
  for (const name in object) {
    const desc = Object.getOwnPropertyDescriptor(object, name)!
    if (i > 0) {
      const truncated = i >= 5
      props.createTextChild(', ' + (truncated ? '…' : ''))
      if (truncated) break
    }
    i++
    renderPropertyName(props, name)
    props.createTextChild(': ')
    renderPropertyPreview(props, desc)
  }
  props.createTextChild('}')

  return root
}

// Adapted from http://bit.ly/2OSMUp3
export function renderPropertyName(
  parent: JsonMLElement,
  name: string | symbol
) {
  const displayName = is.symbol(name)
    ? name
    : /^\s|\s$|^$|\n/.test(name)
    ? '"' + name.replace(/\n/g, '\u21B5') + '"'
    : name

  const span = parent.createChild('span', 'object-property-name')
  span.createTextChild(displayName)
  return span
}

// Adapted from http://bit.ly/36bbDe5
export function renderPropertyPreview(
  parent: JsonMLElement,
  { value, get }: PropertyDescriptor
) {
  const type = is(value).toLowerCase()
  const span = parent.createChild('span', 'object-value-' + type)

  if (get) {
    span.createTextChild('(...)')
    span.setAttribute('title', 'The property is computed with a getter')
    return span
  }

  if (type == 'function') {
    span.createTextChild('\u0192')
    return span
  }

  if (type == 'string') {
    span.createTextChildren('"', value.replace(/\n/g, '\u21B5'), '"')
    return span
  }

  if (type == 'object') {
    const name = value.constructor.name
    span.createTextChild(name == 'Object' ? '{\u2026}' : name)
    return span
  }

  if (/^(array|map|set)$/.test(type)) {
    const size = value[is.array(value) ? 'length' : 'size']
    span.createTextChild(is(value) + '(' + size + ')')
    return span
  }

  span.createTextChild(value)
  return span
}
