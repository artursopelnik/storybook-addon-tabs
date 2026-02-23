import type { ReactNode } from 'react';

export interface TabItemProps {
  /** Unique identifier for this tab */
  value: string;
  /** Display label for the tab button (defaults to value) */
  label?: string;
  /** Mark this tab as selected by default */
  default?: boolean;
  /** Hide this tab from the tab list */
  hidden?: boolean;
  /** Additional HTML attributes for the tab button element */
  attributes?: Record<string, unknown>;
  /** Tab panel content */
  children?: ReactNode;
  /** Additional class name for the tab panel */
  className?: string;
}

/**
 * TabItem component for use inside Tabs.
 *
 * When rendered inside a Tabs component, the Tabs parent handles
 * display/hide logic. TabItem itself only renders its children.
 *
 * @example
 * <Tabs>
 *   <TabItem value="npm" label="npm">npm install my-package</TabItem>
 *   <TabItem value="yarn" label="Yarn">yarn add my-package</TabItem>
 * </Tabs>
 */
export function TabItem({ children }: TabItemProps) {
  return <>{children}</>;
}
