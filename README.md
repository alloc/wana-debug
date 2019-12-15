# @wana/debug

Debug utils for `wana`

### Hooks

- `useChangeLog`
- `useObserverLog`
- `useRenderLog`

```tsx
// Log changes to an observable object.
// The 2nd argument is optional. 
useChangeLog(object, { name, onChange })

// Log what's observed by a `withAuto` component on each render.
// The name is optional.
useObserverLog(name)

// Log when a `withAuto` component renders (and why).
useRenderLog()
```

### Functions

- `logChange`
- `logChanges`

```ts
// Log a change object created by wana.
// The targetId is optional.
logChange(change, targetId)

// Create an observer that logs changes to an observable object.
logChanges(object, { name, onChange })
```
