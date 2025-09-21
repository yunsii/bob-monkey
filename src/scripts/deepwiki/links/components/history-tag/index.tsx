interface HistoryTagProps {
  path: string
  onRemove: (path: string) => void
}

export function HistoryTag({ path, onRemove }: HistoryTagProps) {
  return (
    <a
      href={`https://deepwiki.com${path}`}
      className={`
        inline-flex transform items-center rounded-full border border-gray-200
        bg-gradient-to-r from-blue-50 to-indigo-100 px-4 py-2 text-sm
        font-medium text-gray-700 shadow-sm transition-all duration-300
        hover:scale-105 hover:border-gray-300 hover:from-blue-100
        hover:to-indigo-200 hover:shadow-md
      `}
    >
      <span className='font-mono text-xs leading-none'>
        {(() => {
          const [owner, repo] = path.slice(1).split('/')
          return (
            <>
              <span className='text-gray-500'>{owner}</span>
              <span className='mx-1 text-gray-400'>/</span>
              <span className='font-semibold text-gray-800'>{repo}</span>
            </>
          )
        })()}
      </span>
      <button
        type='button'
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onRemove(path)
        }}
        className={`
          ml-2 flex h-4 w-4 flex-shrink-0 cursor-pointer items-center
          justify-center rounded-full bg-gray-300 text-xs leading-none
          text-gray-600 transition-colors duration-200
          hover:bg-red-400 hover:text-white
        `}
        title='删除此历史记录'
      >
        <span className='i-bx--x size-3' />
      </button>
    </a>
  )
}
