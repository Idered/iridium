<template>
  <div
    v-if="view === View.Analyze"
    class="grid grid-cols-[32px_1fr_32px] justify-items-center items-center px-3 border-b border-b-[color:var(--vscode-panel-border)]"
  >
    <a
      class="flex items-center h-8 w-8"
      @click="navigateTo(View.Manage)"
      role="button"
      aria-label="Go back"
    >
      <svg width="16" height="16" viewBox="0 0 16 16">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="m7 3.093l-5 5V8.8l5 5l.707-.707l-4.146-4.147H14v-1H3.56L7.708 3.8L7 3.093z"
          clip-rule="evenodd"
        />
      </svg>
    </a>
    <div class="uppercase tracking-wider text-xs font-bold">Analyze</div>
  </div>
  <div
    v-if="view === View.Support"
    class="grid grid-cols-[32px_1fr_32px] justify-items-center items-center px-3 border-b border-b-[color:var(--vscode-panel-border)]"
  >
    <a
      class="flex items-center h-8 w-8"
      @click="navigateTo(View.Manage)"
      role="button"
      aria-label="Go back"
    >
      <svg width="16" height="16" viewBox="0 0 16 16">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="m7 3.093l-5 5V8.8l5 5l.707-.707l-4.146-4.147H14v-1H3.56L7.708 3.8L7 3.093z"
          clip-rule="evenodd"
        />
      </svg>
    </a>
    <div class="uppercase tracking-wider text-xs font-bold">Support</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { View } from "../enums";
import { useStore } from "../lib/store";

const store = useStore();
const view = computed(() => store.state.view);
const navigateTo = (view: View) => store.commit("navigate", view);
</script>
