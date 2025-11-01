import { GM_getValue, GM_setValue } from '$'

import { isRepoPage } from '../../_helpers/repo'

const deepwikiAskHistoryCacheKey = 'deepwiki-ask-history-cache-v2'

export interface AskHistoryItem {
  question: string
  timestamp: number
}

export interface AskHistoryCache {
  [pathname: string]: AskHistoryItem[]
}

export function pushToAskHistory(question: string) {
  const pathname = location.pathname
  if (!isRepoPage() || !question.trim()) {
    return
  }

  const cache = GM_getValue<AskHistoryCache>(deepwikiAskHistoryCacheKey, {})
  const pathHistory = cache[pathname] || []

  const newItem: AskHistoryItem = {
    question: question.trim(),
    timestamp: Date.now(),
  }

  // 移除相同的问题（如果存在）并添加到最后面
  const filteredHistory = pathHistory.filter((item) => item.question !== question.trim())
  const newPathHistory = [...filteredHistory, newItem].slice(-5) // 每个页面最多保存5条记录，保留最新的5条

  // 更新缓存
  cache[pathname] = newPathHistory
  GM_setValue(deepwikiAskHistoryCacheKey, cache)
}

export function getAskHistory(pathname?: string): AskHistoryItem[] {
  const cache = GM_getValue<AskHistoryCache>(deepwikiAskHistoryCacheKey, {})

  // 如果没有指定 pathname，使用当前页面的路径
  const targetPath = pathname || location.pathname

  // 返回指定页面的历史记录
  return cache[targetPath] || []
}

export function getLastQuestion(pathname?: string): string | null {
  const history = getAskHistory(pathname)
  return history.length > 0 ? history[history.length - 1].question : null
}

export function removeFromAskHistory(question: string, pathname?: string) {
  const cache = GM_getValue<AskHistoryCache>(deepwikiAskHistoryCacheKey, {})
  const targetPath = pathname || location.pathname

  if (cache[targetPath]) {
    // 移除指定页面的指定问题
    cache[targetPath] = cache[targetPath].filter((item) => item.question !== question)
    GM_setValue(deepwikiAskHistoryCacheKey, cache)
  }
}

export function clearAskHistory() {
  GM_setValue(deepwikiAskHistoryCacheKey, {})
}

export function clearAskHistoryByPath(pathname?: string) {
  const cache = GM_getValue<AskHistoryCache>(deepwikiAskHistoryCacheKey, {})
  const targetPath = pathname || location.pathname

  // 删除指定页面的所有历史记录
  delete cache[targetPath]
  GM_setValue(deepwikiAskHistoryCacheKey, cache)
}

export function getAllAskHistory(): AskHistoryCache {
  return GM_getValue<AskHistoryCache>(deepwikiAskHistoryCacheKey, {})
}

export function getAskHistoryCount(pathname?: string): number {
  return getAskHistory(pathname).length
}

export function getAllAskHistoryCount(): number {
  const cache = getAllAskHistory()
  return Object.values(cache).reduce((total, items) => total + items.length, 0)
}

export function getAllPathnames(): string[] {
  const cache = getAllAskHistory()
  return Object.keys(cache)
}
