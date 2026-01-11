import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://kandala05.github.io',
  base: '/support-app',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    starlight({
      title: 'Support App',
      description: 'AI-powered support portal for tracking platform engineering issues',
      social: {
        github: 'https://github.com/kandala05/support-app',
      },
      customCss: [
        './src/styles/tailwind.css',
        './src/styles/custom.css',
      ],
      sidebar: [
        {
          label: 'Overview',
          items: [
            { label: 'Introduction', slug: '' },
            { label: 'Quick Start', slug: 'quick-start' },
          ],
        },
        {
          label: 'Explanation',
          autogenerate: { directory: 'explanation' },
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'reference' },
        },
        {
          label: 'How-To Guides',
          autogenerate: { directory: 'how-to' },
        },
        {
          label: 'Tutorials',
          autogenerate: { directory: 'tutorials' },
        },
        {
          label: 'Interactive Prototypes',
          autogenerate: { directory: 'prototypes' },
        },
      ],
    }),
  ],
});
