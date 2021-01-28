<template>
  <DefaultLayout>
    <div class="view">
      <div class="loader" v-if="loading">
        <Loader>Loading entities...</Loader>
      </div>
      <div class="list" v-else>
        <Entity v-for="entity in entities" :key="entity.id" :entity="entity" />
      </div>
    </div>
  </DefaultLayout>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, provide, ref } from "vue";
import { useVSCode } from "@/helpers/use-vscode";
import { Actions } from "@/enums";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import Entity from "@/components/Entity.vue";
import Loader from "@/components/Loader.vue";

export default defineComponent({
  components: { Entity, Loader, DefaultLayout },
  name: "Entities",
  setup(props, ctx) {
    const vscode = useVSCode();
    const entities = ref<any[]>([]);
    const loading = ref(true);
    provide("entities", entities);
    onMounted(async () => {
      entities.value = await vscode.fetch<any[]>({ type: Actions.getEntities });
      loading.value = false;
    });

    return {
      loading,
      entities,
    };
  },
});
</script>

<style scoped>
.loader {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}
.view {
  height: 100%;
  grid-template-rows: 1fr;
}
.list {
  display: grid;
  padding: var(--container-paddding);
  row-gap: 24px;
}
</style>
