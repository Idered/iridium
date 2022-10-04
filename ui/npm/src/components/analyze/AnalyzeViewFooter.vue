<template>
  <div
    class="px-3 py-2 grid text-xs border-t mt-2 border-t-[color:var(--vscode-panel-border)]"
    :style="{
      gridTemplateColumns: `1fr ${columns.length * 65}px`,
    }"
  >
    <div></div>
    <div
      class="grid"
      :style="{
        gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
      }"
    >
      <Stat
        v-if="columns.includes('min')"
        :value="totalMinSize"
        type="size"
        label="Min"
      />
      <Stat
        v-if="columns.includes('gzip')"
        :value="totalGZIPSize"
        type="size"
        label="Min + GZIP"
      />
      <Stat
        v-if="columns.includes('slow3G')"
        :value="getTimeFromSize(totalGZIPSize).slow3G"
        type="time"
        label="Slow 3G"
      />
      <Stat
        v-if="columns.includes('slow4G')"
        :value="getTimeFromSize(totalGZIPSize).slow4G"
        type="time"
        label="Slow 4G"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue";
import { PackageSizeInfo } from "../../types";
import { getTimeFromSize } from "../../lib/utils";
import Stat from "../Stat.vue";
import { useStore } from "../../lib/store";
const store = useStore();
const columns = computed(() => store.state.config.analyze.columns);

const props = defineProps({
  sizeInfo: {
    type: Object as PropType<Record<string, PackageSizeInfo>>,
    required: true,
  },
});

const totalMinSize = computed(() => {
  return Object.values(props.sizeInfo).reduce(
    (total, item) => total + item.size,
    0
  );
});

const totalGZIPSize = computed(() => {
  return Object.values(props.sizeInfo).reduce(
    (total, item) => total + item.gzip,
    0
  );
});
</script>
