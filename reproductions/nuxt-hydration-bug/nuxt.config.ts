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
  compatibilityDate: "2024-11-01"
});
