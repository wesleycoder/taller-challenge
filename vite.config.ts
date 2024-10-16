import { VitePluginNode } from 'vite-plugin-node'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => ({
  test: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
    },
    setupFiles: ['./src/lib/testsSetup.ts'],
  },
  server: {
    port: 3000,
  },
  plugins: [
    tsconfigPaths(),
    ...(mode !== 'test'
      ? VitePluginNode({
          adapter: 'express',
          appPath: './src/index.ts',
          exportName: 'app',
          initAppOnBoot: true,
        })
      : []),
  ],
}))
