import { defineConfig } from '@playwright/test';

// Used only for merging blob reports from multiple regions.
// testDir must be a common ancestor of all region test directories.
export default defineConfig({
  testDir: './src/regions',
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
});
