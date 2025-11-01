import React from 'react'

import { formatTime } from '../../utils/time-formatter'

import type { AskHistoryItem } from '../../helpers/cache'

export interface HistoryItemProps {
  item: AskHistoryItem
  isLatest: boolean
  isLast: boolean
  onQuestionClick: (question: string) => void
}

function HistoryItem({ item, isLatest, isLast, onQuestionClick }: HistoryItemProps) {
  const handleClick = () => {
    onQuestionClick(item.question)
  }

  const baseClasses = 'p-2 cursor-pointer rounded-md border transition-colors duration-200'
  const marginClass = isLast ? 'mb-0' : 'mb-2'
  const styleClasses = isLatest
    ? 'border-emerald-500 bg-emerald-800 hover:bg-emerald-700'
    : 'border-gray-600 bg-gray-700 hover:bg-gray-600'

  return (
    <div
      className={`
        ${marginClass}
        ${baseClasses}
        ${styleClasses}
      `}
      onClick={handleClick}
    >
      <div className='mb-1 break-words text-gray-100'>
        {item.question.length > 50
          ? `${item.question.substring(0, 50)}...`
          : item.question}
      </div>
      <div className='flex items-center justify-between text-xs text-gray-400'>
        <span>{formatTime(item.timestamp)}</span>
        {isLatest && (
          <span className='text-xs font-medium text-emerald-400'>
            最新
          </span>
        )}
      </div>
    </div>
  )
}

export default HistoryItem
