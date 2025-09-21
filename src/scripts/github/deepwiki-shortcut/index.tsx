import { reactRenderInShadowRoot } from '@/helpers/react/shadow-root-helpers'
import { createShadowRootUi } from '@/helpers/ui/shadow-root'

const Script: Userscript = async () => {
  const ui = await createShadowRootUi(
    {
      name: 'deepwiki-shortcut',
      position: 'inline',
      onMount: (container, shadowRoot, shadowHost) => {
        return reactRenderInShadowRoot(
          { uiContainer: container, shadow: shadowRoot, shadowHost },
          () => import('./app'),
        )
      },
    },
  )

  ui.autoMount({
    once: false,
  })
}

Script.displayName = 'deepwiki-shortcut'
Script.matches = ['https://github.com/*/*']

export default Script
