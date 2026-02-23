import "dotenv/config";

import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwind from "@tailwindcss/vite";
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import netlify from '@netlify/vite-plugin-tanstack-start'
import { execSync } from "node:child_process";
import pkg from "./package.json" with {type: "json"};

function getCommitHash() {
  try {
    return execSync("git rev-parse --short HEAD").toString().trim()
  } catch {
    return "unknown";
  }
}

const config = defineConfig({
  plugins: [
    devtools(),
    netlify(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwind(),
    tanstackStart(),
    viteReact({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
  define: {
    "import.meta.env.COMMIT_HASH": JSON.stringify(getCommitHash()),
    "import.meta.env.PKG_VERSION": JSON.stringify(pkg.version)
  },
  server: {
    port: 3000,
  }
})

export default config
