<template>
  <div class="pagination" v-if="table">
    <div>
      <span>{{ paginationDisplay.total }} rows total</span>
      <span v-if="pagination.total > pagination.perPage"
        >, limited to {{ paginationDisplay.limit }}</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { useDatabase } from "@/modules/database";
import { computed, defineComponent } from "vue";
import Button from "@/components/Button.vue";

export default defineComponent({
  name: "ConnectionPagination",
  components: { Button },
  setup() {
    const db = useDatabase();
    const paginationDisplay = computed(() => {
      const intl = new Intl.NumberFormat("en-US");
      return {
        total: intl.format(db.pagination.value.total),
        limit: intl.format(
          Math.min(
            db.pagination.value.perPage * db.pagination.value.page +
              db.pagination.value.perPage,
            db.pagination.value.total
          )
        ),
      };
    });
    const hasMore = computed(
      () => db.pagination.value.total > db.rows.value.length
    );
    return { ...db, paginationDisplay, hasMore };
  },
});
</script>

<style scoped>
.pagination {
  display: grid;
  align-items: center;
  grid-template-columns: 1fr auto;
}
</style>
