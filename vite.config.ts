import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const isWidget = mode === 'widget'

  if (isWidget) {
    return {
      plugins: [react()],
      build: {
        outDir: 'dist/widget',
        emptyOutDir: true,
        lib: {
          entry: 'src/widget/index.tsx',
          name: 'GarooChat',
          formats: ['iife'],
          fileName: () => 'garoo-chat-widget.js',
        },
        rollupOptions: {
          output: {
            extend: true,
            assetFileNames: 'garoo-chat-widget.[ext]',
          },
        },
        cssCodeSplit: false,
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
    }
  }

  return {
    plugins: [react()],
    server: {
      port: 5173,
      open: true,
    },
  }
})
