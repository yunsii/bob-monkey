/// <reference types="vite/client" />
/* eslint-disable no-console */

function print(method: (...args: any[]) => void, ...args: any[]) {
  if (import.meta.env.MODE === 'production') {
    return
  }

  if (typeof args[0] === 'string') {
    const message = args.shift()
    method(`[bob-monkey] ${message}`, ...args)
  } else {
    method('[bob-monkey]', ...args)
  }
}

/**
 * Wrapper around `console` with a "[bob-monkey]" prefix
 */
export const logger = {
  debug: (...args: any[]) => print(console.debug, ...args),
  log: (...args: any[]) => print(console.log, ...args),
  warn: (...args: any[]) => print(console.warn, ...args),
  error: (...args: any[]) => print(console.error, ...args),
}
