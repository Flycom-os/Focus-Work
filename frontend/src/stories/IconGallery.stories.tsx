import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IconGallery } from '../components/IconGallery';

const meta = {
  title: 'Design System/Icon Gallery',
  component: IconGallery,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Complete icon catalog listing JetBrains UI icons and Lucide icon sets with search, source filtering, and copy utilities.',
      },
    },
  },
} satisfies Meta<typeof IconGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
  args: {
    initialSource: 'all',
    itemsPerPage: 96,
  },
};

export const JetBrainsIcons: Story = {
  args: {
    initialSource: 'jetbrains',
    itemsPerPage: 96,
  },
};

export const LucideIcons: Story = {
  args: {
    initialSource: 'lucide',
    itemsPerPage: 96,
  },
};
