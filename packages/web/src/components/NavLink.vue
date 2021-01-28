<template>
  <router-link
    custom
    v-bind="$props"
    :to="to"
    v-slot="{ route, href, navigate }"
  >
    <a
      v-bind="$attrs"
      :href="href"
      @click="navigate"
      :class="$route.path.includes(route.path) ? 'router-link-active' : ''"
      :aria-current="$route.path.includes(route.path) && 'page'"
    >
      <slot />
    </a>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "NavLink",
  props: {
    to: {
      type: String,
    },
  },
});
</script>

<style scoped></style>
