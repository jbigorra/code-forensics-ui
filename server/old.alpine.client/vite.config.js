import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src', // Set root folder to src/
  build: {
    outDir: 'dist', // Output folder
    assetsDir: 'assets', // Assets folder inside output directory
    rollupOptions: {
      output: {
        entryFileNames: 'assets/js/[name].js', // JS entry files
        chunkFileNames: 'assets/js/[name].js', // Code-split JS files
        assetFileNames: (chunkInfo) => {
          if (/\.(css)$/.test(chunkInfo.name)) {
            return 'assets/styles/[name][ext]' // CSS files
          }
          return 'assets/[ext]/[name][ext]' // Other public assets
        }
      }
    }
  },
  server: {
    open: true, // Open browser automatically,
    port: 5500,
    host: 'localhost',
    middlewareMode: false
  }
})
