
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import yaml from "@rollup/plugin-yaml";
import { imagetools} from "vite-imagetools";
import viteTsConfigPaths from 'vite-tsconfig-paths'
import sass from "vite-plugin-sass";
import netlify from '@netlify/vite-plugin-tanstack-start'

const config = defineConfig({
  plugins: [
    devtools(),
    netlify(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    imagetools(),
    yaml(),
    sass(),
    tanstackStart(),
    viteReact({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
})

export default config
