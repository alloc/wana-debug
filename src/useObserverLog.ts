import { getCurrentAuto, getDebug, $O } from 'wana'
import { useEffect } from 'react'
import { format } from './format'
import is from 'is'

export function useObserverLog(name?: string) {
  const auto = getCurrentAuto()
  if (!auto) {
    throw Error('Cannot call "useObserverLog" outside a "withAuto" component')
  }
  useEffect(() => {
    const { observer } = auto
    if (observer) {
      const { observed } = observer

      let [message, ...args] = format(
        '$count values were observed by $name',
        { count: observed.size, name: name || getDebug(auto).name },
        { name: 'color: #7BB347' }
      )

      observed.forEach(({ key, owner }) => {
        const [line, ...vars] = format(
          '\n    $key of $target',
          {
            key: key == $O ? 'all' : is.string(key) ? `"${key}"` : key,
            target: owner.source,
          },
          key == $O ? { key: '' } : undefined
        )
        message += line
        args.push(...vars)
      })

      console.log(message, ...args)
    }
  })
}
