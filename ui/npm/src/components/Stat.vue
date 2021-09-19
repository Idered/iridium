<template>
  <div class="stat">
    <span>{{ value }}</span> <span>{{ unit }}</span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { formatSize, formatTime } from "../utils";
export default defineComponent({
  name: "Stat",
  props: {
    type: {
      type: String as PropType<"size" | "time">,
    },
    label: {
      type: String,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const value = computed(() => {
      return props.type === "size"
        ? parseFloat(formatSize(props.value).size.toFixed(1))
        : parseFloat(formatTime(props.value).size.toFixed(2));
    });
    const unit = computed(() => {
      return props.type === "size"
        ? formatSize(props.value).unit
        : formatTime(props.value).unit;
    });

    return { value, unit };
  },
});
</script>

<style scoped>
.stat {
  text-align: right;
  line-height: 1;
}
</style>
