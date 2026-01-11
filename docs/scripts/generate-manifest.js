#!/usr/bin/env node

/**
 * Generates manifest.json for AI context
 *
 * This script scans the docs content and generates a manifest
 * that AI assistants can use to understand the documentation structure.
 *
 * Usage: node scripts/generate-manifest.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, '../src/content/docs');
const OUTPUT_PATH = path.join(__dirname, '../public/manifest.json');

const DIATAXIS_SECTIONS = ['explanation', 'reference', 'how-to', 'tutorials', 'prototypes'];

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const frontmatter = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      frontmatter[key] = value;
    }
  }

  return frontmatter;
}

function scanDirectory(dir, basePath = '') {
  const pages = [];

  if (!fs.existsSync(dir)) {
    return pages;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      pages.push(...scanDirectory(fullPath, path.join(basePath, entry.name)));
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const frontmatter = extractFrontmatter(content);

      let urlPath = basePath;
      if (entry.name !== 'index.md' && entry.name !== 'index.mdx') {
        urlPath = path.join(basePath, entry.name.replace(/\.mdx?$/, ''));
      }

      if (frontmatter.title) {
        pages.push({
          title: frontmatter.title,
          path: '/' + urlPath.replace(/\\/g, '/') + '/',
          description: frontmatter.description || ''
        });
      }
    }
  }

  return pages;
}

function generateManifest() {
  const sections = {};

  for (const section of DIATAXIS_SECTIONS) {
    const sectionDir = path.join(DOCS_DIR, section);
    const pages = scanDirectory(sectionDir, section);

    if (pages.length > 0) {
      sections[section] = {
        description: getSectionDescription(section),
        pages
      };
    }
  }

  const manifest = {
    name: 'support-app',
    version: '1.0.0',
    purpose: 'AI-powered support portal for tracking platform engineering issues',
    repository: 'https://github.com/kandala05/support-app',
    documentation: {
      framework: 'diataxis',
      sections
    },
    ai_guidance: {
      primary_context: [
        '/explanation/architecture/',
        '/explanation/ai-strategy/',
        '/reference/database-schema/',
        '/reference/api/'
      ],
      coding_standards: 'See team-playbook at https://kandala05.github.io/team-playbook/',
      tech_stack: {
        frontend: 'Next.js 15, React, TypeScript, Tailwind CSS',
        database: 'PostgreSQL with Drizzle ORM',
        infrastructure: 'AWS via SST',
        ai: 'Anthropic Claude via Vercel AI SDK',
        documentation: 'Astro/Starlight'
      }
    },
    metadata: {
      type: 'internal-tool',
      domain: 'platform-engineering',
      capabilities: [
        'issue-tracking',
        'documentation-search',
        'ai-assistance',
        'analytics'
      ],
      last_updated: new Date().toISOString().split('T')[0]
    }
  };

  return manifest;
}

function getSectionDescription(section) {
  const descriptions = {
    explanation: 'Conceptual understanding of Support App architecture and design',
    reference: 'Technical specifications and API documentation',
    'how-to': 'Task-oriented guides for common operations',
    tutorials: 'Learning-oriented walkthroughs',
    prototypes: 'Interactive React prototypes demonstrating UX'
  };
  return descriptions[section] || '';
}

// Main
const manifest = generateManifest();
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2));
console.log(`✓ Generated manifest.json with ${Object.keys(manifest.documentation.sections).length} sections`);

// Log summary
for (const [section, data] of Object.entries(manifest.documentation.sections)) {
  console.log(`  - ${section}: ${data.pages.length} pages`);
}
