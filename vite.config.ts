import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import autoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import monkey, { cdn, util } from 'vite-plugin-monkey'

import type { Plugin } from 'vite'

// 带 import attributes / 文件扩展名，否则 Vite 8 的 native config loader 会警告
// （它将在未来的大版本里成为默认）
import { description, name } from './package.json' with { type: 'json' }
import { getScriptInfos, printScriptInfos } from './scripts/script-infos.ts'

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const scriptInfos = await getScriptInfos()
  const allMatches = scriptInfos.flatMap((script) => {
    if ('matches' in script) {
      return script.matches
    }
    return []
  })
  const allIncludes = scriptInfos.flatMap((script) => {
    if ('includes' in script) {
      return script.includes
    }
    return []
  })

  printScriptInfos(scriptInfos)

  return {
    // Vite 8 起原生支持 tsconfig 的 paths 解析，不再需要 vite-tsconfig-paths 插件
    resolve: { tsconfigPaths: true },
    plugins: [
      autoImport({
        imports: [
          'react',
          util.unimportPreset,
          {
            'tagged-classnames-free': ['cls', 'tw'],
          },
          {
            '@/helpers/ui/integrated': ['createIntegratedUi'],
            '@/helpers/ui/shadow-root': ['createShadowRootUi'],
            '@/helpers/react/shadow-root-helpers': ['reactRenderInShadowRoot'],
          },
          {
            from: '@/helpers/ui/shadow-root.ts',
            imports: ['ShadowRootUi'],
            type: true,
          },
        ],
      }),
      react(),
      tailwindcss(),
      monkey({
        entry: 'src/main.ts',
        userscript: {
          name,
          description,
          icon: 'https://vitejs.dev/logo.svg',
          namespace: 'yuns',
          match: allMatches,
          include: allIncludes,
          grant: ['unsafeWindow'],
          noframes: true,
          require: [
            // antd 的 UMD 产物把 dayjs 外部化了，缺了它 antd 一加载就抛
            // `Cannot read properties of undefined (reading 'extend')`，整个脚本随之失效。
            // 走 `require` 而不是 `externalGlobals`：源码里并不 import dayjs，
            // 没有可供外部化的模块，只能直接声明依赖。
            'https://cdn.jsdelivr.net/npm/dayjs@1.11.19/dayjs.min.js',
          ],
          license: 'MIT',
        },
        build: {
          externalGlobals: {
            'react': [
              'React',
              (version: string, name: string, importName: string) => {
                return `https://cdn.jsdelivr.net/npm/react-umd@${version}/dist/react.umd.min.js`
              },
              // ref: https://github.com/ant-design/ant-design/issues/55889#issuecomment-3734211882
              'data:application/javascript,window.React&&(window.React.default=window.React);',
            ],
            'react-dom': [
              'ReactDOM',
              (version: string, name: string, importName: string) => {
                return `https://cdn.jsdelivr.net/npm/react-umd@${version}/dist/react-dom.umd.min.js`
              },
              // antd 的产物里有且仅有一处这样取根渲染 API（rc-util 的 React root）：
              //
              //   var e = t(6003) /* 外部依赖 react-dom */, q = e.createRoot; e.hydrateRoot
              //
              // React 18 时 `react-dom` 上确实有 `createRoot`，React 19 把它挪进了
              // `react-dom/client`，于是 `q` 是 undefined。任何带 Wave（点击涟漪）的 antd
              // 组件——例如 Button、Switch——点一下就抛 `TypeError: q is not a function`。
              // 两个都要补：上面那行代码把 hydrateRoot 也读了。
              'data:application/javascript,window.ReactDOM%26%26window.ReactDOMClient%26%26(window.ReactDOM.createRoot%3Dwindow.ReactDOMClient.createRoot%2Cwindow.ReactDOM.hydrateRoot%3Dwindow.ReactDOMClient.hydrateRoot)%3B',
            ],
            'react-dom/client': [
              'ReactDOMClient',
              (version: string, name: string, importName: string) => {
                return `https://cdn.jsdelivr.net/npm/react-umd@${version}/dist/react-dom-client.umd.min.js`
              },
            ],
            '@ant-design/cssinjs': cdn.jsdelivr(
              'antdCssinjs',
              'dist/umd/cssinjs.min.js',
            ),
            'antd': cdn.jsdelivr(
              'antd',
              'dist/antd.min.js',
            ),
          },
        },
      }),
      // ref: https://github.com/lisonge/vite-plugin-monkey/issues/156
      {
        name: 'replace-unsafeWindow',
        apply: 'build',
        transform(code, id) {
          if (id.includes('@monaco-editor/loader/lib/es/loader/index.js')) {
            return `import {unsafeWindow as window} from '$';\n${code}`
          }
        },
      } satisfies Plugin,
    ],
  }
})
