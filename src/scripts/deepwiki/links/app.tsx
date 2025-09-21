import useCreateUis, { useShadowModal } from '@/hooks/ui'

import { HistoryPanel } from './components/history-panel'
import { pushToHistory } from './helpers/cache'

export default function App() {
  const { toggleModal: toggleEditorModal } = useShadowModal({
    name: 'deepwiki-history-modal',
    content: (
      <HistoryPanel />
    ),
  })

  useCreateUis('button[aria-label="Switch to dark mode"]', async (element) => {
    pushToHistory()

    return createShadowRootUi({
      name: 'deepwiki-shortcut-item',
      position: 'inline',
      append: 'after',
      anchor: element as HTMLAnchorElement,
      onMount: (container, shadowRoot, shadowHost) => {
        shadowHost.style.display = 'inline-block'
        return reactRenderInShadowRoot(
          { uiContainer: container, shadow: shadowRoot, shadowHost },
          <button
            type='button'
            className={`
              flex size-8 cursor-pointer items-center justify-center rounded
              hover:bg-gray-200
            `}
            onClick={() => {
              toggleEditorModal()
            }}
            title='浏览记录'
          >
            <span className='i-bx--history size-6' />
          </button>,
        )
      },
    })
  })

  return null
}
