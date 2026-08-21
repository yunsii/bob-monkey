import { Button } from 'antd'

import useCreateUis from '@/hooks/ui'

const selector = '[data-testid="top-nav-center"] > nav > ol > li:nth-of-type(2)'

export default function App() {
  useEffect(() => {
    const target = document.querySelector(selector)

    if (!target) {
      console.warn('DeepWiki shortcut: target element not found')
    }
  }, [])

  useCreateUis(selector, async (element) => {
    return createShadowRootUi({
      name: 'deepwiki-shortcut-item',
      position: 'inline',
      anchor: element as HTMLAnchorElement,
      onMount: (container, shadowRoot, shadowHost) => {
        shadowHost.style.display = 'inline-block'
        return reactRenderInShadowRoot(
          { uiContainer: container, shadow: shadowRoot, shadowHost },
          <Button
            type='default'
            size='small'
            icon={(
              <span className='flex items-center justify-center'>
                <span className='i-bx--brain size-4 text-blue-600' />
              </span>
            )}
            onClick={() => {
              window.open(`https://deepwiki.com${location.pathname}`, '_blank')
            }}
            title='在 DeepWiki 中查看此页面'
          >
            <span className={`
              bg-linear-to-r from-blue-600 via-purple-600 to-blue-800
              bg-clip-text font-semibold text-transparent
            `}
            >
              DeepWiki
            </span>
          </Button>,
        )
      },
    })
  })

  return null
}
