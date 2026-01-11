import { Input, Typography } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { InputRef } from 'antd'

import { getHistory, removeFromHistory } from '../../helpers/cache'
import { HistoryTag } from '../history-tag'

const { Title, Text } = Typography

export function HistoryPanel() {
  const [query, setQuery] = useState('')
  const [history, setHistory] = useState<string[]>(() => getHistory())
  const inputRef = useRef<InputRef>(null)

  const filteredHistory = useMemo(() => {
    return history.filter((path) => path.toLowerCase().includes(query.toLowerCase()))
  }, [history, query])

  useEffect(() => {
    // 组件挂载后自动 focus 输入框
    inputRef.current?.focus()
  }, [])

  const handleRemove = (path: string) => {
    removeFromHistory(path)
    setHistory(getHistory()) // Refresh history
  }

  return (
    <div>
      <div className={`
        border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4
        dark:border-gray-700 dark:from-blue-950 dark:to-indigo-950
      `}
      >
        <Title level={4} className='mb-3 flex items-center'>
          <span className={`
            mr-2 i-bx--time size-5 text-blue-600
            dark:text-blue-400
          `}
          />
          历史记录
        </Title>
        <Input
          ref={inputRef}
          placeholder='搜索历史记录...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          prefix={<span className='i-bx--search size-4' />}
          allowClear
          size='large'
        />
      </div>
      <div className={`
        h-64 overflow-y-auto bg-white/50 p-4
        dark:bg-gray-900/50
      `}
      >
        {filteredHistory.length === 0
          ? (
              <div className='py-12 text-center'>
                <span className={`
                  mx-auto mb-4 i-bx--question-mark block size-12 text-gray-300
                  dark:text-gray-600
                `}
                />
                <Text className='block text-base' type='secondary'>
                  {query ? '未找到匹配的历史记录' : '暂无历史记录'}
                </Text>
                <Text className='mt-2 block text-sm' type='secondary'>
                  {query ? '请尝试调整搜索词' : '开始探索以建立历史记录！'}
                </Text>
              </div>
            )
          : (
              <div className='flex flex-wrap gap-4'>
                {filteredHistory.map((path) => (
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
