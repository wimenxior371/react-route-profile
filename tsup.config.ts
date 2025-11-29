import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  minify: true,
  treeshake: true,
  clean: true,
  splitting: false, // safer for dual ESM/CJS libraries
  external: ["react", "react-dom"],
  loader: {
    ".css": "css",
  },
});
