import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import sass from "vite-plugin-sass";
import netlify from '@netlify/vite-plugin-tanstack-start'

// oxlint-disable-next-line import/no-default-export -- Vite requires default export for config files
export default defineConfig({
  plugins: [
    devtools(),
    netlify(),
    sass(),
    tanstackStart(),
    viteReact({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  }
});
