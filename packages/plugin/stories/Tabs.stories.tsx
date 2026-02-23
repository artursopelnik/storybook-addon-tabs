import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from '../src/Tabs';
import { TabItem } from '../src/TabItem';

const meta: Meta<typeof Tabs> = {
  title: 'storybook-tabs/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Docusaurus-style tabs for Storybook MDX. Drop the `<Tabs>` and `<TabItem>` components into any `.mdx` file.',
      },
    },
  },
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Value of the initially selected tab',
    },
    groupId: {
      control: 'text',
      description: 'Sync multiple Tabs instances on the same page',
    },
    lazy: {
      control: 'boolean',
      description: 'Only mount the active tab content',
    },
    queryString: {
      control: 'boolean',
      description: 'Reflect the selected tab in the URL query string',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  name: 'Basic',
  args: {},
  render: (args) => (
    <Tabs {...args}>
      <TabItem value="apple" label="Apple">
        <p>This is an apple 🍎</p>
      </TabItem>
      <TabItem value="orange" label="Orange">
        <p>This is an orange 🍊</p>
      </TabItem>
      <TabItem value="banana" label="Banana">
        <p>This is a banana 🍌</p>
      </TabItem>
    </Tabs>
  ),
};

export const WithDefaultValue: Story = {
  name: 'Default Value',
  args: {
    defaultValue: 'orange',
  },
  render: (args) => (
    <Tabs {...args}>
      <TabItem value="apple" label="Apple">
        <p>This is an apple 🍎</p>
      </TabItem>
      <TabItem value="orange" label="Orange">
        <p>This is an orange 🍊 — I'm selected by default</p>
      </TabItem>
      <TabItem value="banana" label="Banana">
        <p>This is a banana 🍌</p>
      </TabItem>
    </Tabs>
  ),
};

export const DefaultPropOnTabItem: Story = {
  name: 'Default Prop on TabItem',
  args: {},
  render: (args) => (
    <Tabs {...args}>
      <TabItem value="apple" label="Apple">
        <p>This is an apple 🍎</p>
      </TabItem>
      <TabItem value="orange" label="Orange" default>
        <p>This is an orange 🍊 — I'm selected by default via the `default` prop</p>
      </TabItem>
      <TabItem value="banana" label="Banana">
        <p>This is a banana 🍌</p>
      </TabItem>
    </Tabs>
  ),
};

export const PackageManager: Story = {
  name: 'Package Manager (Code)',
  args: {},
  render: (args) => (
    <Tabs {...args}>
      <TabItem value="npm" label="npm">
        <pre>
          <code>npm install my-package</code>
        </pre>
      </TabItem>
      <TabItem value="yarn" label="Yarn">
        <pre>
          <code>yarn add my-package</code>
        </pre>
      </TabItem>
      <TabItem value="pnpm" label="pnpm">
        <pre>
          <code>pnpm add my-package</code>
        </pre>
      </TabItem>
    </Tabs>
  ),
};

export const SyncedGroups: Story = {
  name: 'Synced Groups',
  args: {},
  render: (args) => (
    <div>
      <p>
        <strong>Install:</strong>
      </p>
      <Tabs {...args} groupId="pkg-mgr-demo">
        <TabItem value="npm" label="npm">
          <pre>
            <code>npm install my-package</code>
          </pre>
        </TabItem>
        <TabItem value="yarn" label="Yarn">
          <pre>
            <code>yarn add my-package</code>
          </pre>
        </TabItem>
        <TabItem value="pnpm" label="pnpm">
          <pre>
            <code>pnpm add my-package</code>
          </pre>
        </TabItem>
      </Tabs>

      <p>
        <strong>Run:</strong>
      </p>
      <Tabs {...args} groupId="pkg-mgr-demo">
        <TabItem value="npm" label="npm">
          <pre>
            <code>npm run dev</code>
          </pre>
        </TabItem>
        <TabItem value="yarn" label="Yarn">
          <pre>
            <code>yarn dev</code>
          </pre>
        </TabItem>
        <TabItem value="pnpm" label="pnpm">
          <pre>
            <code>pnpm dev</code>
          </pre>
        </TabItem>
      </Tabs>
      <p>
        <em>Selecting a tab in one group selects it in the other.</em>
      </p>
    </div>
  ),
};

export const LazyRendering: Story = {
  name: 'Lazy Rendering',
  args: {
    lazy: true,
  },
  render: (args) => (
    <Tabs {...args}>
      <TabItem value="first" label="First">
        <p>Mounted when active. Switch tabs and come back — this re-mounts.</p>
      </TabItem>
      <TabItem value="second" label="Second">
        <p>Also lazy — only rendered while selected.</p>
      </TabItem>
      <TabItem value="third" label="Third">
        <p>Same here.</p>
      </TabItem>
    </Tabs>
  ),
};

export const HiddenTab: Story = {
  name: 'Hidden Tab',
  args: {},
  render: (args) => (
    <Tabs {...args}>
      <TabItem value="a" label="Tab A">
        <p>Tab A is visible.</p>
      </TabItem>
      <TabItem value="b" label="Tab B" hidden>
        <p>Tab B is hidden from the tab list but its panel is still in the DOM (when not lazy).</p>
      </TabItem>
      <TabItem value="c" label="Tab C">
        <p>Tab C is visible.</p>
      </TabItem>
    </Tabs>
  ),
};

export const ManyTabs: Story = {
  name: 'Many Tabs (scrollable)',
  args: {},
  render: (args) => (
    <Tabs {...args}>
      {['JavaScript', 'TypeScript', 'Python', 'Rust', 'Go', 'Java', 'C#', 'Ruby', 'PHP', 'Swift'].map(
        (lang) => (
          <TabItem key={lang} value={lang.toLowerCase()} label={lang}>
            <p>Hello from {lang}!</p>
          </TabItem>
        ),
      )}
    </Tabs>
  ),
};
