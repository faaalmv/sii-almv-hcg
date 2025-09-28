import { mergeConfig } from 'vite';
import type { UserConfigFn } from 'vite';
import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

// Resolve the function-based Vite config before merging
const viteConfigObject = (viteConfig as UserConfigFn)({ command: 'serve', mode: 'test' });

export default mergeConfig(
  viteConfigObject,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './vitest.setup.ts',
    },
  })
);