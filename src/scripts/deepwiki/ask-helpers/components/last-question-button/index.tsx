import { Button, Popover, Typography } from 'antd'
import React, { useState } from 'react'

import { useQuestionHistory } from '../../hooks/use-question-history'
import HistoryContent from '../history-content'

const { Title } = Typography

export interface LastQuestionButtonProps {
  element: HTMLTextAreaElement
}

function LastQuestionButton(props: LastQuestionButtonProps) {
  const { element } = props
  const [open, setOpen] = useState(false)

  const { history, handleLastQuestionClick, handleQuestionClick } = useQuestionHistory(element)

  const onQuestionClick = (question: string) => {
    handleQuestionClick(question)
    setOpen(false)
  }

  const handleClick = () => {
    if (history.length > 0) {
      setOpen(true)
    } else {
      handleLastQuestionClick()
    }
  }

  return (
    <Popover
      content={(
        <HistoryContent
          history={history}
          onQuestionClick={onQuestionClick}
        />
      )}
      title={
        history.length > 0
          ? (
              <Title level={5} style={{ margin: 0 }}>
                历史问题
                {' '}
                <Typography.Text type='secondary' style={{ fontSize: 14 }}>
                  (
                  {history.length}
                  /5)
                </Typography.Text>
              </Title>
            )
          : undefined
      }
      open={open}
      onOpenChange={setOpen}
      placement='topLeft'
    >
      <Button
        type='text'
        onClick={handleClick}
        disabled={history.length === 0}
      >
        上次提问
        {' '}
        {history.length > 0 && `(${history.length})`}
      </Button>
    </Popover>
  )
}

export default LastQuestionButton
