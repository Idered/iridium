<template>
  <th
    class="head-cell"
    :class="{
      'left-0': column.is_primary_key,
      sticky: column.is_primary_key,
      'z-20': column.is_primary_key,
      'text-right': ['integer', 'float'].includes(column.type),
    }"
    :key="column?.name"
    @click="toggleColumnOrder(column.name)"
  >
    {{ column?.name }}
    <span class="order" v-if="order?.column === column.name">
      <svg
        width="6"
        height="8"
        viewBox="0 0 6 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          v-if="order?.direction === 'desc'"
          d="M5.7 4.64L3.2 7.14H2.5L0 4.64L0.7 3.93L2.35 5.57V0H3.35V5.57L5 3.92L5.7 4.64Z"
        />
        <path
          v-else
          d="M-4.95199e-05 2.50002L2.49995 1.50617e-05L3.19995 1.50005e-05L5.69995 2.50001L4.99995 3.21001L3.34995 1.57001L3.34995 7.14001L2.34995 7.14001L2.34995 1.57001L0.699951 3.22001L-4.95199e-05 2.50002Z"
          fill="currentColor"
        />
      </svg>
    </span>
  </th>
</template>

<script lang="ts">
import { useDatabase } from "@/modules/database";
import { defineComponent } from "vue";

export default defineComponent({
  name: "HeadCell",
  props: {
    column: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { order, toggleColumnOrder } = useDatabase();
    return { order, toggleColumnOrder };
  },
});
</script>

<style scoped>
.head-cell {
  position: sticky;
  top: 0;
  text-align: left;
  border: 1px solid var(--vscode-textBlockQuote-background);
  padding: 4px 8px;
  font-size: 12px;
  font-weight: normal;
  border-left-width: 0;
  white-space: nowrap;
  background: var(--vscode-panel-background);
  cursor: pointer;
}
.head-cell:hover {
  color: var(--vscode-textPreformat-foreground);
}
.order {
  vertical-align: top;
  margin-left: 2px;
}
</style>
