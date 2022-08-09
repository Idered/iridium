<template>
  <div v-if="view === View.Analyze" class="flex">
    <a
      class="flex items-center mx-3 align"
      @click="navigateTo(View.Manage)"
      role="button"
      aria-label="Go back"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        class="iconify iconify--codicon"
        width="32"
        height="32"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 16 16"
      >
        <path
          fill="currentColor"
          d="M6.5 10.7L4 8.2v-.7L6.5 5l.71.7l-1.64 1.65h5.57v1H5.57L7.22 10l-.72.7z"
        ></path>
      </svg>
      Back to dependencies
    </a>
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
