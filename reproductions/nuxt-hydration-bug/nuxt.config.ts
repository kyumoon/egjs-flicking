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
  // Vue strips the detailed "rendered on server / expected on client" hydration
  // warnings from production builds — they are gated behind the
  // `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__` feature flag (default false).
  // Nuxt turns that flag on when `debug.hydration` is set, so the mismatch is
  // still logged to the console after `npm run build && npm run start`.
  debug: {
    hydration: true
  },
  compatibilityDate: "2024-11-01"
});
