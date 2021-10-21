<template>
  <div class="top-bar" v-if="config?.showAnalyzeTab || config?.showProTab">
    <div class="top-bar__item top-bar__item--full" variant="secondary">
      <a
        tabindex="-1"
        role="button"
        aria-label="Size view"
        :class="{ active: view === View.Manage }"
        @click="navigateTo(View.Manage)"
      >
        <div>Manage</div></a
      >
    </div>
    <div
      class="top-bar__item"
      variant="secondary"
      v-if="config?.showAnalyzeTab"
    >
      <a
        tabindex="-1"
        role="button"
        aria-label="Size view"
        :class="{ active: view === View.Analyze }"
        @click="navigateTo(View.Analyze)"
      >
        <div>
          {{ totalGZIPSize.size.toFixed(1) }} {{ totalGZIPSize.unit }}
        </div></a
      >
    </div>
    <!-- <div class="top-bar__item" variant="secondary" v-if="config?.showProTab">
      <a
        tabindex="-1"
        role="button"
        aria-label="Size view"
        :class="{ active: view === View.Pro }"
        @click="navigateTo(View.Pro)"
      >
        <HeartIcon />
      </a>
    </div> -->
  </div>
</template>
<script lang="ts">
import { computed } from "vue";
import { defineComponent } from "vue";
import { View } from "../enums";
import { useStore } from "../lib/store";
import { formatSize } from "../lib/utils";
import HeartIcon from "./icons/HeartIcon.vue";

export default defineComponent({
  name: "NavBar",
  components: {
    HeartIcon,
  },
  emits: ["navigate"],
  setup() {
    const store = useStore();
    return {
      View,
      config: computed(() => store.state.config),
      view: computed(() => store.state.view),
      totalGZIPSize: computed(() => formatSize(store.getters.totalGZIPSize)),
      navigateTo: (view: View) => store.commit("navigate", view),
    };
  },
});
</script>
<style scoped>
.top-bar {
  display: flex;
  margin-bottom: 0.75rem;
  border-top: 1px solid var(--vscode-panel-border);
  border-bottom: 1px solid var(--vscode-panel-border);
}
.top-bar__item {
  line-height: 22px;
  font-size: 12px;
  display: flex;
}
.top-bar__item--full {
  width: 100%;
  flex: 1;
}
.top-bar__item + * {
  border-left: 1px solid var(--vscode-panel-border);
}
.top-bar__item a {
  width: 100%;
  padding: 2px 0.75rem;
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
