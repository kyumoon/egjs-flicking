<script setup lang="ts">
import Flicking from "@egjs/vue3-flicking";
import "@egjs/vue3-flicking/dist/flicking.css";

// Multiple panels are required: with a single panel some renderers short-circuit.
const items = ["Panel A", "Panel B", "Panel C", "Panel D"];
</script>

<template>
  <div class="page">
    <h1>Nuxt SSR &times; vue3-flicking &mdash; BUG (4.14.0)</h1>

    <p>
      Run a <strong>production</strong> build
      (<code>npm run build &amp;&amp; npm run start</code>) and open the browser
      console. You should see a hydration mismatch:
    </p>
    <pre>- rendered on server: &lt;panel&gt;&lt;/panel&gt;
- expected on client: Symbol(v-fgt)</pre>

    <!--
      Intentionally NOT wrapped in <ClientOnly>: the server must render the
      panels for the mismatch to occur. The server emits <panel></panel>
      elements while the client expects Fragments (Symbol(v-fgt)).
    -->
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
pre {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 6px;
}
.flicking-panel {
  width: 200px;
  height: 120px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e06c75;
  color: #fff;
  font-size: 20px;
  border-radius: 8px;
}
</style>
