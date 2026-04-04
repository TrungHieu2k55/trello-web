import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  // Cho phép vite xài process.env, bình thường xài meta.env
  // https://github.com/vitejs/vite/issues/1973
  define: {
    'process.env' : process.env
  },
  plugins: [
    react(),
    svgr()
  ],
  // base: "./",
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  }
})
