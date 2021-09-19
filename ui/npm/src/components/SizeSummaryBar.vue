<template>
  <div class="size-summary-bar">
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
<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { PackageSizeInfo } from "../types";
import { getTimeFromSize } from "../utils";
import Stat from "./Stat.vue";

export default defineComponent({
  name: "SizeSummaryBar",
  components: { Stat },
  props: {
    sizeInfo: {
      type: Object as PropType<Record<string, PackageSizeInfo>>,
      required: true,
    },
  },
  setup(props) {
    const totalMinSize = computed(() => {
      return Object.values(props.sizeInfo).reduce(
        (total, item) => total + (item.isDevDependency ? 0 : item.size || 0),
        0
      );
    });
    const totalGZIPSize = computed(() => {
      return Object.values(props.sizeInfo).reduce(
        (total, item) => total + (item.isDevDependency ? 0 : item.gzip || 0),
        0
      );
    });
    return { getTimeFromSize, totalMinSize, totalGZIPSize };
  },
});
</script>
<style scoped>
.size-summary-bar {
  padding: 0.5rem 0.75rem;
  line-height: 22px;
  font-size: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  border-top: 1px solid var(--vscode-panel-border);
}
</style>
