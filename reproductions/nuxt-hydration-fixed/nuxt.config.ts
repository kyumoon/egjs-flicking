// SSR stays ON (default) so the server renders the Flicking panels.
// `@egjs/vue3-flicking` is transpiled. The server (nitro) bundle resolves to
// the package's CJS entry while the client bundle resolves to ESM — the same
// split that breaks the unfixed version. With the fix (VuePanel referenced
// directly instead of via `resolveComponent("Panel")`) both sides render
// Fragments, so there is no mismatch.
export default defineNuxtConfig({
  ssr: true,
  build: {
    transpile: ["@egjs/vue3-flicking"]
  },
  compatibilityDate: "2024-11-01"
});
