# Copilot Instructions for Bob Monkey

## Communication Guidelines

**Language Usage**: Always respond in the same language as the user's message. If the user writes in Chinese, respond in Chinese. If in English, respond in English.

## Project Overview

Bob Monkey is a userscript collection built with React + TypeScript that enhances GitHub and DeepWiki experiences. It uses a **modular userscript architecture** where each feature is a separate script with declarative configuration.

## Architecture Patterns

### Userscript Module System
- Each script lives in `src/scripts/{site}/{feature}/index.tsx` with this exact pattern:
  ```tsx
  const Script: Userscript = async () => {
    const ui = await createShadowRootUi({
      name: 'feature-name',
      position: 'inline',
      onMount: (container, shadowRoot, shadowHost) => {
        return reactRenderInShadowRoot(
          { uiContainer: container, shadow: shadowRoot, shadowHost },
          () => import('./app')
        )
      }
    })
    ui.mount()
  }
  
  Script.displayName = 'feature-name'
  Script.matches = ['https://site.com/*']
  export default Script
  ```
- Build system automatically scans `src/scripts/*/*/index.tsx` and extracts `displayName` + `matches` via AST parsing (see `scripts/script-infos.ts`)

### Shadow DOM UI Architecture
- **All UI is isolated** in Shadow DOM using `@webext-core/isolated-element`
- Use `createShadowRootUi()` for DOM injection, never manipulate DOM directly
- React components render via `reactRenderInShadowRoot()` which handles:
  - Tailwind CSS injection into shadow head
  - Mount context provider for accessing shadow DOM references
  - Lazy loading of app components

### Key Injection Patterns
```tsx
// Standard UI injection hook
useCreateUis('css-selector', async (element) => {
  return createShadowRootUi({
    name: 'unique-component-name',
    position: 'inline', // or 'overlay', 'modal'
    anchor: element,
    append: 'after', // 'before', 'first', 'last', 'replace'
    onMount: (container, shadowRoot, shadowHost) => {
      shadowHost.style.display = 'inline-block' // Common pattern
      return reactRenderInShadowRoot(
        { uiContainer: container, shadow: shadowRoot, shadowHost },
        <YourComponent />
      )
    }
  })
})
```

## Development Workflow

### Build & Development
- `pnpm dev` - Development with hot reload
- `pnpm build` - Production build for userscript managers
- Script discovery is automatic - just follow the file structure
- **Code formatting**: Don't worry about code formatting issues - the project has automatic linting/formatting that will fix them

### Auto-imports Configuration
Essential imports are auto-imported via `unplugin-auto-import`:
- React hooks: `useState`, `useEffect`, etc.
- UI helpers: `createShadowRootUi`, `reactRenderInShadowRoot`, `createIntegratedUi`
- Utilities: `cls`, `tw` for classnames
- No need to import these manually

### Tailwind Integration
- Uses Tailwind v4 with `@tailwindcss/vite` plugin
- CSS is automatically injected into shadow roots via `<InlineTailwindCSS />`
- Iconify icons available as `i-{pack}-{name}` classes (e.g., `i-bx-brain`)

## Project-Specific Conventions

### Component Organization
- App entry point: `app.tsx` in each script folder
- Components: `components/` subfolder for reusable parts
- Helpers: `helpers/` subfolder for script-specific utilities
- Hooks: `hooks/` subfolder for custom React hooks

### State Management
- Local storage helpers in `src/scripts/*/helpers/cache.ts`
- Use React Query patterns for data fetching
- Keep state minimal and component-local

### Testing Patterns
- Test on target websites directly (GitHub, DeepWiki)
- Use browser dev tools to inspect shadow DOM
- Check console for automatic script loading logs

## Common Integration Points

### GitHub Integration
- Target repository pages: `https://github.com/*/*`
- Hook into navigation elements like breadcrumbs: `nav context-region-crumb`
- GitHub's DOM is dynamic - use `useCreateUis` for element watching

### DeepWiki Integration
- Target: `https://deepwiki.com/*`
- Form interactions: Look for `textarea` elements and their parent `form`
- Repository detection: Use `isRepoPage()` helper from `_helpers/repo.ts`

### External Dependencies
- Monaco Editor: Special webpack handling in `vite.config.ts` for `unsafeWindow`
- React/ReactDOM: Loaded via CDN in production builds
- Browser extension utilities: `browser-extension-url-match` for URL pattern matching

## Anti-Patterns to Avoid
- Don't manipulate DOM directly - always use shadow root UI helpers
- Don't hardcode element selectors - use semantic CSS selectors when possible
- Don't import React/ReactDOM manually - they're externalized in builds
- Don't skip the `useCreateUis` pattern for DOM element watching
- Don't forget `shadowHost.style.display` when using inline positioning
