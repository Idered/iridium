<template>
  <div class="container">
    <Dropdown v-if="table">
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

    <Button
      v-if="table"
      :height="24"
      variant="secondary"
      @click="$emit('toggleFilters')"
      >Filters <span v-if="filters.length">({{ filters.length }})</span></Button
    >
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import Button from "@shared/components/Button.vue";
import Dropdown from "@shared/components/Dropdown.vue";
import { useDatabase } from "@/modules/database";
import Checkbox from "@shared/components/Checkbox.vue";
import CheckboxGroup from "@shared/components/CheckboxGroup.vue";
import FilterRow from "./FilterRow.vue";

export default defineComponent({
  name: "ConnectionActions",
  components: { Button, Dropdown, Checkbox, CheckboxGroup, FilterRow },
  setup() {
    const {
      visibleColumns,
      setVisibleColumns,
      columns,
      table,
      filters,
    } = useDatabase();
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
      table,
      filters,
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
.filters {
  padding: 4px 8px 8px 8px;
  display: grid;
  row-gap: 4px;
  justify-items: flex-start;
  width: calc(100vw - 16px);
}
.container {
  display: grid;
  grid-auto-flow: column;
  column-gap: 8px;
}
</style>
<style>
.columns .column {
  white-space: nowrap;
  max-width: 300px;
  padding: 4px 32px 4px 0;
}
</style>
