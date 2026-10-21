import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
export default defineConfig({
  publicDir: false,
  plugins: [
    dts({
      include: ["src/lib/**/*.ts", "src/lib/**/*.tsx"],
      entryRoot: "src/lib",
      outDir: "lib",
      insertTypesEntry: true,
    }),
  ],
  build: {
    outDir: "lib",
    lib: {
      entry: "src/lib/index.ts",
      formats: ["es"],
      fileName: "index",
      cssFileName: "styles",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "motion/react"],
    },
  },
});
