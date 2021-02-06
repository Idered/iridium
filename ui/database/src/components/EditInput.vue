<template>
  <input
    class="edit-input"
    v-model="content"
    ref="input"
    :class="{
      'text-right': ['integer', 'float'].includes(column.type),
    }"
    @blur.stop="saveEdit"
    @keydown.enter.stop="saveEdit"
    @keydown.esc="closeEdit"
    @keypress="handleShortcut"
  />
</template>

<script lang="ts">
import { useDatabase } from "@/modules/database";
import { useDatabaseMutations } from "@/modules/database-mutations";
import { DatabaseTableColumn, MutationType } from "@/types";
import { defineComponent, onMounted, PropType, ref } from "vue";

export default defineComponent({
  name: "EditInput",
  props: {
    column: {
      type: Object as PropType<DatabaseTableColumn>,
      required: true,
    },
    row: {
      type: Object,
      required: true,
    },
  },
  emits: ["closeEdit"],
  setup({ row, column }, { emit }) {
    const {
      table,
      columns,
      getCellValue,
      getTableRows,
      connection,
    } = useDatabase();
    const {
      createMutation,
      commitMutations,
      discardMutations,
    } = useDatabaseMutations();
    const input = ref<HTMLInputElement | null>(null);
    const skipSave = ref(false);
    const content = ref(getCellValue(row, column.name));
    const closeEdit = () => {
      skipSave.value = true;
      input.value?.parentElement?.focus();
      emit("closeEdit");
      skipSave.value = false;
    };
    const saveEdit = () => {
      const hasValueChanged = row[column.name] !== content.value;
      if (skipSave.value || !hasValueChanged) {
        return closeEdit();
      }

      const primaryColumnName = columns.value.find(
        (item) => item.is_primary_key
      )?.name;

      createMutation(table.value, row, {
        originalValue: row[column.name],
        newValue: content.value,
        type: MutationType.UpdateColumn,
        tableName: table.value,
        columnName: column.name,
        primaryColumnName,
        primaryColumnValue: primaryColumnName
          ? row[primaryColumnName]
          : undefined,
      });

      closeEdit();
    };
    const handleShortcut = async (event: KeyboardEvent) => {
      if (event.ctrlKey && event.code === "KeyS") {
        saveEdit();
      }
      if (event.ctrlKey && event.code === "KeyD") {
        closeEdit();
      }
    };
    onMounted(() => {
      input.value?.select();
    });
    return { content, input, closeEdit, saveEdit, handleShortcut };
  },
});
</script>

<style scoped>
.edit-input {
  border: none;
  outline: 1px solid transparent;
  font-family: inherit;
  font-size: inherit;
  box-sizing: border-box;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: normal;
  width: 100%;
  line-height: 18px;
  color: black;
  background: white;
}
</style>
