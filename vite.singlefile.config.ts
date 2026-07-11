import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig, type Plugin } from 'vite'

function inlineBuildAssets(): Plugin {
  return {
    name: 'inline-build-assets',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      for (const output of Object.values(bundle)) {
        if (output.type !== 'asset' || !output.fileName.endsWith('.html')) {
          continue
        }

        let html = typeof output.source === 'string'
          ? output.source
          : output.source.toString()

        html = html.replace(/<link rel="modulepreload"[^>]*>/g, '')

        html = html.replace(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (_, href: string) => {
          const fileName = href.replace(/^\.?\//, '')
          const asset = bundle[fileName]

          if (!asset || asset.type !== 'asset') {
            return _
          }

          delete bundle[fileName]
          const css = typeof asset.source === 'string' ? asset.source : asset.source.toString()
          return `<style>${css}</style>`
        })

        html = html.replace(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g, (_, src: string) => {
          const fileName = src.replace(/^\.?\//, '')
          const chunk = bundle[fileName]

          if (!chunk || chunk.type !== 'chunk') {
            return _
          }

          delete bundle[fileName]
          return `<script type="module">${chunk.code.replace(/<\/script>/g, '<\\/script>')}</script>`
        })

        output.source = html
      }
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    inlineBuildAssets(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    cssCodeSplit: false,
    modulePreload: false,
    outDir: 'dist-single',
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
})
