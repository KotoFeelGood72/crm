import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: () => "main.js",
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
    cssCodeSplit: false, // Это объединит все CSS файлы в один
  },
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
      symbolId: "icon-[dir]-[name]",
      svgoOptions: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/scss/style.scss";`,
      },
    },
  },
  server: {
    port: 5123,
    host: true,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    proxy: {
      "/api": {
        target: "https://manager.dynamic-devs-collective.ru/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
