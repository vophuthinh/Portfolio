import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: ".",
  base: "./",

  build: {
    outDir: "dist",
    assetsDir: "assets",

    // Minification settings
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info"],
      },
      format: {
        comments: false,
      },
    },

    // Code splitting
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        offline: resolve(__dirname, "offline.html"),
      },
      output: {
        // Asset file naming
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },

    // CSS code splitting
    cssCodeSplit: true,

    // Source maps for production debugging
    sourcemap: false,

    // Asset inlining threshold (10kb)
    assetsInlineLimit: 10240,

    // Report compressed size
    reportCompressedSize: true,

    // Chunk size warnings
    chunkSizeWarningLimit: 500,
  },

  // Optimization settings
  optimizeDeps: {
    include: [],
  },

  // Server settings for development
  server: {
    port: 3000,
    open: true,
    cors: true,
  },

  // Preview settings
  preview: {
    port: 4173,
    open: true,
  },

  // CSS settings
  css: {
    devSourcemap: true,
    preprocessorOptions: {},
  },
});
