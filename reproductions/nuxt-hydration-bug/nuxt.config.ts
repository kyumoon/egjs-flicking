// SSR stays ON (default) so the server renders the Flicking panels.
// `@egjs/vue3-flicking` is transpiled. The server (nitro) bundle resolves to
// the package's CJS entry while the client bundle resolves to ESM — exactly
// the split that surfaces the `resolveComponent("Panel")` context loss in a
// production build.
export default defineNuxtConfig({
  ssr: true,
  build: {
    transpile: ["@egjs/vue3-flicking"]
  },
  // Force Vue's detailed hydration mismatch warnings ON unconditionally.
  // They are gated behind `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__` (default
  // false in production builds). Nuxt spreads user `vite.define` last, so this
  // overrides its computed value and the mismatch is always logged — in dev and
  // in production (`npm run build && npm run start`) alike.
  vite: {
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "true"
    }
  },
  compatibilityDate: "2024-11-01"
});
