import { VitePluginNode } from 'vite-plugin-node'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
    },
  },
  server: {
    port: 3000,
  },
  plugins: [
    tsconfigPaths(),
    ...VitePluginNode({
      adapter: 'express',
      appPath: './src/index.ts',
      exportName: 'app',
      initAppOnBoot: true,
    }),
  ],
})
