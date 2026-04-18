import { execSync } from "node:child_process";

import netlify from "@netlify/vite-plugin-tanstack-start";
import yaml from "@rollup/plugin-yaml";
import tailwind from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";
import "dotenv/config";
import pkg from "./package.json" with { type: "json" };

function getCommitHash() {
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return "unknown";
  }
}

// oxlint-disable-next-line import/no-default-export -- Vite requires default export for config files
export default defineConfig({
  plugins: [
    devtools(),
    netlify(),
    imagetools(),
    yaml(),
    tailwind(),
    tanstackStart(),
    tailwind(),
    viteReact({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
  define: {
    "import.meta.env.COMMIT_HASH": JSON.stringify(getCommitHash()),
    "import.meta.env.PKG_VERSION": JSON.stringify(pkg.version),
  },
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 3000,
  },
});
