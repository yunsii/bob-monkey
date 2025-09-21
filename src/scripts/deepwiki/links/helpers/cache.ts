import { GM_getValue, GM_setValue } from '$'

const deepwikiHistoryCacheKey = 'deepwiki-history-cache-v1'

export function pushToHistory() {
  const pathname = location.pathname
  // Only cache paths like /owner/repo
  if (pathname.split('/').filter(Boolean).length !== 2) {
    return
  }
  const history = GM_getValue<string[]>(deepwikiHistoryCacheKey, [])
  const newHistory = [pathname, ...history.filter((item) => item !== pathname)].slice(0, 50)
  GM_setValue(deepwikiHistoryCacheKey, newHistory)
}

export function getHistory() {
  return GM_getValue<string[]>(deepwikiHistoryCacheKey, [])
}

export function removeFromHistory(path: string) {
  const history = GM_getValue<string[]>(deepwikiHistoryCacheKey, [])
  const newHistory = history.filter((item) => item !== path)
  GM_setValue(deepwikiHistoryCacheKey, newHistory)
}
