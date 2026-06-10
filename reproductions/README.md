# vue3-flicking SSR hydration mismatch — reproductions

Two minimal Nuxt 3 apps that demonstrate the `<panel>` vs `Symbol(v-fgt)`
hydration mismatch in `@egjs/vue3-flicking` under SSR, and the fix for it.

| App | `@egjs/vue3-flicking` | Expected result (production build) |
| --- | --- | --- |
| [`nuxt-hydration-bug`](./nuxt-hydration-bug) | `4.14.0` (published) | ❌ hydration mismatch in console |
| [`nuxt-hydration-fixed`](./nuxt-hydration-fixed) | `file:../../packages/vue3-flicking` (local, fixed) | ✅ no mismatch |

## The bug

`Flicking.getPanels()` is evaluated lazily as the camera's default slot. In a
**production** SSR build the rendering instance context can be lost at that
point, so `resolveComponent("Panel")` fails to find the locally-registered
`Panel` component and falls back to the string `"Panel"` — rendering a
`<panel>` native element on the server. The client renders a Fragment instead,
producing:

```
- rendered on server: <panel></panel>
- expected on client: Symbol(v-fgt)
```

`data-allow-mismatch` cannot suppress this because it is a **node-type**
mismatch (Element vs Fragment), which is outside the
`text / children / class / style / attribute` categories it covers.

> ⚠️ The mismatch only reproduces in a **production build**
> (`npm run build && npm run start`). `nuxt dev` happens to run the same ESM
> bundle on server and client, so it is hidden there. Always verify SSR
> hydration with a production build.

## The fix

Reference the imported `VuePanel` component directly instead of resolving it by
name. This guarantees panels are wrapped in the same component regardless of
render context. See `packages/vue3-flicking/src/Flicking.ts` (branch
`fix/vue3-ssr-panel-hydration-mismatch`).

## Seeing the warning in a production build

By default Vue **strips the detailed hydration mismatch warnings**
(`- rendered on server: ... / - expected on client: ...`) from production
builds — they are gated behind the `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__`
feature flag (default `false`). So after `npm run build && npm run start` the
mismatch still *happens* (the server sends `<panel>`, the client replaces it),
but **nothing is logged** unless the flag is on.

Both apps force the flag on unconditionally via `vite.define` in
`nuxt.config.ts`:

```ts
vite: { define: { __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "true" } }
```

Nuxt spreads user `vite.define` last, so this overrides its default and the
mismatch is always logged — in dev and after `npm run build && npm run start`
alike.

> Ground-truth check that does **not** depend on the flag: inspect the raw SSR
> HTML. The bug app's server response contains `<panel>` elements; the fixed
> app's does not.
>
> ```bash
> curl -s http://localhost:3000 | grep -o '<panel>' | head   # bug app -> matches
> ```

## How to run

### Bug app (published 4.14.0)

```bash
cd reproductions/nuxt-hydration-bug
npm install
npm run build && npm run start
# open http://localhost:3000 and check the browser console
```

### Fixed app (local package)

The fixed app consumes the local package via `file:`. Build the local package
first so `dist/` exists:

```bash
# from the repo root
cd packages/vue3-flicking
npm install
npm run build

cd ../../reproductions/nuxt-hydration-fixed
npm install
npm run build && npm run start
# open http://localhost:3000 — no hydration mismatch in the console
```
