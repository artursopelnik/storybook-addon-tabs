'use strict';

var react = require('react');
var jsxRuntime = require('react/jsx-runtime');

/* storybook-tabs — Docusaurus-style tabs for Storybook MDX */

function TabItem({ children }) {
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children });
}

// src/styles.ts
var CSS = `
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
function injectStyles() {
  if (typeof document === "undefined") return;
  if (document.querySelector("[data-storybook-tabs-styles]")) return;
  const style = document.createElement("style");
  style.setAttribute("data-storybook-tabs-styles", "");
  style.textContent = CSS;
  document.head.appendChild(style);
}
injectStyles();
var GROUP_CHANGE_EVENT = "storybook-tabs:group-change";
var STORAGE_KEY_PREFIX = "storybook-tabs:group:";
function getTabItems(children) {
  return react.Children.toArray(children).filter(
    (child) => react.isValidElement(child) && child.type === TabItem
  );
}
function readQueryParam(paramName) {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(paramName);
}
function writeQueryParam(paramName, value) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.set(paramName, value);
  window.history.replaceState(null, "", url.toString());
}
function Tabs({
  defaultValue,
  groupId,
  queryString = false,
  lazy = false,
  className = "",
  children
}) {
  injectStyles();
  const tabItems = getTabItems(children);
  const resolveInitialValue = () => {
    if (queryString) {
      const paramName = typeof queryString === "string" ? queryString : groupId ?? "tab";
      const urlValue = readQueryParam(paramName);
      if (urlValue && tabItems.some((c) => c.props.value === urlValue)) {
        return urlValue;
      }
    }
    if (groupId && typeof window !== "undefined") {
      const stored = sessionStorage.getItem(`${STORAGE_KEY_PREFIX}${groupId}`);
      if (stored && tabItems.some((c) => c.props.value === stored)) {
        return stored;
      }
    }
    if (defaultValue && tabItems.some((c) => c.props.value === defaultValue)) {
      return defaultValue;
    }
    const markedDefault = tabItems.find((c) => c.props.default);
    if (markedDefault) return markedDefault.props.value;
    return tabItems[0]?.props.value ?? "";
  };
  const [selectedValue, setSelectedValue] = react.useState(resolveInitialValue);
  react.useEffect(() => {
    if (!groupId) return;
    const handler = (e) => {
      const { detail } = e;
      if (detail.groupId === groupId) {
        setSelectedValue(detail.value);
      }
    };
    window.addEventListener(GROUP_CHANGE_EVENT, handler);
    return () => window.removeEventListener(GROUP_CHANGE_EVENT, handler);
  }, [groupId]);
  const handleSelect = react.useCallback(
    (value) => {
      setSelectedValue(value);
      if (groupId) {
        sessionStorage.setItem(`${STORAGE_KEY_PREFIX}${groupId}`, value);
        window.dispatchEvent(
          new CustomEvent(GROUP_CHANGE_EVENT, {
            detail: { groupId, value }
          })
        );
      }
      if (queryString) {
        const paramName = typeof queryString === "string" ? queryString : groupId ?? "tab";
        writeQueryParam(paramName, value);
      }
    },
    [groupId, queryString]
  );
  const handleKeyDown = react.useCallback(
    (e, currentIndex) => {
      const visibleItems2 = tabItems.filter((c) => !c.props.hidden);
      let nextIndex = null;
      if (e.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % visibleItems2.length;
      } else if (e.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + visibleItems2.length) % visibleItems2.length;
      } else if (e.key === "Home") {
        nextIndex = 0;
      } else if (e.key === "End") {
        nextIndex = visibleItems2.length - 1;
      }
      if (nextIndex !== null) {
        e.preventDefault();
        handleSelect(visibleItems2[nextIndex].props.value);
      }
    },
    [tabItems, handleSelect]
  );
  const visibleItems = tabItems.filter((c) => !c.props.hidden);
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: `storybook-tabs${className ? ` ${className}` : ""}`,
      "data-group-id": groupId,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "storybook-tabs__list", role: "tablist", "aria-orientation": "horizontal", children: visibleItems.map((child, index) => {
          const { value, label, attributes } = child.props;
          const isSelected = value === selectedValue;
          const { className: attrClassName, ...restAttributes } = attributes ?? {};
          return /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              id: `storybook-tabs-tab-${groupId ?? "default"}-${value}`,
              role: "tab",
              tabIndex: isSelected ? 0 : -1,
              "aria-selected": isSelected,
              "aria-controls": `storybook-tabs-panel-${groupId ?? "default"}-${value}`,
              className: `storybook-tabs__tab${isSelected ? " storybook-tabs__tab--selected" : ""}${attrClassName ? ` ${attrClassName}` : ""}`,
              onClick: () => handleSelect(value),
              onKeyDown: (e) => handleKeyDown(e, index),
              ...restAttributes,
              children: label ?? value
            },
            value
          );
        }) }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "storybook-tabs__content", children: lazy ? tabItems.map(
          (child) => child.props.value === selectedValue ? /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              id: `storybook-tabs-panel-${groupId ?? "default"}-${child.props.value}`,
              role: "tabpanel",
              "aria-labelledby": `storybook-tabs-tab-${groupId ?? "default"}-${child.props.value}`,
              className: "storybook-tabs__panel storybook-tabs__panel--active",
              children: child.props.children
            },
            child.props.value
          ) : null
        ) : tabItems.map((child) => {
          const isActive = child.props.value === selectedValue;
          return /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              id: `storybook-tabs-panel-${groupId ?? "default"}-${child.props.value}`,
              role: "tabpanel",
              "aria-labelledby": `storybook-tabs-tab-${groupId ?? "default"}-${child.props.value}`,
              className: `storybook-tabs__panel${isActive ? " storybook-tabs__panel--active" : ""}`,
              hidden: !isActive,
              children: child.props.children
            },
            child.props.value
          );
        }) })
      ]
    }
  );
}

exports.TabItem = TabItem;
exports.Tabs = Tabs;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map