import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import autoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import monkey, { cdn, util } from 'vite-plugin-monkey'
import tsconfigPaths from 'vite-tsconfig-paths'

import type { Plugin } from 'vite'

import { description, name } from './package.json'
import { getScriptInfos, printScriptInfos } from './scripts/script-infos'

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
    plugins: [
      tsconfigPaths(),
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
            // Set React.default for antd UMD compatibility
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
