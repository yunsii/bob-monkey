import { reactRenderInShadowRoot } from '@/helpers/react/shadow-root-helpers'
import { createShadowRootUi } from '@/helpers/ui/shadow-root'
import useCreateUis from '@/hooks/ui'

import { isRepoPage } from '../_helpers/repo'
import LastQuestionButton from './components/last-question-button'

export default function App() {
  useCreateUis('textarea', async (element) => {
    if (!isRepoPage()) {
      return
    }

    if (!(element instanceof HTMLTextAreaElement)) {
      return
    }

    const closestForm = element.closest('form')
    if (!closestForm) {
      console.debug('deepwiki-ask-helpers: cannot find closest form for textarea', element)
      return
    }
    const toolbarFirstButton = closestForm.querySelector('button')
    if (!toolbarFirstButton) {
      console.debug('deepwiki-ask-helpers: textarea is not the first button in the toolbar', element)
      return
    }
    return createShadowRootUi({
      name: 'deepwiki-ask-helpers-last-question-button',
      position: 'inline',
      append: 'after',
      anchor: toolbarFirstButton,
      onMount: (container, shadowRoot, shadowHost) => {
        shadowHost.style.display = 'inline-block'

        return reactRenderInShadowRoot(
          { uiContainer: container, shadow: shadowRoot, shadowHost },
          <LastQuestionButton element={element} />,
        )
      },
    })
  })

  return null
}
