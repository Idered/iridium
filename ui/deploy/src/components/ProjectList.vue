<template>
  <ul class="project-list">
    <li
      class="project-list__item"
      v-for="project in projects"
      :key="project.id"
      @click="$emit('select', project.id)"
    >
      {{ project.name }}
    </li>
  </ul>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "ProjectList",
  emits: ["select"],
  props: {
    projects: {
      type: Array as PropType<{ id: string; name: string }[]>,
      default: () => [],
    },
  },
});
</script>
<style scoped>
.project-list {
  list-style: none;
  padding: 0;
  display: grid;
}
.project-list__item {
  padding: 0.25rem 0;
  cursor: pointer;
}
</style>
