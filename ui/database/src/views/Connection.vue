<template>
  <DefaultLayout>
    <BackLayout :to="{ name: 'ConnectionList' }">
      <template #title>
        {{ connection?.name }}
      </template>
      <template #right>
        <button
          title="Edit"
          @click="
            $router.push({
              name: 'ConnectionEdit',
              params: { uuid: connection?.uuid || '' },
            })
          "
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.23 1H11.77L3.52002 9.25L3.35999 9.46997L1 13.59L2.41003 15L6.53003 12.64L6.75 12.48L15 4.22998V2.77002L13.23 1ZM2.41003 13.59L3.92004 10.59L5.37 12.04L2.41003 13.59ZM6.23999 11.53L4.46997 9.76001L12.47 1.76001L14.24 3.53003L6.23999 11.53Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </template>

      <div class="view">
        <ConnectionHeader />
        <div class="view__table" ref="tableContainer">
          <ConnectionData />
        </div>
      </div>
    </BackLayout>
  </DefaultLayout>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { useDatabase } from "@/modules/database";
import { throttle } from "@shared/helpers/throttle";
import Button from "@shared/components/Button.vue";
import SelectInput from "@shared/components/SelectInput.vue";
import ConnectionData from "@/components/ConnectionData.vue";
import BackLayout from "@/layouts/BackLayout.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import ConnectionHeader from "@/components/ConnectionHeader.vue";

export default defineComponent({
  name: "Connection",
  components: {
    Button,
    BackLayout,
    SelectInput,
    DefaultLayout,
    ConnectionData,
    ConnectionHeader,
  },
  setup() {
    const route = useRoute();
    const tableContainer = ref<HTMLDivElement>();
    const db = useDatabase();
    const throttledLoadMore = throttle(() => db.loadMore(), 100);
    const loadMore = (event: any) => {
      let isAtBottom =
        event.target.scrollTop + event.target.offsetHeight >=
        event.target.scrollHeight;
      let hasMore = db.pagination.value.total > db.rows.value.length;
      if (isAtBottom && hasMore) {
        throttledLoadMore();
      }
    };

    onMounted(async () => {
      const connectionUUID = route.params.uuid as string;
      await db.getConnections();
      db.selectConnection(connectionUUID);
      await db.getTables(connectionUUID);

      if (tableContainer.value) {
        tableContainer.value.addEventListener("scroll", loadMore);
      }
    });

    onBeforeUnmount(() => {
      if (tableContainer.value) {
        tableContainer.value.removeEventListener("scroll", loadMore);
      }
    });

    watch(db.table, async (tableName) => {
      db.setVisibleColumns([]);
      db.resetFilters();
      db.resetOrder();
      db.setRows([]);
      db.setColumns([]);

      if (!tableName) return;
      await db.getTableRows(tableName);
      await db.getTableColumns(tableName);
      db.setVisibleColumns(db.columns.value.map((item) => item.name));
      if (tableContainer.value) {
        tableContainer.value.scrollLeft = 0;
      }
    });

    watch(db.order, async () => {
      if (db.table.value) {
        await db.getTableRows(db.table.value);
      }
    });

    return { ...db, tableContainer };
  },
});
</script>

<style scoped>
.view {
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
  row-gap: 8px;
}
.view__table {
  display: grid;
  overflow: auto;
}
</style>
