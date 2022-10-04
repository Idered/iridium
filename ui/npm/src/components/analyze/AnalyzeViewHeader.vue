<template>
  <div
    class="grid mt-2"
    :style="{
      gridTemplateColumns: `1fr ${columns.length * 65}px`,
    }"
  >
    <div />
    <div
      class="grid justify-items-end uppercase text-[11px] font-medium"
      :style="{
        gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
      }"
    >
      <TableHeader
        v-if="columns.includes('min')"
        label="Min"
        :type="AnalyzeSortType.Min"
      />
      <TableHeader
        v-if="columns.includes('gzip')"
        label="GZIP"
        :type="AnalyzeSortType.GZIP"
      />
      <TableHeader
        v-if="columns.includes('slow3G')"
        label="Slow 3G"
        :type="AnalyzeSortType.Slow3G"
      />
      <TableHeader
        v-if="columns.includes('slow4G')"
        label="Slow 4G"
        :type="AnalyzeSortType.Slow4G"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useStore } from "../../lib/store";
import { AnalyzeSortType } from "../../enums";
import TableHeader from "./TableHeader.vue";
import { computed } from "vue";
const store = useStore();
const columns = computed(() => store.state.config.analyze.columns);
</script>
