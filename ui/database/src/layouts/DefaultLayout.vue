<template>
  <div class="layout">
    <slot>
      <router-view />
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DefaultLayout",
});
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-rows: 1fr;
  height: 100vh;
  overflow: auto;
}
</style>
