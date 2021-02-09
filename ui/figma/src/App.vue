<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>

<style>
#app {
  display: grid;
  max-height: 100vh;
  grid-template-rows: 1fr;
}

body {
  user-select: none;
  overflow: hidden;
  color: var(--vscode-foreground);
  font-size: var(--vscode-font-size);
  font-weight: var(--vscode-font-weight);
  font-family: var(--vscode-font-family);
  background-color: var(--vscode-panel-background);
  padding: 0;
}

* {
  padding: 0;
  margin: 0;
}

*,
*::after,
*::before {
  box-sizing: border-box;
}
</style>
<style src="./utilities.css"></style>
