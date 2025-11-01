import React from 'react'

import HistoryItem from '../history-item'

import type { AskHistoryItem } from '../../helpers/cache'

export interface HistoryTooltipProps {
  history: AskHistoryItem[]
  onQuestionClick: (question: string) => void
}

function HistoryTooltip({ history, onQuestionClick }: HistoryTooltipProps) {
  const handleQuestionClick = (question: string) => {
    onQuestionClick(question)
  }

  return (
    <div
      className={`
        absolute bottom-full left-0 mb-0.5 w-72 rounded-lg border
        border-gray-600 bg-gray-800 p-3 text-sm leading-relaxed text-white
        shadow-2xl
      `}
    >
      {history.length === 0
        ? (
            <div className='text-center text-gray-400'>
              暂无历史提问记录
              <br />
              <span className='text-xs text-gray-500'>
                在输入框中输入问题并按回车即可保存
              </span>
            </div>
          )
        : (
            <>
              <div className={`
                mb-2 border-b border-gray-600 pb-1.5 font-semibold text-gray-300
              `}
              >
                历史问题 (
                {history.length}
                /5)
              </div>

              {history.map((item, index) => {
                const isLatest = index === history.length - 1
                const isLast = index === history.length - 1

                return (
                  <HistoryItem
                    key={item.timestamp}
                    item={item}
                    isLatest={isLatest}
                    isLast={isLast}
                    onQuestionClick={handleQuestionClick}
                  />
                )
              })}
            </>
          )}

      {/* Tooltip arrow */}
      <div className={`
        absolute top-full left-5 h-0 w-0 border-t-[6px] border-r-[6px]
        border-l-[6px] border-t-gray-800 border-r-transparent
        border-l-transparent
      `}
      />
    </div>
  )
}

export default HistoryTooltip
