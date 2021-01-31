<template>
  <button
    class="button"
    :style="{
      '--height': `${height}px`,
      '--padding': `${Math.round(height / 2)}px`,
      '--font-size': `${fontSize}px`,
    }"
    :class="{
      [`button--${variant}`]: variant,
      'button--square': square,
    }"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "Button",
  props: {
    variant: {
      type: String as PropType<"primary" | "negative" | "secondary">,
    },
    square: {
      type: Boolean,
    },
    height: {
      type: Number,
      default: 28,
    },
  },
  computed: {
    fontSize() {
      if (this.height <= 24) return 12;
      if (this.height <= 28) return 13;
      if (this.height <= 32) return 14;
      if (this.height <= 40) return 16;
      return 16;
    },
  },
});
</script>

<style scoped>
.button {
  cursor: pointer;
  padding: 0 var(--padding);
  height: var(--height);
  font-size: var(--fontSize);
  border: 0;
  color: var(--vscode-button-foreground);
  background: var(--vscode-button-background);
}
.button:hover {
  background: var(--vscode-button-hoverBackground);
}
.button:focus {
  outline: 0;
}

.button--square {
  padding: 0;
  width: var(--height);
}

.button--negative {
  border: 1px solid var(--vscode-errorForeground);
  color: var(--vscode-errorForeground);
  background: none;
}
.button--negative:hover {
  color: #fff;
  background: var(--vscode-errorForeground);
}

.button--secondary {
  color: var(--vscode-panel-foreground);
  border: 1px solid var(--vscode-input-border);
  background: none;
}
.button--secondary:hover {
  color: var(--vscode-textPreformat-foreground);
  background: none;
}
</style>
