import netlify from "@netlify/vite-plugin-tanstack-start";
import yaml from "@rollup/plugin-yaml";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";

// oxlint-disable-next-line import/no-default-export -- Vite requires default export for config files
export default defineConfig({
  plugins: [
    devtools(),
    netlify(),
    imagetools(),
    yaml(),
    tanstackStart(),
    viteReact({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
