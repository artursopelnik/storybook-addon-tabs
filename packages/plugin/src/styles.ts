export const CSS = `
.storybook-tabs {
  margin-bottom: 1.5rem;
}

.storybook-tabs__list {
  display: flex;
  align-items: flex-end;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0;
  margin: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  gap: 0;
}

.storybook-tabs__tab {
  -webkit-appearance: none;
  appearance: none;
  border: none;
  border-bottom: 2px solid transparent;
  background: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  color: #444950;
  margin-bottom: -1px;
  transition:
    color 150ms ease,
    border-color 150ms ease,
    background 150ms ease;
  white-space: nowrap;
  border-radius: 4px 4px 0 0;
  text-decoration: none;
  font-family: inherit;
}

.storybook-tabs__tab:hover {
  color: #1c1e21;
  background: rgba(0, 0, 0, 0.05);
}

.storybook-tabs__tab:focus {
  outline: none;
}

.storybook-tabs__tab:focus-visible {
  outline: 2px solid #1877f2;
  outline-offset: 2px;
}

.storybook-tabs__tab--selected {
  color: #1877f2;
  border-bottom-color: #1877f2;
}

.storybook-tabs__content {
  padding: 12px 0;
}

.storybook-tabs__panel[hidden] {
  display: none !important;
}

.storybook-tabs__panel--active {
  display: block;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .storybook-tabs__list {
    border-bottom-color: rgba(255, 255, 255, 0.15);
  }

  .storybook-tabs__tab {
    color: #b8bfc7;
  }

  .storybook-tabs__tab:hover {
    color: #e3e3e3;
    background: rgba(255, 255, 255, 0.08);
  }

  .storybook-tabs__tab--selected {
    color: #4dabf7;
    border-bottom-color: #4dabf7;
  }
}

/* Storybook dark theme class-based override */
.sb-show-main.sb-main-padded .storybook-tabs__list,
[data-theme="dark"] .storybook-tabs__list,
.dark .storybook-tabs__list {
  border-bottom-color: rgba(255, 255, 255, 0.15);
}

[data-theme="dark"] .storybook-tabs__tab,
.dark .storybook-tabs__tab {
  color: #b8bfc7;
}

[data-theme="dark"] .storybook-tabs__tab:hover,
.dark .storybook-tabs__tab:hover {
  color: #e3e3e3;
  background: rgba(255, 255, 255, 0.08);
}

[data-theme="dark"] .storybook-tabs__tab--selected,
.dark .storybook-tabs__tab--selected {
  color: #4dabf7;
  border-bottom-color: #4dabf7;
}
`;

/**
 * Injects the storybook-tabs CSS into the document head.
 * Safe to call multiple times — subsequent calls are no-ops.
 */
export function injectStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.querySelector('[data-storybook-tabs-styles]')) return;
  const style = document.createElement('style');
  style.setAttribute('data-storybook-tabs-styles', '');
  style.textContent = CSS;
  document.head.appendChild(style);
}

// Auto-inject when this module is loaded in a browser context
injectStyles();
