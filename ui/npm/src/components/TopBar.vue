<template>
  <div class="top-bar">
    <div class="top-bar__item" variant="secondary" :height="32">
      <a
        tabindex="-1"
        role="button"
        aria-label="Size view"
        :class="{ active: view === View.Manage }"
        @click="$emit('navigate', View.Manage)"
      >
        <div>Manage</div></a
      >
    </div>
    <div class="top-bar__item" variant="secondary" :height="32">
      <a
        tabindex="-1"
        role="button"
        aria-label="Size view"
        :class="{ active: view === View.Analyze }"
        @click="$emit('navigate', View.Analyze)"
      >
        <div>Analyze</div></a
      >
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { View } from "../enums";

export default defineComponent({
  name: "TopBar",
  emits: ["navigate"],
  props: {
    view: {
      type: Number,
      required: true,
    },
  },
  setup() {
    return { View };
  },
});
</script>
<style scoped>
.top-bar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid var(--vscode-panel-border);
  border-bottom: 1px solid var(--vscode-panel-border);
}
.top-bar__item {
  line-height: 22px;
  font-size: 12px;
  display: flex;
  width: 100%;
}
.top-bar__item + * {
  border-left: 1px solid var(--vscode-panel-border);
}
.top-bar__item a {
  width: 100%;
  padding: 2px 5px;
  display: grid;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 11px;
  letter-spacing: 0.05em;
  grid-auto-flow: column;
  column-gap: 4px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--vscode-descriptionForeground);
}
.top-bar__item a.active {
  color: var(--vscode-foreground);
}
.top-bar__item a:hover {
  background: var(--vscode-toolbar-hoverBackground);
}
.top-bar__item a:focus {
  outline: 0;
}
</style>
