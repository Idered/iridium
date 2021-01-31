<template>
  <table class="table" cellSpacing="0" v-if="columns">
    <thead>
      <tr>
        <HeadCell
          class="table__th"
          v-for="column in displayColumns"
          :column="column"
          :key="column.name"
        />
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.id">
        <Cell
          class="table__td"
          v-for="column in displayColumns"
          :row="row"
          :column="column"
          :key="column.name"
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
.table {
  width: 100%;
  overflow: auto;
}
.table__th:last-child {
  border-right-width: 0;
}
.table__td:last-child {
  border-right-width: 0;
}
</style>
