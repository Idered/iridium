<template>
  <div class="filters" v-if="table">
    <FilterRow v-for="filter in filters" :key="filter.uuid" :filter="filter" />
    <div class="buttons">
      <Button
        @click="applyFilters()"
        title="Apply filters"
        :height="24"
        variant="secondary"
        >Apply</Button
      >
      <Button
        @click="addRow"
        title="Add filter"
        :height="24"
        square
        variant="secondary"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
        >
          <g fill="currentColor">
            <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
          </g></svg
      ></Button>
    </div>
  </div>
</template>

<script lang="ts">
import { DatabaseFilterOperator } from "@/enums";
import { useDatabase } from "@/modules/database";
import { v4 } from "uuid";
import { defineComponent } from "vue";
import Button from "../Button.vue";
import FilterRow from "./FilterRow.vue";

export default defineComponent({
  components: { FilterRow, Button },
  name: "ConnectionFilters",
  setup() {
    const {
      addFilter,
      removeFilter,
      filters,
      table,
      getTableRows,
      columns,
    } = useDatabase();

    const applyFilters = async () => {
      if (table.value) {
        await getTableRows(table.value);
      }
    };

    const addRow = () => {
      addFilter({
        uuid: v4(),
        active: true,
        column: columns.value[0].name,
        operator: DatabaseFilterOperator.EQUAL,
        value: "",
      });
    };

    return {
      table,
      filters,
      applyFilters,
      addFilter,
      removeFilter,
      addRow,
    };
  },
});
</script>

<style scoped>
.filters {
  display: grid;
  row-gap: 8px;
  justify-items: flex-end;
}
.buttons {
  display: grid;
  column-gap: 8px;
  grid-template-columns: auto auto;
}
</style>
