<template>
  <div class="header" :class="{ showFilters }">
    <div class="select">
      <SelectInput
        v-model="table"
        :options="tables"
        close-on-select
        placeholder="Select table"
      />
      <Button
        variant="secondary"
        :height="24"
        :title="
          liveMode ? 'Disable real-time updates' : 'Enable real-time updates'
        "
        square
        :disabled="!table"
        @click="toggleLiveMode"
        ><svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            class="live-mode-on"
            v-if="liveMode"
            d="M4.50024 2.99988L6.00024 2.99988V12.9999H4.50024V2.99988ZM11.5002 2.99988V12.9999H10.0002V2.99988L11.5002 2.99988Z"
          />
          <path
            v-else
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.00024 2V14.4805L12.9149 8.24024L4.00024 2ZM11.1812 8.24024L4.99524 12.5684V3.91209L11.1812 8.24024Z"
            fill="currentColor"
          />
        </svg>
      </Button>
      <Button
        variant="secondary"
        :height="24"
        title="Refresh"
        square
        @click="refresh"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M5.56253 2.51577C3.46348 3.4501 2 5.55414 2 7.99999C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 7.99999C14 5.32519 12.2497 3.05919 9.83199 2.28482L9.52968 3.23832C11.5429 3.88454 13 5.7721 13 7.99999C13 10.7614 10.7614 13 8 13C5.23858 13 3 10.7614 3 7.99999C3 6.31104 3.83742 4.81767 5.11969 3.91245L5.56253 2.51577Z"
            fill="currentColor"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M5 3H2V2H5.5L6 2.5V6H5V3Z"
            fill="currentColor"
          />
        </svg>
      </Button>
    </div>
    <ConnectionFilters class="filters" v-if="showFilters" />
    <ConnectionActions class="actions" @toggleFilters="toggleFilters" />
  </div>
</template>

<script lang="ts">
import { DatabaseFilterOperator } from "@/enums";
import { useDatabase } from "@/modules/database";
import { v4 } from "uuid";
import { defineComponent, ref, watch } from "vue";
import Button from "@shared/components/Button.vue";
import SelectInput from "@shared/components/SelectInput.vue";
import ConnectionActions from "./ConnectionActions.vue";
import ConnectionFilters from "./ConnectionFilters.vue";

export default defineComponent({
  components: {
    ConnectionActions,
    ConnectionFilters,
    SelectInput,
    Button,
  },
  name: "ConnectionHeader",
  setup() {
    const db = useDatabase();
    const showFilters = ref(false);
    const liveMode = ref(false);
    const liveModeTimer = ref<NodeJS.Timeout | null>(null);
    const toggleFilters = () => {
      if (showFilters.value === false && db.filters.value.length === 0) {
        db.addFilter({
          uuid: v4(),
          active: true,
          column: db.columns.value[0].name,
          operator: DatabaseFilterOperator.EQUAL,
          value: "",
        });
      }
      showFilters.value = !showFilters.value;
    };

    const toggleLiveMode = () => {
      liveMode.value = !liveMode.value;
    };

    const refetch = async () => {
      if (db.table.value) {
        await db.getTableRows(db.table.value);
      }
    };

    // Hide filters when last filter row is removed
    watch(db.filters, () => {
      if (db.filters.value.length === 0) {
        showFilters.value = false;
      }
    });

    // Clear filters on table change
    watch(db.table, () => {
      showFilters.value = false;
      liveMode.value = false;
      if (liveModeTimer.value) {
        clearInterval(liveModeTimer.value);
      }
    });

    watch(liveMode, () => {
      if (liveMode.value) {
        liveModeTimer.value = setInterval(() => {
          refetch();
        }, 1000);
      } else if (liveModeTimer.value) {
        clearInterval(liveModeTimer.value);
      }
    });

    return {
      ...db,
      toggleFilters,
      liveMode,
      toggleLiveMode,
      showFilters,
    };
  },
});
</script>

<style scoped>
.header {
  padding: 8px;
  z-index: 30;
  position: sticky;
  display: grid;
  top: 0;
  row-gap: 8px;
  font-size: 12px;
  padding-bottom: 0;
  background: var(--vscode-panel-background);
  grid-template-areas: "select select" "pagination actions";
  grid-template-columns: 1fr auto;
}
.header.showFilters {
  grid-template-areas: "select select" "filters filters" "pagination actions";
}
.select {
  grid-area: select;
  display: grid;
  grid-template-columns: 1fr auto auto;
  column-gap: 8px;
}
.pagination {
  grid-area: pagination;
}
.actions {
  grid-area: actions;
}
.filters {
  grid-area: filters;
}
.live-mode-on {
  fill: var(--vscode-textLink-foreground);
}
</style>
