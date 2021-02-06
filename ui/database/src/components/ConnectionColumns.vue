<template>
  <Dropdown position="top-right">
    <Button :height="24" variant="secondary"
      >Columns
      <span v-if="visibleColumns.length !== columnOptions.length"
        >({{ visibleColumns.length }}/{{ columnOptions.length }})</span
      >
    </Button>
    <template #content="{ close }">
      <div class="columns">
        <CheckboxGroup
          :options="columnOptions"
          itemClass="column"
          name="visibleColumns"
          v-model="visibleColumns"
        />
        <Button
          @click="
            resetColumns();
            close();
          "
          :height="24"
          variant="secondary"
          >Reset</Button
        >
      </div>
    </template>
  </Dropdown>
</template>

<script lang="ts">
import Button from "@shared/components/Button.vue";
import CheckboxGroup from "@shared/components/CheckboxGroup.vue";
import { useDatabase } from "@/modules/database";
import { computed, defineComponent } from "vue";
import Dropdown from "@shared/components/Dropdown.vue";

export default defineComponent({
  components: { CheckboxGroup, Button, Dropdown },
  name: "ConnectionColumns",
  setup() {
    const { visibleColumns, setVisibleColumns, columns } = useDatabase();
    const columnOptions = computed(() =>
      columns.value?.map((column) => ({
        value: column.name,
        label: column.name,
      }))
    );
    const resetColumns = () => {
      setVisibleColumns(columns.value.map((item) => item.name));
    };

    return {
      visibleColumns,
      columnOptions,
      resetColumns,
    };
  },
});
</script>

<style scoped>
.columns {
  padding: 4px 8px 8px 8px;
  display: grid;
  row-gap: 4px;
  justify-items: flex-start;
}
.columns >>> .column {
  white-space: nowrap;
  max-width: 300px;
  padding: 4px 32px 4px 0;
}
</style>
