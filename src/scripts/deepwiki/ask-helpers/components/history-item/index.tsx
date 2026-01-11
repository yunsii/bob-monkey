import { Typography } from 'antd'

import { formatTime } from '../../utils/time-formatter'

import type { AskHistoryItem } from '../../helpers/cache'

const { Paragraph, Text } = Typography

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
    ? 'border-blue-400 bg-blue-50 hover:bg-blue-100 dark:border-blue-500 dark:bg-blue-950 dark:hover:bg-blue-900'
    : 'border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700'

  return (
    <div
      className={`
        ${marginClass}
        ${baseClasses}
        ${styleClasses}
      `}
      onClick={handleClick}
    >
      <Paragraph
        ellipsis={{ rows: 2, tooltip: item.question }}
        className={`
          mb-2 text-gray-900
          dark:text-gray-50
        `}
      >
        {item.question}
      </Paragraph>
      <div className='flex items-center justify-between'>
        <Text className={`
          text-xs text-gray-600
          dark:text-gray-400
        `}
        >
          {formatTime(item.timestamp)}
        </Text>
        {isLatest && (
          <Text
            strong
            className={`
              text-xs text-blue-600
              dark:text-blue-400
            `}
          >
            最新
          </Text>
        )}
      </div>
    </div>
  )
}

export default HistoryItem
