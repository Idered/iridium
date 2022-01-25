<template>
  <VercelView v-if="view === View.Vercel" />
  <div v-if="view === View.Surge">TODO</div>
  <div v-if="view === View.Netlify">TODO</div>
  <div v-if="view === View.GitHubPages">TODO</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { View } from "./enums";
import VercelView from "./views/VercelView.vue";

export default defineComponent({
  name: "App",
  components: { VercelView },
  setup() {
    const view = ref<View>();

    onMounted(() => {
      view.value = document.body.dataset.view as View;
    });

    return {
      View,
      view,
    };
  },
});
</script>

<style>
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
