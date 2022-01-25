<template>
  <button
    class="button"
    :class="{
      [`button--${variant}`]: variant,
      'button--square': square,
    }"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";

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
  setup(props) {
    const padding = computed(() => {
      return `${Math.round(props.height / 2)}px`;
    });
    const heightPx = computed(() => {
      return `${props.height}px`;
    });
    return {
      padding,
      heightPx,
    };
  },
});
</script>

<style scoped>
.button {
  cursor: pointer;
  font-size: var(--vscode-font-size);
  padding: 0 v-bind(padding);
  height: v-bind(heightPx);
  border: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
.button--secondary:disabled,
.button--secondary:disabled:hover {
  color: var(--vscode-panel-foreground);
  opacity: 0.5;
  border: 1px solid var(--vscode-input-border);
  background: none;
  cursor: default;
}
</style>
