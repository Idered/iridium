<template>
  <DefaultLayout>
    <BackLayout>
      <template #left>
        <span></span>
      </template>
      <template #title>Connections</template>
      <template #right>
        <button @click="$router.push({ name: 'ConnectionCreate' })">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.0001 7V8H8.00012V14H7.00012V8H1.00012V7H7.00012V1H8.00012V7H14.0001Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </template>
      <div class="view" v-if="connections.length > 0">
        <div class="menu">
          <button
            v-for="connection in connections"
            :key="connection.uuid"
            class="menu__item"
            @click="
              $router.push({
                name: 'Connection',
                params: {
                  uuid: connection.uuid,
                },
              })
            "
          >
            {{ connection.name }}
          </button>
        </div>
      </div>
      <div class="empty" v-if="connections.length === 0 && !loading">
        <h2 class="empty__title">No connections</h2>
        <p class="empty__description">Create connection to access database</p>
        <div>
          <Button @click="$router.push({ name: 'ConnectionCreate' })"
            >Create connection</Button
          >
        </div>
      </div>
    </BackLayout>
  </DefaultLayout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Button from "@shared/components/Button.vue";
import SelectInput from "@shared/components/SelectInput.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import BackLayout from "@/layouts/BackLayout.vue";
import { useDatabase } from "@/modules/database";

export default defineComponent({
  name: "ConnectionList",
  components: { Button, BackLayout, DefaultLayout, SelectInput },
  setup() {
    const { connections, getConnections } = useDatabase();
    const loading = ref(false);

    onMounted(async () => {
      loading.value = true;
      await getConnections();
      loading.value = false;
    });

    return { connections, loading };
  },
});
</script>

<style scoped>
.view {
  padding: 8px;
}

.menu {
  display: grid;
  row-gap: 8px;
}
.menu__item {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 16px;
  align-items: center;
  padding: 12px 16px;
  border-radius: 4px;
  cursor: pointer;
  border: 0;
  background-color: var(--vscode-menu-background);
  color: var(--vscode-menu-foreground);
}
.menu__item:hover {
  color: var(--vscode-tab-activeForeground);
}
.menu__item:focus {
  outline: 0;
}

.empty,
.container {
  display: grid;
  place-content: center;
  text-align: center;
}
.empty__title {
  color: var(--vscode-foreground);
  font-weight: 500;
  font-size: 16px;
}
.empty__description {
  margin-top: 4px;
  margin-bottom: 16px;
}
</style>
