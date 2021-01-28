<template>
  <div>
    <h2 class="title">{{ $props.entity.name }}</h2>
    <div class="properties">
      <EntityProperty
        v-for="(property, propertyName) in $props.entity.properties"
        :property="property"
        :name="propertyName"
        :entity="$props.entity"
        :key="property.id"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import EntityProperty from "./EntityProperty.vue";

export default defineComponent({
  components: { EntityProperty },
  name: "Entity",
  props: {
    entity: Object as any,
  },
});
</script>

<style scoped>
.title {
  font-size: 14px;
  font-weight: bold;
  margin: 0;
}
</style>
