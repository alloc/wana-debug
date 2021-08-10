// @see https://stackoverflow.com/a/47736563/2228559
export {}

declare global {
  // Provided by react-native
  const console: {
    log(...args: any[]): void
    warn(...args: any[]): void
    debug(...args: any[]): void
    trace(): void
    groupCollapsed(arg: string): void
    groupEnd(): void
  }
}
