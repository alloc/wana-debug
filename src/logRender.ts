import { getDebug, Auto } from 'wana'

export function logRender(
  auto: Auto,
  depth: number,
  component: React.ComponentType<any>
) {
  if (!component.displayName) {
    console.warn(
      'Component without "displayName" is harder to debug',
      component
    )
  }
  const indent = ' '.repeat(depth)
  const debug = getDebug(auto)
  console.debug(
    indent + '<' + debug.name + ' />',
    '⚛️' + debug.renders,
    debug.actions
  )
}
