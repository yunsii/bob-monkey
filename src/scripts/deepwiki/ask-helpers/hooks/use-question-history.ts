import { useEffect, useState } from 'react'

import { setTextareaValue } from '@/helpers/form-utils'

import { getAskHistory, getLastQuestion, pushToAskHistory } from '../helpers/cache'

export function useQuestionHistory(element: HTMLTextAreaElement) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // 动态获取历史记录
  const history = getAskHistory()

  // 触发刷新的函数
  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  // 监听键盘事件，保存问题到缓存
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLTextAreaElement
      const question = target.value.trim()

      // 检查是否按下了回车键或 Ctrl+回车
      if (event.key === 'Enter' && question) {
        // 如果是 Ctrl+回车，立即保存并提交
        if (event.ctrlKey || event.metaKey) {
          pushToAskHistory(question)
          triggerRefresh() // 触发组件刷新
          console.debug('deepwiki-ask-helpers: question saved to cache (Ctrl+Enter)', question)
        } else {
          // 如果是单独的回车键，也保存到缓存
          pushToAskHistory(question)
          triggerRefresh() // 触发组件刷新
          console.debug('deepwiki-ask-helpers: question saved to cache (Enter)', question)
        }
      }
    }

    element.addEventListener('keydown', handleKeydown)

    return () => {
      element.removeEventListener('keydown', handleKeydown)
    }
  }, [element])

  // 点击上次提问按钮
  const handleLastQuestionClick = () => {
    // 如果没有历史记录，直接返回
    if (history.length === 0) {
      return
    }

    const lastQuestion = getLastQuestion()
    if (lastQuestion) {
      // 使用简化的 execCommand 策略
      setTextareaValue(element, lastQuestion)
    } else {
      console.warn('deepwiki-ask-helpers: no previous question found')
    }
  }

  // 点击历史问题项
  const handleQuestionClick = (question: string) => {
    setTextareaValue(element, question, { debug: true })
  }

  return {
    history,
    handleLastQuestionClick,
    handleQuestionClick,
  }
}
