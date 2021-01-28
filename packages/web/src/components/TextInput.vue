<template>
  <input
    :value="modelValue"
    v-on:input="$emit('update:modelValue', $event.target.value)"
    type="text"
    class="input"
    :style="{
      '--height': `${height}px`,
      '--padding': `${Math.round(height / 3.5)}px`,
      '--font-size': `${fontSize}px`,
    }"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TextInput",
  props: {
    modelValue: [String, Number],
    height: {
      type: Number,
      default: 24,
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
  emits: ["update:modelValue"],
});
</script>

<style scoped>
.input {
  font-size: 13px;
  font-family: inherit;
  width: 100%;
  background: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  border: 1px solid var(--vscode-input-border);
  padding: 0 var(--padding);
  height: var(--height);
  font-size: var(--fontSize);
}
.input::placeholder {
  color: var(--vscode-input-placeholderForeground);
}
.input:focus {
  outline: 0;
  border-color: var(--vscode-focusBorder);
}
</style>
