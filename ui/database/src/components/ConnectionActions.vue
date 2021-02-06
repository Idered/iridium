<template>
  <div class="container" v-if="table">
    <Button
      :height="24"
      variant="secondary"
      :disabled="!mutations.length"
      title="Commit changes"
      @click="commit"
    >
      Commit
    </Button>
    <Button
      :height="24"
      variant="secondary"
      :disabled="!mutations.length"
      title="Discard changes"
      @click="discardMutations"
    >
      Discard
    </Button>
    <Button :height="24" variant="secondary" @click="$emit('toggleFilters')">
      Filters
      <span v-if="filters.length">({{ filters.length }})</span>
    </Button>
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
import { useDatabaseMutations } from "@/modules/database-mutations";

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
      connection,
      getTableRows,
    } = useDatabase();
    const {
      discardMutations,
      commitMutations,
      mutations,
    } = useDatabaseMutations();
    const columnOptions = computed(() =>
      columns.value?.map((column) => ({
        value: column.name,
        label: column.name,
      }))
    );
    const resetColumns = () => {
      setVisibleColumns(columns.value.map((item) => item.name));
    };
    const commit = async () => {
      await commitMutations(connection.value);
      await getTableRows(table.value!);
      discardMutations();
    };

    return {
      visibleColumns,
      columnOptions,
      resetColumns,
      table,
      filters,
      connection,
      mutations,
      commit,
      discardMutations,
    };
  },
});
</script>

<style scoped>
.container {
  display: grid;
  grid-auto-flow: column;
  column-gap: 8px;
}
</style>
