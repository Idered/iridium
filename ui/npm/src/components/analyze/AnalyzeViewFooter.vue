<template>
  <div
    class="grid-cols-4 px-3 py-2 grid text-xs border-t mt-2 border-t-[color:var(--vscode-panel-border)]"
  >
    <Stat :value="totalMinSize" type="size" label="Min" />
    <Stat :value="totalGZIPSize" type="size" label="Min + GZIP" />
    <Stat
      :value="getTimeFromSize(totalGZIPSize).slow3G"
      type="time"
      label="Slow 3G"
    />
    <Stat
      :value="getTimeFromSize(totalGZIPSize).slow4G"
      type="time"
      label="Slow 4G"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue";
import { PackageSizeInfo } from "../../types";
import { getTimeFromSize } from "../../lib/utils";
import Stat from "../Stat.vue";

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
