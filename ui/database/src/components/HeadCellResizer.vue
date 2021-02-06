<template>
  <div class="resizer" ref="resizer" @click.stop />
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, Ref, ref } from "vue";

export default defineComponent({
  name: "HeadCellResizer",
  props: {
    col: Object as PropType<HTMLTableHeaderCellElement>,
  },
  setup({ col }) {
    const resizer = ref<HTMLDivElement | null>(null);
    const x = ref(0);
    const w = ref(0);
    const mouseDownHandler = function (e) {
      // Get the current mouse position
      x.value = e.clientX;
      // Calculate the current width of column
      const styles = window.getComputedStyle(resizer.value?.parentElement);
      w.value = parseInt(styles.width, 10);
      // Attach listeners for document's events
      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
      // Determine how far the mouse has been moved
      const dx = e.clientX - x.value;
      const sum = w.value + dx;
      // Update the width of column
      resizer.value.parentElement.style.width = `${sum > 40 ? sum : 40}px`;
    };

    const mouseUpHandler = function () {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };

    onMounted(() => {
      resizer.value.addEventListener("mousedown", mouseDownHandler);
    });

    return { resizer };
  },
});
</script>

<style scoped>
.resizer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 5px;
  cursor: col-resize;
  user-select: none;
}
</style>
