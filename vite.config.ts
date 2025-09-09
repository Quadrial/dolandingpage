// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
// import path from "path";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [tailwindcss(), react()],
//   define: {
//     global: "globalThis",
//   },
//   resolve: {
//     alias: {
//       buffer: "buffer",
//       "@xmtp/wasm-bindings": path.resolve(
//         __dirname,
//         "node_modules/@xmtp/wasm-bindings/dist/bindings_wasm.js"
//       ),
//     },
//   },
//   optimizeDeps: {
//     exclude: ["@xmtp/browser-sdk"],
//     include: ["@xmtp/proto", "buffer"],
//   },
//   server: {
//     fs: {
//       allow: [".."],
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      buffer: "buffer",
      // ✅ Remove manual alias for @xmtp/wasm-bindings
    },
  },
  optimizeDeps: {
    // ✅ Do not exclude browser-sdk, let Vite optimize it
    include: [
      "@xmtp/browser-sdk",
      "@xmtp/proto",
      "@xmtp/wasm-bindings", // force Vite to prebundle
      "buffer",
    ],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
});
