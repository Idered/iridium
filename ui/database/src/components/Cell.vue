<template>
  <td
    class="cell"
    :class="{
      'left-0': column.is_primary_key,
      sticky: column.is_primary_key,
      'text-right': ['integer', 'float'].includes(column.type),
    }"
  >
    {{ row[column.name] }}
  </td>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Cell",
  props: {
    column: {
      type: Object,
      required: true,
    },
    row: {
      type: Object,
      required: true,
    },
  },
});
</script>

<style scoped>
.cell {
  user-select: text;
  border: 1px solid var(--vscode-textBlockQuote-background);
  border-left-width: 0;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: normal;
  border-top: 0;
  white-space: nowrap;
  max-width: 160px;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  background: inherit;
}
</style>
