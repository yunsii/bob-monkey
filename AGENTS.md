# AGENTS.md

个人用户脚本仓库：React 19 + Tailwind v4 + antd + vite-plugin-monkey，产物是单个
`dist/bob-monkey.user.js`。每个功能是 `src/scripts/<站点>/<功能>/index.tsx` 下的一个脚本，
运行时按当前 URL 决定执行哪些。命令与依赖见 `package.json`，架构细节见
[.github/copilot-instructions.md](.github/copilot-instructions.md)，此处不重复。

模板来自 [starter-monkey](https://github.com/yunsii/starter-monkey)，见下面「上游同步」。

## 会反复踩的坑

都是实测踩过的，不知道就会得出相反结论。

### `tailwind-config.css` 首行的 `@layer` 声明不能删

`@layer theme, base, antd, components, utilities;` 是 antd 官方给 Tailwind v4 的集成写法。
它看起来像孤立的多余一行，删掉之后 Tailwind 的工具类就覆盖不了 antd 默认样式，而且**不报任何错**。

只开 `<StyleProvider layer>` 是不够的：那只把 antd 样式装进 `@layer antd`，不声明这个 layer
与 Tailwind 各层的先后。顺序只由「谁先在这个 shadow tree 里出现」决定，而 Tailwind 的样式先
插入 —— antd 于是排到 `utilities` 之后、拿到更高优先级。两者缺一不可。

完整推导和实测数据在那个文件的注释里。

### 验证样式覆盖关系必须等过渡结束再读

antd 组件带 `transition: .2s`，而 **transition 声明在 CSS 级联里高于 `!important`**。
切换 class 之后立刻读 computed 值，拿到的是过渡的**起始值**，于是每次尝试都显示「没生效」——
连 inline `!important` 都像失效了，很容易一路怀疑到 layer 顺序、缓存、甚至构建产物上去。

改完等 300~500ms 再读：

```js
btn.classList.add('p-0')
await new Promise((r) => setTimeout(r, 500))
getComputedStyle(btn).paddingLeft // 这时才是真实结果
```

### 浏览器里有同名脚本时，断言会读到旧产物

dev 版与构建版（`@name` 带 `(local build)`）`@match` 相同、挂的自定义元素名也相同。两份同时
注入时 `document.querySelector('<host>')` 命中的是**先挂上的那一个**。症状是代码改了、
重装也刷新了，断言值却一动不动，看起来像 HMR 坏了或改动没编译进去。

开工前先确认只有一份是启用的（用下面「验证」里的 `list` / `toggle`）。

### 脚本的注入范围写在源码里，不在 `vite.config.ts`

`scripts/script-infos.ts` 用 TypeScript AST **静态解析**（不执行）每个脚本的
`Script.displayName` 和 `Script.matches` / `Script.includes`，再由 `vite.config.ts` 注入
userscript 元数据。因此：

- 脚本路径必须是两级 `src/scripts/*/*/index.tsx`，否则 glob 扫不到。
- 这些属性的右值必须是**字面量**。引用常量、展开、拼接都会让构建抛
  `UserscriptConfig not found in source code`。
- 要改注入范围就改脚本源码，不要去 `vite.config.ts` 里手写 `match`。

### 不要手改 `auto-imports.d.ts`

由 unplugin-auto-import 生成。`createShadowRootUi` / `createIntegratedUi` /
`reactRenderInShadowRoot` / `cls` / `tw` / React hooks / GM API 都是**自动导入的全局** ——
看到没有 import 的符号不要补 import，先查 `vite.config.ts` 里的 `autoImport` 配置。

## 验证

至少 `pnpm lint && pnpm typecheck`。

改到 UI 在真实页面上的行为时，`pnpm build` 通过**不算数** —— 被页面盖住、被裁剪、样式没进
shadow root、优先级被压，这些 build 一个都发现不了，必须在真实站点上断言。

上游有一套不需要真人点鼠标的浏览器循环，本仓库尚未迁移（见下），可以直接借用：

```bash
node ../starter-monkey/scripts/tampermonkey-cdp.mjs doctor          # 先查前提
node ../starter-monkey/scripts/tampermonkey-cdp.mjs list            # 确认没有同名脚本并存
pnpm dev                                                            # 另开一个终端
node ../starter-monkey/scripts/tampermonkey-cdp.mjs install http://127.0.0.1:5173
node ../starter-monkey/scripts/tampermonkey-cdp.mjs open https://deepwiki.com/facebook/react
node ../starter-monkey/scripts/tampermonkey-cdp.mjs eval deepwiki.com "..."
```

`install` 走的是 vite-plugin-monkey 的通用入口（`__vite-plugin-monkey.install.user.js`），
与项目名无关，所以上游那份工具对本仓库直接可用。前提是 Chrome 带
`--remote-debugging-port=9222` 启动且已装 Tampermonkey，`doctor` 会逐条检查。

⚠️ 那份工具的 `cleanup` 会删掉浏览器里**所有** `(local build)` 脚本，包括其他仓库留下的。
要删本仓库的用 `remove "<脚本名> (local build)"`。

## 上游同步

模板仓库：https://github.com/yunsii/starter-monkey

**当前基线：`28ceb86`**（上游「🐛 fix: monkeyFetch fallback」，本仓库框架层内容与之一致）

下次同步先看清单：

```bash
git remote add upstream git@github.com:yunsii/starter-monkey.git   # 只需一次
git fetch upstream
git log 28ceb86..upstream/master --oneline
git diff 28ceb86..upstream/master -- src/helpers src/hooks src/contexts scripts
```

两仓库**没有共同 git 历史**（本仓库是拷贝式套模板），所以 git 无法三方合并，只能按文件同步。

### 待迁移

| 批次 | 内容                                                                                               |
| ---- | -------------------------------------------------------------------------------------------------- |
| 1    | 工具链：依赖对齐上游（vite 8、vite-plugin-monkey 8、antd 6.6…），补 `ReactDOM.createRoot` 的 patch |
| 2    | 命名空间 + UI 层：新增 `helpers/namespace.ts`、`detached` 定位、document 样式引用计数、弹层容器    |
| 3    | `Script.id`：三个脚本加 id（**定了不可改**，它是配置的存储命名空间）                               |
| 4    | 配置系统：功能开关 + schema 配置面板 + 快捷键（约 1400 行）                                        |
| 5    | 验证循环与文档：`scripts/tampermonkey-cdp.mjs`、`docs/`                                            |

批 1 里那个 `ReactDOM.createRoot` / `hydrateRoot` 的 `data:` patch 对本仓库有实际价值：
现在只补了 `React.default`，缺 createRoot 那半时，antd 里带 Wave 的组件（`Button`、`Switch`）
点一下就抛 `q is not a function`。

批 2 会用上游版本覆盖 `helpers/react/shadow-root-helpers.tsx`，其中的 `React.lazy` 兜底
**可以去掉** —— 实测（deepwiki SPA 往返 + 同一 mutation 批次连续三轮重建）antd 的 CSS 变量都
完好。但那两轮测的是「变量有没有注入」，没有直接测原始现象（Popover 背景透明），所以删掉后
补一次针对现象本身的验证：SPA 往返回来真的打开 Popover，断言背景色不是透明。

### 本仓库有意偏离上游

- `src/scripts/*`、`src/helpers/form-utils.ts` —— 本仓库业务代码，上游不涉及，永不冲突。
- `package.json` 的 name / version / description。
- `src/helpers/logger.ts`、`src/helpers/ui/integrated.ts` 等处的 `bob-monkey` 字面量 ——
  上游已把它收敛到 `src/helpers/namespace.ts`，迁移后只需改那一处。
- `eslint.config.ts` 里对 `.github/copilot-instructions.md` 的 ignore。

`tailwind-config.css` 那行 `@layer` **不在**这个清单里 —— 它已经推回上游
（`🐛 fix(style): declare layer order so Tailwind can override antd`），两边一致。
