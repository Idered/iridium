<template>
  <table cellSpacing="0" v-if="columns" :class="{ fixed }">
    <thead ref="thead">
      <tr>
        <HeadCell
          v-for="column in displayColumns"
          :column="column"
          :key="column.name"
          @mounted="setTableToFixed"
          @before-unmount="setTableToAuto"
        />
      </tr>
    </thead>
    <tbody ref="tbody">
      <tr
        v-for="(row, rowIndex) in rows"
        :key="row.id"
        :class="{
          selected: selected?.rowIndex === rowIndex,
        }"
      >
        <Cell
          @click="handleCellClick(rowIndex, column.name)"
          @keydown.up.prevent="goUp(rowIndex, column.name)"
          @keydown.down.prevent="goDown(rowIndex, column.name)"
          @keydown.right.prevent="goRight(rowIndex, column.name)"
          @keydown.left.prevent="goLeft(rowIndex, column.name)"
          @keydown.enter="handleCellClick(rowIndex, column.name)"
          v-for="column in displayColumns"
          :column="column"
          :key="column.name"
          :class="{
            mutated: getCellMutation(row, column.name),
            editing:
              isEditing &&
              selected?.rowIndex === rowIndex &&
              selected?.columnName === column.name,
            selected:
              selected?.rowIndex === rowIndex &&
              selected?.columnName === column.name,
          }"
        >
          <EditInput
            @keydown.left.stop
            @keydown.right.stop
            @keydown.up.stop
            @keydown.down.stop
            @closeEdit="isEditing = false"
            v-if="
              isEditing &&
              selected?.rowIndex === rowIndex &&
              selected?.columnName === column.name
            "
            :row="row"
            :column="column"
          />
          <template v-else>
            {{ getCellValue(row, column.name) }}
          </template>
        </Cell>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { useDatabase } from "@/modules/database";
import { useTableNavigation } from "@/modules/table-navigation";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import Cell from "./Cell.vue";
import EditInput from "./EditInput.vue";
import HeadCell from "./HeadCell.vue";

export default defineComponent({
  components: { Cell, HeadCell, EditInput },
  name: "ConnectionData",
  setup() {
    const db = useDatabase();
    const fixed = ref(false);
    const tbody = ref<HTMLTableSectionElement | null>(null);
    const thead = ref<HTMLTableSectionElement | null>(null);
    const tableNavigation = useTableNavigation(tbody);
    const isEditing = ref(false);
    const displayColumns = computed(() =>
      db.columns.value.filter((column) =>
        db.visibleColumns.value.includes(column.name)
      )
    );
    const handleCellClick = (rowIndex?: number, columnName?: string) => {
      const wasSelected = db.selectCell(rowIndex, columnName);
      isEditing.value = wasSelected;
    };
    const setTableToFixed = () => {
      fixed.value = true;
    };
    const setTableToAuto = () => {
      fixed.value = false;
    };

    return {
      ...db,
      ...tableNavigation,
      displayColumns,
      handleCellClick,
      isEditing,
      tbody,
      thead,
      fixed,
      setTableToFixed,
      setTableToAuto,
    };
  },
});
</script>

<style scoped>
table {
  width: 100%;
  overflow: auto;
}
.fixed {
  table-layout: fixed;
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
  color: var(--vscode-textPreformat-foreground);
}
tbody td.selected,
tbody td.mutated {
  position: relative;
}
tbody td.mutated:not(.selected)::after {
  border-color: var(--vscode-inputValidation-infoBorder);
}
tbody td.mutated::after,
tbody td.selected::after {
  content: "";
  position: absolute;
  top: 0;
  pointer-events: none;
  right: 0;
  bottom: 0;
  left: 0;
  border: 1px solid var(--vscode-inputOption-activeBorder);
}
td.editing {
  padding: 0;
}
</style>
