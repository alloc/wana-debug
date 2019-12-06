import CSS from 'csstype'
import { paramCase } from 'param-case'

export { CSS }

const nullStyle: CSS.Properties = { color: 'rgb(128, 128, 128)' }
const stringStyle: CSS.Properties = {
  color: 'rgb(196, 26, 22)',
  unicodeBidi: '-webkit-isolate',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
}

const rawStyles: {
  [className: string]: CSS.Properties
} = {
  'console-object': {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
  'console-object-preview': {
    fontStyle: 'italic',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
  },
  'object-property-name': {
    color: '#565656',
    flexShrink: 0,
  },
  'object-value-null': nullStyle,
  'object-value-undefined': nullStyle,
  'object-value-symbol': stringStyle,
  'object-value-string': stringStyle,
  'object-value-regexp': stringStyle,
  'object-value-number': {
    color: 'rgb(28, 0, 207)',
  },
  'object-value-boolean': {
    color: 'rgb(13, 34, 170)',
  },
  'object-value-function': {
    fontStyle: 'italic',
  },
}

export const styles = Object.keys(rawStyles).reduce<{
  [className: string]: string
}>((styles, className) => {
  styles[className] = renderStyle(rawStyles[className])
  return styles
}, {})

export function renderStyle(style: CSS.Properties) {
  let result = ''
  for (const key in style) {
    result += paramCase(key) + ': ' + style[key as keyof CSS.Properties] + ';'
  }
  return result
}
