import { Tag, Typography } from 'antd'

const { Text } = Typography

interface HistoryTagProps {
  path: string
  onRemove: (path: string) => void
}

export function HistoryTag({ path, onRemove }: HistoryTagProps) {
  const [owner, repo] = path.slice(1).split('/')

  return (
    <Tag
      closable
      onClose={(e) => {
        e.preventDefault()
        onRemove(path)
      }}
      color='blue'
      className={`
        m-0 origin-center transform cursor-pointer rounded-full px-3 py-1.5
        shadow-sm transition-all duration-300 will-change-transform
        hover:z-10 hover:scale-110 hover:shadow-lg hover:brightness-95
      `}
      style={{ backfaceVisibility: 'hidden', perspective: 1000 }}
    >
      <a
        href={`https://deepwiki.com${path}`}
        className={`
          inline-flex items-center font-mono text-xs no-underline
          transition-colors
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <Text
          type='secondary'
          className={`
            text-xs transition-colors
            group-hover:text-blue-700
          `}
        >
          {owner}
        </Text>
        <Text type='secondary' className='mx-1 text-xs'>
          /
        </Text>
        <Text strong className='text-xs transition-colors'>
          {repo}
        </Text>
      </a>
    </Tag>
  )
}
