<template>
  <table cellSpacing="0" v-if="columns">
    <thead>
      <tr>
        <HeadCell
          v-for="column in displayColumns"
          :column="column"
          :key="column.name"
        />
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(row, rowIndex) in rows"
        :key="row.id"
        :class="{
          selected: selected?.rowIndex === rowIndex,
        }"
      >
        <Cell
          @click="selectCell(rowIndex, column.name)"
          v-for="column in displayColumns"
          :row="row"
          :column="column"
          :key="column.name"
          :class="{
            selected:
              selected?.rowIndex === rowIndex &&
              selected?.columnName === column.name,
          }"
        />
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { useDatabase } from "@/modules/database";
import { computed, defineComponent } from "vue";
import Cell from "./Cell.vue";
import HeadCell from "./HeadCell.vue";

export default defineComponent({
  components: { Cell, HeadCell },
  name: "ConnectionData",
  setup() {
    const db = useDatabase();
    const displayColumns = computed(() =>
      db.columns.value.filter((column) =>
        db.visibleColumns.value.includes(column.name)
      )
    );

    return { ...db, displayColumns };
  },
});
</script>

<style scoped>
table {
  width: 100%;
  overflow: auto;
}
th:last-child {
  border-right-width: 0;
}
td:last-child {
  border-right-width: 0;
}
tr:nth-child(odd) {
  background-color: var(--vscode-panel-background);
}
tr:nth-child(even) {
  background-color: var(--vscode-input-background);
}
tr.selected {
  color: white;
  background-color: var(--vscode-charts-lines);
}
tbody td.selected {
  color: white;
  box-shadow: inset 0 0 0 1px var(--vscode-charts-blue);
}
</style>
