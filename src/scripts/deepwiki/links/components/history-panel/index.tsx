import { useMemo, useState } from 'react'

import { getHistory, removeFromHistory } from '../../helpers/cache'
import { HistoryTag } from '../history-tag'

export function HistoryPanel() {
  const [query, setQuery] = useState('')
  const [history, setHistory] = useState<string[]>(() => getHistory())
  const filteredHistory = useMemo(() => {
    return history.filter((path) => path.toLowerCase().includes(query.toLowerCase()))
  }, [history, query])

  const handleRemove = (path: string) => {
    removeFromHistory(path)
    setHistory(getHistory()) // Refresh history
  }

  return (
    <div className={`
      flex max-h-96 flex-col overflow-hidden rounded-lg border border-gray-200
      bg-gradient-to-br from-white to-gray-50 shadow-lg
    `}
    >
      <div className={`
        border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4
      `}
      >
        <h2 className='mb-3 flex items-center text-xl font-bold text-gray-800'>
          <span className='mr-2 i-bx--time size-5 text-blue-600' />
          历史记录
        </h2>
        <div className='relative'>
          <span className={`
            pointer-events-none absolute top-1/2 left-3 i-bx--search size-5
            -translate-y-1/2 text-gray-400
          `}
          />
          <input
            type='text'
            placeholder='搜索历史记录...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`
              w-full rounded-lg border-2 border-gray-200 bg-white py-3 pr-4
              pl-10 shadow-sm transition-all duration-300
              focus:border-blue-500 focus:ring-4 focus:ring-blue-100
              focus:outline-none
            `}
          />
        </div>
      </div>
      <div className='h-64 overflow-y-auto bg-white/50 p-4'>
        {filteredHistory.length === 0
          ? (
              <div className='py-12 text-center'>
                <span className={`
                  mx-auto mb-4 i-bx--question-mark block size-12 text-gray-300
                `}
                />
                <p className='text-lg text-gray-500'>
                  {query ? '未找到匹配的历史记录' : '暂无历史记录'}
                </p>
                <p className='mt-1 text-sm text-gray-400'>
                  {query ? '请尝试调整搜索词' : '开始探索以建立历史记录！'}
                </p>
              </div>
            )
          : (
              <div className='flex flex-wrap gap-3'>
                {filteredHistory.map((path, index) => (
                  <HistoryTag
                    key={path}
                    path={path}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            )}
      </div>
    </div>
  )
}
