import is from 'is'
import { $$, $O, no } from 'wana'

interface ConsoleFormatter {
  header: (object: any, config: any) => any
  hasBody: (object: any, config: any) => boolean | null
  body?: (object: any, config: any) => any
}

const defused = new Map<object, object>()

declare const window: any
window.defused = defused

export const proxyFormatter: ConsoleFormatter = {
  header: target => {
    const object = unwrap(target)
    if (is.function_(object)) {
      return ['object', { object }]
    }
    if (object !== target || containsObservable(object)) {
      return ['object', { object: defuse(object) }]
    }
    return null
  },
  hasBody() {
    return false
  },
}

function unwrap(target: any) {
  return is.function_(target) ? target[$$] || target : no(target)
}

function containsObservable(target: any) {
  if (is.object(target) && target !== window) {
    for (const name in getOwnPropertyNames(target)) {
      const desc = Object.getOwnPropertyDescriptor(target, name)
      if (desc && desc.value && desc.value[$O]) {
        return true
      }
    }
  }
  return false
}

function defuse(target: object) {
  let copy = defused.get(target)
  if (!copy) {
    copy = is.array(target)
      ? target.map(unwrap)
      : is.set(target)
      ? new Set(Array.from(target, unwrap))
      : is.map(target)
      ? new Map(Array.from(target, unwrap))
      : defuseProps(target)

    defused.set(target, copy)
  }
  return copy
}

function defuseProps(target: object): object {
  const copy = Object.create(Object.getPrototypeOf(target))
  getOwnPropertyNames(target).forEach(name => {
    const prop = Object.getOwnPropertyDescriptor(target, name)!
    if (!prop.get) {
      prop.value = unwrap(prop.value)
    }
    Object.defineProperty(copy, name, prop)
  })
  return copy
}

function getOwnPropertyNames(object: object) {
  return ([] as (string | symbol)[]).concat(
    Object.getOwnPropertyNames(object),
    Object.getOwnPropertySymbols(object)
  )
}
