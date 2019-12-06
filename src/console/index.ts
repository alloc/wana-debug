import { proxyFormatter } from './format'

declare const window: any

export function useProxyFormatter() {
  const list = window.devtoolsFormatters || []
  if (!list.includes(proxyFormatter)) {
    window.devtoolsFormatters = list
    list.push(proxyFormatter)
  }
}
