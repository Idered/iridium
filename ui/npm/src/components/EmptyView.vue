<template>
  <div class="empty">No package.json files found.</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "EmptyView",
});
</script>
<style scoped>
.empty {
  padding: 0.75rem 1.25rem;
}
</style>
