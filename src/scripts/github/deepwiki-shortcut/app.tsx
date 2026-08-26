import { Button } from 'antd'

import { acquireDocumentStyle } from '@/helpers/ui/document-styles'
import useCreateUis from '@/hooks/ui'

/** 登录后的新版头部：仓库面包屑在 AppHeader 里，锚点是面包屑的第二项（仓库名那项）。 */
const MODERN_ANCHOR = '[data-testid="top-nav-center"] > nav > ol > li:nth-of-type(2)'
/** 未登录时是旧版头部，`AppHeader` 整个不存在，仓库名在这个 `strong` 里。 */
const LEGACY_ANCHOR = '#repository-container-header strong'

/**
 * 面包屑最后一项本不该画分隔符，GitHub 是这么关掉的：
 *
 *   .prc-Breadcrumbs-ItemWrapper-*::after            { border-right: …; content: "" }
 *   .prc-Breadcrumbs-ItemWrapper-*:last-child::after { content: none }
 *
 * 分隔符是 `border-right` 画的斜线。问题出在 `:last-child` —— 它数的是 `ol` 的**所有**子元素，
 * 所以只要末尾多出任何东西，最后一个面包屑项就不再是 last-child，会凭空多画一条分隔符。
 * 我们自己插在最后一项之前正是为了不制造这种情况，但挡不住别的浏览器扩展：实测 Refined
 * GitHub 会往这里追加一个显示 star 数的 `li`，此时无论我们插在哪，都有位置会翻车。
 *
 * `:last-of-type` 不够用 —— 它只按标签名数，而 Refined GitHub 追加的也是 `li`。
 * 这里用 `:has(~ …)` 直接表达 GitHub 真正的意图：**后面再没有面包屑项**的那一项不画分隔符。
 * 无论后面跟着的是我们的宿主（非 `li`）还是别人的 `li`，判断都成立。
 *
 * 实测把宿主放在 `ol` 里的五个不同位置（含完全移出），加上这条之后最后一项始终不画、
 * 前面各项照常画；不带这条时其中一个位置会多出一条。`:has()` 不被支持时整条规则会被忽略，
 * 退回浏览器原生行为，不会更糟。
 *
 * 用一条静态 CSS、而不是「JS 发现多余元素再去修正」，正是因为那个 `li` 是扩展**异步**插进来的
 * （实测同一个页面刷新几次，它时有时无）。CSS 规则对插入时机免疫，不必盯着 DOM 变化，
 * 也就不会有「插进来的那一瞬间闪一下分隔符」这种缝隙。
 */
const SEPARATOR_FIX = '[data-testid="top-nav-center"] nav ol > li[class*="Breadcrumbs-ItemWrapper"]:not(:has(~ li[class*="Breadcrumbs-ItemWrapper"]))::after { content: none !important }'

// GitHub 给登录用户和游客的是两套不同的仓库页布局，只挂其中一套就会有一半场景看不到入口。
// 未登录访问一点都不罕见：别人分享的链接、无痕窗口、退登之后。
const selector = `${MODERN_ANCHOR}, ${LEGACY_ANCHOR}`

export default function App() {
  useCreateUis(selector, async (element) => {
    const isLegacy = !!element.closest('#repository-container-header')

    // 两套布局同时出现时只认新版，否则会插出两个入口。
    if (isLegacy && document.querySelector(MODERN_ANCHOR)) {
      return
    }

    let releaseSeparatorFix: (() => void) | undefined

    return createShadowRootUi({
      name: 'deepwiki-shortcut-item',
      position: 'inline',
      anchor: element as HTMLElement,
      // 都不塞进锚点内部。旧版插在仓库名之后即可；新版要插在最后一个面包屑项
      // **之前**，靠 `order` 把它在视觉上排回后面 —— 原因见下面 onMount 里的注释。
      append: isLegacy ? 'after' : 'before',
      onMount: (container, shadowRoot, shadowHost) => {
        if (isLegacy) {
          // 旧版头部的父容器是 `d-flex flex-items-center`，垂直方向自动居中；但它没有
          // flex gap，间距靠每个元素自带的右外边距（仓库名 8px、Public 徽章 4px），
          // 宿主插在它们中间也得跟上，否则会和后面的徽章贴死。
          shadowHost.style.display = 'inline-block'
          shadowHost.style.marginRight = '8px'
        } else {
          // 新版头部的父级是面包屑的 `ol`（flex 容器）。宿主在 DOM 上排在最后一个面包屑项
          // 之前、视觉上靠 `order` 排到它之后，这样一次绕开页面的两条规则：
          //
          // - `li:has(> 仓库选择器按钮):hover` 会把整个面包屑项刷上背景色。只要宿主不在
          //   那个 `li` 内部，hover 按钮就不会连带把仓库名区域点亮。
          // - `.Breadcrumbs-module__item:not(:last-child)::after { content: "/" }` 是靠
          //   `:last-child` 判断要不要画分隔符的。宿主一旦成为 `ol` 的最后一个子元素，
          //   最后那个面包屑项就不再是 last-child，页面上会凭空多出一个 `/`。
          //   插在它前面，`:last-child` 就还归它。
          //
          // 父级是 flex，所以 `order` 生效，垂直方向用 `align-self` 就够，不必去凑
          // `vertical-align`（在 `li` 内部时试过：基线对齐低 9px，`middle` 更是低 13px，
          // 因为它对齐的是父级文本基线而不是兄弟的中心）。`ol` 没有 gap，左边距自己给。
          shadowHost.style.display = 'inline-flex'
          shadowHost.style.alignItems = 'center'
          shadowHost.style.alignSelf = 'center'
          shadowHost.style.order = '1'
          shadowHost.style.marginLeft = '8px'
          releaseSeparatorFix = acquireDocumentStyle(SEPARATOR_FIX)
        }
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
              // 只取 owner/repo。脚本在整个 `github.com/*/*` 上都会跑，而 GitHub 的子路径
              // （`/wiki`、`/issues`、`/blob/…`）在 DeepWiki 那边没有对应页面，原样带过去
              // 只会落到一个不存在的位置 —— 实测在 wiki 页点开会跳到
              // `deepwiki.com/<owner>/<repo>/wiki`。
              const [, owner, repo] = location.pathname.split('/')
              window.open(`https://deepwiki.com/${owner}/${repo}`, '_blank')
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
      onRemove: (root) => {
        root?.unmount()
        releaseSeparatorFix?.()
        releaseSeparatorFix = undefined
      },
    })
  })

  return null
}
