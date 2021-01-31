<template>
  <div class="row">
    <SelectInput
      v-model="filter.column"
      :options="columnNames"
      close-on-select
      placeholder="Column"
    />
    <SelectInput
      v-model="filter.operator"
      :options="operators"
      close-on-select
      placeholder="Operator"
    />
    <TextInput v-model="filter.value" />
    <Button
      :height="24"
      variant="secondary"
      square
      @click="removeFilter(filter)"
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
      >
        <g fill="currentColor"><path d="M5 11h14v2H5z"></path></g>
      </svg>
    </Button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";
import SelectInput from "@shared/components/SelectInput.vue";
import { DatabaseFilter } from "@/types";
import { DatabaseFilterOperator } from "@/enums";
import { useDatabase } from "@/modules/database";
import TextInput from "@shared/components/TextInput.vue";
import Button from "@shared/components/Button.vue";

export default defineComponent({
  name: "FilterRow",
  components: { SelectInput, TextInput, Button },
  props: {
    filter: {
      type: Object as PropType<DatabaseFilter>,
      required: true,
    },
  },
  setup() {
    const { columns, removeFilter } = useDatabase();
    const columnNames = computed(() => {
      return columns.value.map((item) => item.name);
    });
    const operators = computed(() => {
      return Object.values(DatabaseFilterOperator);
    });
    return {
      columns,
      columnNames,
      operators,
      removeFilter,
    };
  },
});
</script>

<style scoped>
.row {
  display: grid;
  column-gap: 8px;
  grid-template-columns: 1fr 1fr 1fr auto;
}
</style>
