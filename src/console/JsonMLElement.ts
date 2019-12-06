import CSS from 'csstype'
import { renderStyle, styles } from './styles'

type Attributes = { [key: string]: any }

// Adapted from http://bit.ly/2YmHlST
export class JsonMLElement {
  protected _attributes: Attributes = {}
  protected _jsonML: [string, Attributes, ...any[]]

  constructor(tagName: string, className?: string) {
    this._jsonML = [tagName, this._attributes]
    if (className) {
      this.setAttribute('class', className)
    }
  }

  toJsonML() {
    return this._jsonML
  }

  createChild(tagName: string, className?: string) {
    const child = new JsonMLElement(tagName, className)
    this._jsonML.push(child.toJsonML())
    return child
  }

  createObjectTag(object: object) {
    const tag = this.createChild('object')
    tag.setAttribute('object', object)
    return tag
  }

  appendStyle(style: CSS.Properties) {
    this._attributes.style += renderStyle(style)
  }

  setAttribute(key: string, value: any) {
    if (key == 'class') {
      const style = value
        .split(' ')
        .reduce((style: string, className: string) => {
          return style + (styles[className] || '')
        }, '')

      if (!style) return
      key = 'style'
    }

    this._attributes[key] = value
  }

  createTextChild(value: any) {
    this._jsonML.push(toString(value))
  }

  createTextChildren(...values: any[]) {
    values.forEach(value => this.createTextChild(value))
  }
}

function toString(value: any) {
  return value ? value.toString() : value + ''
}
