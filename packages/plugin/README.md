# storybook-tabs

> Docusaurus-style `<Tabs>` for Storybook MDX

Drop-in compatible with the [Docusaurus Tabs API](https://docusaurus.io/docs/markdown-features/tabs)
so documentation can be shared between both platforms with minimal changes.

## Installation

```bash
npm install storybook-tabs
# or
yarn add storybook-tabs
# or
pnpm add storybook-tabs
```

## Usage in MDX

Import the two components at the top of your `.mdx` file and use them anywhere in the document body:

```mdx
import { Tabs, TabItem } from 'storybook-tabs';

<Tabs>
  <TabItem value="npm" label="npm">
    ```bash
    npm install my-package
    ```
  </TabItem>
  <TabItem value="yarn" label="Yarn">
    ```bash
    yarn add my-package
    ```
  </TabItem>
  <TabItem value="pnpm" label="pnpm">
    ```bash
    pnpm add my-package
    ```
  </TabItem>
</Tabs>
```

No configuration needed — styles are injected automatically.

---

## Features

| Feature | Notes |
|---------|-------|
| **Docusaurus-compatible API** | Same `Tabs` / `TabItem` props |
| **Group sync** | `groupId` syncs all matching `Tabs` on the page via a `CustomEvent` and `sessionStorage` |
| **URL persistence** | `queryString` prop reflects the selected tab in the URL |
| **Lazy rendering** | `lazy` prop skips rendering inactive tab panels |
| **Keyboard navigation** | ← → Home End keys, proper `role="tablist"` / `role="tab"` / `role="tabpanel"` |
| **Auto dark mode** | Respects `prefers-color-scheme: dark` and `[data-theme="dark"]` |
| **Zero runtime deps** | Only `react` and `react-dom` peers |

---

## API Reference

### `<Tabs>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `string` | First tab | Value of the initially selected tab |
| `groupId` | `string` | — | Sync multiple instances; persists to `sessionStorage` |
| `queryString` | `boolean \| string` | `false` | Reflect selection in the URL query string. Pass a string to set a custom param name |
| `lazy` | `boolean` | `false` | Only render the active tab's content |
| `className` | `string` | — | Extra class for the wrapper `<div>` |

### `<TabItem>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | *(required)* | Unique identifier |
| `label` | `string` | `value` | Tab button text |
| `default` | `boolean` | `false` | Pre-select this tab |
| `hidden` | `boolean` | `false` | Hide from the tab bar |
| `attributes` | `Record<string, unknown>` | — | Extra HTML attributes for the `<button>` |

---

## Examples

### Default Tab

```mdx
<Tabs defaultValue="orange">
  <TabItem value="apple" label="Apple">🍎</TabItem>
  <TabItem value="orange" label="Orange">🍊</TabItem>
  <TabItem value="banana" label="Banana">🍌</TabItem>
</Tabs>
```

### Synced Groups

All `<Tabs>` with the same `groupId` stay in sync. Switching one switches all — even across
different MDX files as long as they share the same Storybook page.

```mdx
<Tabs groupId="os">
  <TabItem value="mac" label="macOS">…</TabItem>
  <TabItem value="win" label="Windows">…</TabItem>
  <TabItem value="linux" label="Linux">…</TabItem>
</Tabs>

Further down the page…

<Tabs groupId="os">
  <TabItem value="mac" label="macOS">…</TabItem>
  <TabItem value="win" label="Windows">…</TabItem>
  <TabItem value="linux" label="Linux">…</TabItem>
</Tabs>
```

### URL Query String

```mdx
{/* Selected tab is stored as ?tab=<value> in the URL */}
<Tabs queryString>
  <TabItem value="npm" label="npm">…</TabItem>
  <TabItem value="yarn" label="Yarn">…</TabItem>
</Tabs>

{/* Custom query parameter name */}
<Tabs queryString="pkg">
  <TabItem value="npm" label="npm">…</TabItem>
  <TabItem value="yarn" label="Yarn">…</TabItem>
</Tabs>
```

### Lazy Rendering

```mdx
<Tabs lazy>
  <TabItem value="a" label="A">Only mounted when active</TabItem>
  <TabItem value="b" label="B">Unmounted when not active</TabItem>
</Tabs>
```

---

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `←` / `→` | Move focus between tabs |
| `Home` | Focus first tab |
| `End` | Focus last tab |
| `Enter` / `Space` | Select focused tab |

---

## License

[MPL-2.0](../../LICENSE)
