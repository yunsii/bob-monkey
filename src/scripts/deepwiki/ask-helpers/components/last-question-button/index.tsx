import React, { useEffect, useRef, useState } from 'react'

import { useQuestionHistory } from '../../hooks/use-question-history'
import HistoryTooltip from '../history-tooltip'

export interface LastQuestionButtonProps {
  element: HTMLTextAreaElement
}

function LastQuestionButton(props: LastQuestionButtonProps) {
  const { element } = props
  const [showTooltip, setShowTooltip] = useState(false)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { history, handleLastQuestionClick, handleQuestionClick } = useQuestionHistory(element)

  // 清理超时
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [])

  const onQuestionClick = (question: string) => {
    handleQuestionClick(question)
    setShowTooltip(false)
  }

  const handleMouseEnter = () => {
    // 清除隐藏延时
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    setShowTooltip(true)
  }

  const handleMouseLeave = () => {
    // 延迟隐藏，给用户时间移动到 tooltip
    hideTimeoutRef.current = setTimeout(() => {
      setShowTooltip(false)
    }, 200)
  }

  return (
    <div
      className='relative inline-block'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type='button'
        onClick={handleLastQuestionClick}
        disabled={history.length === 0}
        className={
          history.length === 0
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer opacity-100'
        }
      >
        上次提问
        {' '}
        {history.length > 0 && `(${history.length})`}
      </button>

      {showTooltip && (
        <HistoryTooltip
          history={history}
          onQuestionClick={onQuestionClick}
        />
      )}
    </div>
  )
}

export default LastQuestionButton
