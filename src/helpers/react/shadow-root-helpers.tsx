import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd'
import React from 'react'
import { createPortal } from 'react-dom'
import ReactDOM from 'react-dom/client'

import InlineTailwindCSS from '@/components/inline-tailwindcss'
import { MountContextProvider } from '@/contexts/mount-context'
import type { ShadowRootContentScriptUiOptions } from '@/helpers/ui/shadow-root'

// Extract the onMount function type from the existing shadow-root options type.
type OnMountFunction = ShadowRootContentScriptUiOptions<unknown>['onMount']

// Derive a mountContext type from the parameters of onMount. Fallback to DOM types.
type MountContextFromOnMount = OnMountFunction extends (...args: any[]) => any
  ? Parameters<OnMountFunction> extends [infer A, infer B, infer C]
    ? ({ uiContainer: A, shadow: B, shadowHost: C })
    : never
  : never

export function reactRenderInShadowRoot(
  mountContext: MountContextFromOnMount,
  app: (() => Promise<{ default: React.ComponentType }>) | React.ReactNode,
) {
  const { uiContainer, shadow } = mountContext

  const _app = typeof app === 'function'
    ? app
    // 发现一个诡异的问题，接入 antd 后，直接传入 React 元素直接渲染在页面单页路由之后返回原来的页面，
    // 会导致 antd .css-var-root 对应的 CSS 主题变量未挂载，进而导致样式错乱，比如当前碰到的是 Popover
    // 背景色透明了，经排查，改成这样懒加载的方式就没问题了，咱不明确原因，只能先这样改了。
    : () => Promise.resolve({
        default: () => {
          return <>{app}</>
        },
      })

  const rootContext = document.createElement('div')
  rootContext.id = 'bob-monkey-root'
  uiContainer.appendChild(rootContext)
  const root = ReactDOM.createRoot(rootContext)

  const targetHead = shadow.querySelector('head')

  if (!targetHead) {
    console.error('No head element found in shadow root')
    return
  }

  const portal = createPortal(
    <>
      <InlineTailwindCSS />
    </>,
    targetHead,
  )

  root.render(
    <React.StrictMode>
      {portal}
      <MountContextProvider {...mountContext}>
        <StyleProvider container={shadow} layer>
          <ConfigProvider
            getPopupContainer={() => shadow}
            getTargetContainer={() => shadow}
          >
            {React.createElement(React.lazy(_app))}
          </ConfigProvider>
        </StyleProvider>
      </MountContextProvider>
    </React.StrictMode>,
  )

  return root
}
