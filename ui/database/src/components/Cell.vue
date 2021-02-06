<template>
  <td
    tabindex="0"
    class="cell"
    :class="{
      'z-10': column.is_primary_key,
      'left-0': column.is_primary_key,
      sticky: column.is_primary_key,
      'text-right': ['integer', 'float'].includes(column.type),
    }"
  >
    <slot />
  </td>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Cell",
  emits: ["enter"],
  props: {
    column: {
      type: Object,
      required: true,
    },
  },
});
</script>

<style scoped>
.cell {
  user-select: none;
  border-top: 1px solid var(--vscode-textBlockQuote-background);
  border-left: 1px solid var(--vscode-textBlockQuote-background);
  padding: 4px 8px;
  font-size: 12px;
  font-weight: normal;
  white-space: nowrap;
  max-width: 160px;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  background: inherit;
  cursor: default;
  outline: 1px solid transparent;
}
</style>
