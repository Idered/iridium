<template>
  <div class="analyze-view-header">
    <TableHeader label="Min" :type="AnalyzeSortType.Min" />
    <TableHeader label="GZIP" :type="AnalyzeSortType.GZIP" />
    <TableHeader label="Slow 3G" :type="AnalyzeSortType.Slow3G" />
    <TableHeader label="Slow 4G" :type="AnalyzeSortType.Slow4G" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { AnalyzeSortType } from "../../enums";
import TableHeader from "./TableHeader.vue";

export default defineComponent({
  name: "AnalyzeViewHeader",
  components: {
    TableHeader,
  },
  setup() {
    return {
      AnalyzeSortType,
    };
  },
});
</script>
<style scoped>
.analyze-view-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  margin: 1rem 0 0;
  column-gap: 0.25rem;
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 500;
  justify-items: flex-end;
}
</style>
