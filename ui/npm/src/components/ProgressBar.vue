<template>
  <div
    class="progress-bar"
    :style="{
      '--height': height,
    } as any"
  >
    <span
      class="progress-bar__indicator"
      :style="{
        width: `${(value * 100) / max}%`,
      }"
    ></span>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ProgressBar",
  props: {
    value: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 10000,
    },
    height: {
      type: String,
      default: "0.5rem",
    },
  },
});
</script>
<style scoped>
.progress-bar {
  height: var(--height);
  display: flex;
  border-radius: 1rem;
  background-color: hsla(324, 79%, 60%, 0.1);
}
.progress-bar__indicator {
  height: 100%;
  display: inline-block;
  background-color: #ea4aaa;
  border-radius: inherit;
}
</style>
