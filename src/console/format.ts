import { is } from 'is'
import { $$, no } from 'wana'

declare const window: any

interface ConsoleFormatter {
  header: (object: any, config: any) => any
  hasBody: (object: any, config: any) => boolean | null
  body?: (object: any, config: any) => any
}

const isCopy = Symbol()

export const proxyFormatter: ConsoleFormatter = {
  header: target => {
    if (target === window) {
      return null
    }
    if (!target[isCopy]) {
      const object = unwrap(target)
      if (is.function(object) && object !== target) {
        return ['object', { object }]
      }
      if (is.object(object)) {
        return ['object', { object: defuse(object) }]
      }
    }
    return null
  },
  hasBody() {
    return false
  },
}

function unwrap(target: any) {
  return is.function(target) ? target[$$] || target : no(target)
}

function defuse(target: object): object {
  return recurse(target)

  function recurse(target: any): any {
    if (target === window) {
      return target
    }
    target = unwrap(target)
    if (is.function(target)) {
      return target
    }
    if (isCopyable(target)) {
      const copy = createCopy(target)
      copy[isCopy] = true
      return copy
    }
    return target
  }

  function createCopy(target: any): any {
    if (target[isCopy]) {
      return target
    }
    return is.array(target)
      ? target.map(recurse)
      : is.set(target)
      ? new Set(Array.from(target, recurse))
      : is.map(target)
      ? new Map(Array.from(target, recurse))
      : defuseProps(target)
  }

  function defuseProps(target: object): object {
    const copy = Object.create(Object.getPrototypeOf(target))
    getOwnPropertyNames(target).forEach(name => {
      const prop = Object.getOwnPropertyDescriptor(target, name)!
      if (!prop.get) {
        prop.value = recurse(prop.value)
      }
      Object.defineProperty(copy, name, prop)
    })
    return copy
  }
}

function isCopyable(target: any) {
  return (
    is.object(target) &&
    !is.date(target) &&
    !is.regExp(target) &&
    !is.promise(target) &&
    !is.weakMap(target) &&
    !is.weakSet(target)
  )
}

function getOwnPropertyNames(object: object) {
  return ([] as (string | symbol)[]).concat(
    Object.getOwnPropertyNames(object),
    Object.getOwnPropertySymbols(object)
  )
}
