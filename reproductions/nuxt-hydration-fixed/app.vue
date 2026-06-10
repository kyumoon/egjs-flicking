<script setup lang="ts">
import Flicking from "@egjs/vue3-flicking";
import "@egjs/vue3-flicking/dist/flicking.css";

// Multiple panels are required: with a single panel some renderers short-circuit.
const items = ["Panel A", "Panel B", "Panel C", "Panel D"];
</script>

<template>
  <div class="page">
    <h1>Nuxt SSR &times; vue3-flicking &mdash; FIXED (local)</h1>

    <p>
      Same app as the bug repro, but consuming the locally-built package that
      references <code>VuePanel</code> directly instead of
      <code>resolveComponent("Panel")</code>. After a
      <strong>production</strong> build
      (<code>npm run build &amp;&amp; npm run start</code>) the browser console
      should show <strong>no</strong> hydration mismatch, and the server HTML
      contains Fragment-wrapped panels instead of <code>&lt;panel&gt;</code>.
    </p>

    <!-- Still NOT wrapped in <ClientOnly> — the fix makes SSR render correctly. -->
    <Flicking :options="{ circular: true, align: 'prev' }">
      <div
        v-for="item in items"
        :key="item"
        class="flicking-panel"
      >
        {{ item }}
      </div>
    </Flicking>
  </div>
</template>

<style>
.page {
  font-family: sans-serif;
  padding: 24px;
}
.flicking-panel {
  width: 200px;
  height: 120px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #98c379;
  color: #fff;
  font-size: 20px;
  border-radius: 8px;
}
</style>
