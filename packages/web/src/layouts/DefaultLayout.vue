<template>
  <div class="layout">
    <Nav class="layout__nav" />
    <div class="layout__view">
      <slot>
        <router-view />
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Nav from "@/components/Nav.vue";

export default defineComponent({
  name: "DefaultLayout",
  components: { Nav },
});
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
}
.layout__view {
  overflow: auto;
  display: grid;
}
</style>
