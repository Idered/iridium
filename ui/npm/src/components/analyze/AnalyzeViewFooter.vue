<template>
  <div class="analyze-view-footer">
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
import { PackageSizeInfo } from "../../types";
import { getTimeFromSize } from "../../lib/utils";
import Stat from "../Stat.vue";

export default defineComponent({
  name: "AnalyzeViewFooter",
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
    return { getTimeFromSize, totalMinSize, totalGZIPSize };
  },
});
</script>
<style scoped>
.analyze-view-footer {
  padding: 0.5rem 0.75rem;
  line-height: 22px;
  font-size: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  border-top: 1px solid var(--vscode-panel-border);
}
</style>
