import { Typography } from 'antd'

import HistoryItem from '../history-item'

import type { AskHistoryItem } from '../../helpers/cache'

const { Paragraph, Text } = Typography

export interface HistoryTooltipProps {
  history: AskHistoryItem[]
  onQuestionClick: (question: string) => void
}

function HistoryTooltip({ history, onQuestionClick }: HistoryTooltipProps) {
  const handleQuestionClick = (question: string) => {
    onQuestionClick(question)
  }

  if (history.length === 0) {
    return (
      <div className='text-center'>
        <Paragraph type='secondary' style={{ marginBottom: 8 }}>
          暂无历史提问记录
        </Paragraph>
        <Text type='secondary' style={{ fontSize: 12 }}>
          在输入框中输入问题并按回车即可保存
        </Text>
      </div>
    )
  }

  return (
    <div className='w-72'>
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
    </div>
  )
}

export default HistoryTooltip
