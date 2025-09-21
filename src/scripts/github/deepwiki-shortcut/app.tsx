import useCreateUis from '@/hooks/ui'

export default function App() {
  useCreateUis('nav context-region-crumb:nth-of-type(2)', async (element) => {
    return createShadowRootUi({
      name: 'deepwiki-shortcut-item',
      position: 'inline',
      anchor: element as HTMLAnchorElement,
      onMount: (container, shadowRoot, shadowHost) => {
        shadowHost.style.display = 'inline-block'
        return reactRenderInShadowRoot(
          { uiContainer: container, shadow: shadowRoot, shadowHost },
          <button
            type='button'
            className={`
              ml-2 inline-flex cursor-pointer items-center gap-1 rounded-md
              border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium
              transition-all duration-200
              hover:border-blue-300 hover:bg-blue-50
              focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
              focus:outline-none
              active:scale-95 active:transform active:bg-blue-100
            `}
            onClick={() => {
              window.open(`https://www.deepwiki.com/${location.pathname}`, '_blank')
            }}
            title='在 DeepWiki 中查看此页面'
          >
            <span className={`
              bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800
              bg-clip-text font-semibold text-transparent
            `}
            >
              DeepWiki
            </span>
            <span className='i-bx--brain size-4 text-blue-600' />
          </button>,
        )
      },
    })
  })

  // 不直接渲染任何 DOM
  return null
}
