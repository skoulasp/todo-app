import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: "./",
    build: {
        sourcemap: true,
    },
    css: {
        devSourcemap: true, // enable CSS source maps during development
    },
});
