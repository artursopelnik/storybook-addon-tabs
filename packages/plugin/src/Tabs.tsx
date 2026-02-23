import {
  useState,
  useEffect,
  useCallback,
  Children,
  isValidElement,
  type ReactNode,
} from 'react';
import { TabItem, type TabItemProps } from './TabItem';
import { injectStyles } from './styles';

/** Custom event name used for same-page group synchronisation */
const GROUP_CHANGE_EVENT = 'storybook-tabs:group-change';

/** sessionStorage key prefix for persisting group selection */
const STORAGE_KEY_PREFIX = 'storybook-tabs:group:';

interface GroupChangeDetail {
  groupId: string;
  value: string;
}

export interface TabsProps {
  /**
   * The value of the tab that is selected by default.
   * If omitted, the first tab (or the one with `default` prop) is used.
   */
  defaultValue?: string;
  /**
   * Syncs all Tabs sharing the same groupId — selecting a tab in one
   * instance selects it in all others on the page (and persists to
   * sessionStorage so it survives page navigations).
   */
  groupId?: string;
  /**
   * When true (or a string), the selected tab value is reflected in the
   * URL query string so that links can deep-link to a specific tab.
   * Pass a string to customise the query-parameter name
   * (defaults to the groupId, or "tab" when no groupId is set).
   */
  queryString?: boolean | string;
  /**
   * Only render the content of the active tab. Hidden tabs are unmounted
   * until selected. Useful when tab content is expensive to render.
   */
  lazy?: boolean;
  /** Additional class names for the wrapper element. */
  className?: string;
  /** One or more TabItem elements. */
  children: ReactNode;
}

function getTabItems(children: ReactNode) {
  return Children.toArray(children).filter(
    (child): child is React.ReactElement<TabItemProps> =>
      isValidElement(child) && (child as React.ReactElement).type === TabItem,
  );
}

function readQueryParam(paramName: string): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(paramName);
}

function writeQueryParam(paramName: string, value: string): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.set(paramName, value);
  window.history.replaceState(null, '', url.toString());
}

/**
 * Tabs container — mirrors the Docusaurus `<Tabs>` API so that docs
 * written for Docusaurus MDX can be used in Storybook with minimal changes.
 *
 * @example Basic usage
 * ```mdx
 * import { Tabs, TabItem } from 'storybook-tabs';
 *
 * <Tabs>
 *   <TabItem value="npm" label="npm">
 *     ```bash
 *     npm install my-package
 *     ```
 *   </TabItem>
 *   <TabItem value="yarn" label="Yarn">
 *     ```bash
 *     yarn add my-package
 *     ```
 *   </TabItem>
 * </Tabs>
 * ```
 *
 * @example Synced tab groups
 * ```mdx
 * <Tabs groupId="package-manager">
 *   <TabItem value="npm" label="npm">…</TabItem>
 *   <TabItem value="yarn" label="Yarn">…</TabItem>
 * </Tabs>
 *
 * <Tabs groupId="package-manager">
 *   <TabItem value="npm" label="npm">…</TabItem>
 *   <TabItem value="yarn" label="Yarn">…</TabItem>
 * </Tabs>
 * ```
 */
export function Tabs({
  defaultValue,
  groupId,
  queryString = false,
  lazy = false,
  className = '',
  children,
}: TabsProps) {
  // Ensure styles are present (safe to call multiple times)
  injectStyles();

  const tabItems = getTabItems(children);

  const resolveInitialValue = (): string => {
    // 1. URL query string (highest precedence)
    if (queryString) {
      const paramName =
        typeof queryString === 'string' ? queryString : (groupId ?? 'tab');
      const urlValue = readQueryParam(paramName);
      if (urlValue && tabItems.some((c) => c.props.value === urlValue)) {
        return urlValue;
      }
    }

    // 2. sessionStorage (group persistence)
    if (groupId && typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(`${STORAGE_KEY_PREFIX}${groupId}`);
      if (stored && tabItems.some((c) => c.props.value === stored)) {
        return stored;
      }
    }

    // 3. Explicit defaultValue prop
    if (defaultValue && tabItems.some((c) => c.props.value === defaultValue)) {
      return defaultValue;
    }

    // 4. TabItem with default prop
    const markedDefault = tabItems.find((c) => c.props.default);
    if (markedDefault) return markedDefault.props.value;

    // 5. First tab
    return tabItems[0]?.props.value ?? '';
  };

  const [selectedValue, setSelectedValue] = useState<string>(resolveInitialValue);

  // Listen for group-change events from sibling Tabs instances
  useEffect(() => {
    if (!groupId) return;

    const handler = (e: Event) => {
      const { detail } = e as CustomEvent<GroupChangeDetail>;
      if (detail.groupId === groupId) {
        setSelectedValue(detail.value);
      }
    };

    window.addEventListener(GROUP_CHANGE_EVENT, handler);
    return () => window.removeEventListener(GROUP_CHANGE_EVENT, handler);
  }, [groupId]);

  const handleSelect = useCallback(
    (value: string) => {
      setSelectedValue(value);

      if (groupId) {
        sessionStorage.setItem(`${STORAGE_KEY_PREFIX}${groupId}`, value);
        window.dispatchEvent(
          new CustomEvent<GroupChangeDetail>(GROUP_CHANGE_EVENT, {
            detail: { groupId, value },
          }),
        );
      }

      if (queryString) {
        const paramName =
          typeof queryString === 'string' ? queryString : (groupId ?? 'tab');
        writeQueryParam(paramName, value);
      }
    },
    [groupId, queryString],
  );

  // Allow keyboard navigation between tabs (← →)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      const visibleItems = tabItems.filter((c) => !c.props.hidden);
      let nextIndex: number | null = null;

      if (e.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % visibleItems.length;
      } else if (e.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = visibleItems.length - 1;
      }

      if (nextIndex !== null) {
        e.preventDefault();
        handleSelect(visibleItems[nextIndex].props.value);
      }
    },
    [tabItems, handleSelect],
  );

  const visibleItems = tabItems.filter((c) => !c.props.hidden);

  return (
    <div
      className={`storybook-tabs${className ? ` ${className}` : ''}`}
      data-group-id={groupId}
    >
      <div className="storybook-tabs__list" role="tablist" aria-orientation="horizontal">
        {visibleItems.map((child, index) => {
          const { value, label, attributes } = child.props;
          const isSelected = value === selectedValue;
          const { className: attrClassName, ...restAttributes } = (attributes ?? {}) as {
            className?: string;
            [key: string]: unknown;
          };

          return (
            <button
              key={value}
              id={`storybook-tabs-tab-${groupId ?? 'default'}-${value}`}
              role="tab"
              tabIndex={isSelected ? 0 : -1}
              aria-selected={isSelected}
              aria-controls={`storybook-tabs-panel-${groupId ?? 'default'}-${value}`}
              className={`storybook-tabs__tab${isSelected ? ' storybook-tabs__tab--selected' : ''}${attrClassName ? ` ${attrClassName}` : ''}`}
              onClick={() => handleSelect(value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              {...(restAttributes as React.ButtonHTMLAttributes<HTMLButtonElement>)}
            >
              {label ?? value}
            </button>
          );
        })}
      </div>

      <div className="storybook-tabs__content">
        {lazy
          ? tabItems.map((child) =>
              child.props.value === selectedValue ? (
                <div
                  key={child.props.value}
                  id={`storybook-tabs-panel-${groupId ?? 'default'}-${child.props.value}`}
                  role="tabpanel"
                  aria-labelledby={`storybook-tabs-tab-${groupId ?? 'default'}-${child.props.value}`}
                  className="storybook-tabs__panel storybook-tabs__panel--active"
                >
                  {child.props.children}
                </div>
              ) : null,
            )
          : tabItems.map((child) => {
              const isActive = child.props.value === selectedValue;
              return (
                <div
                  key={child.props.value}
                  id={`storybook-tabs-panel-${groupId ?? 'default'}-${child.props.value}`}
                  role="tabpanel"
                  aria-labelledby={`storybook-tabs-tab-${groupId ?? 'default'}-${child.props.value}`}
                  className={`storybook-tabs__panel${isActive ? ' storybook-tabs__panel--active' : ''}`}
                  hidden={!isActive}
                >
                  {child.props.children}
                </div>
              );
            })}
      </div>
    </div>
  );
}
