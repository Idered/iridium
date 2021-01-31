<template>
  <BackLayout>
    <template #title> Create database connection </template>
    <form class="container" @submit.prevent="handleSubmit">
      <div class="field-list">
        <div class="field">
          <label for="name">Connection name</label>
          <TextInput
            v-model="name"
            id="name"
            type="text"
            placeholder="Untitled"
          />
        </div>
        <div class="field">
          <label for="type">Database type</label>
          <SelectInput
            id="name"
            type="text"
            v-model="type"
            close-on-select
            :label-by="(item) => item.label"
            :track-by="(item) => item.value"
            :options="databaseTypes"
          />
        </div>
        <div class="join">
          <div class="field">
            <label for="host">Hostname</label>
            <TextInput
              v-model="host"
              id="host"
              type="text"
              placeholder="localhost"
            />
          </div>
          <div class="field">
            <label for="port">Port</label>
            <TextInput
              v-model="port"
              id="port"
              type="text"
              size="5"
              :placeholder="portPlaceholder"
            />
          </div>
        </div>
        <div class="field">
          <label for="username">Username</label>
          <TextInput v-model="username" id="username" type="text" />
        </div>
        <div class="field">
          <label for="password">Password</label>
          <TextInput v-model="password" id="password" type="text" />
        </div>
        <div class="field">
          <label for="database">Database</label>
          <TextInput v-model="database" id="database" type="text" />
        </div>
      </div>
      <!-- <div class="message" v-if="suggestion">
        NestJS connection has been detected
        <Button type="button" @click="useSuggestion">Use</Button>
      </div> -->
      <div class="actions">
        <Button>Create</Button>
      </div>
    </form>
  </BackLayout>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, toRef, toRefs } from "vue";
import Button from "@shared/components/Button.vue";
import TextInput from "@shared/components/TextInput.vue";
import SelectInput from "@shared/components/SelectInput.vue";
import BackLayout from "@/layouts/BackLayout.vue";
import { DatabaseDriver } from "@/enums";
import router from "@/router";
import { useDatabase } from "@/modules/database";
import { useConnectionModel } from "@/models/connection";
// import { useNest } from "@/modules/nest";
import { DatabaseConnection } from "@/types";

export default defineComponent({
  name: "ConnectionCreate",
  components: { Button, BackLayout, TextInput, SelectInput },
  setup() {
    // const { config, loadConfig } = useNest();
    const { createConnection, clearState } = useDatabase();
    const suggestion = ref<Omit<DatabaseConnection, "uuid"> | null>(null);
    const connection = useConnectionModel();
    const defaultType = ref({
      label: "PostgreSQL",
      value: DatabaseDriver.PostgreSQL,
    });
    const databaseTypes = ref([
      // { label: "MySQL", value: DatabaseDriver.MySQL },
      defaultType.value,
    ]);
    const portPlaceholder = computed(() => {
      const defaultPorts: Record<string, number> = {
        postgres: 5432,
        mysql: 3306,
      };
      return defaultPorts[connection.type.value?.value!];
    });
    connection.type.value = defaultType.value;
    connection.port.value = portPlaceholder.value;

    onMounted(async () => {
      // await loadConfig();
      // if (!config.value?.orm) return;
      // suggestion.value = {
      //   name: config.value.orm?.name,
      //   type: config.value.orm?.type,
      //   host: config.value.orm?.host,
      //   port: config.value.orm?.port,
      //   username: config.value.orm?.username,
      //   password: config.value.orm?.password,
      //   database: config.value.orm?.database,
      // };
    });

    async function handleSubmit() {
      const newConnection = await createConnection(connection.serialize());
      if (newConnection) {
        clearState();
        router.push({
          name: "Connection",
          params: {
            uuid: newConnection.uuid,
          },
        });
      }
    }

    function useSuggestion() {
      connection.type.value = databaseTypes.value.find(
        (item) => item.value === suggestion.value?.type
      )!;
      connection.host.value = suggestion.value?.host!;
      connection.port.value = suggestion.value?.port!;
      connection.username.value = suggestion.value?.username!;
      connection.password.value = suggestion.value?.password!;
      connection.database.value = suggestion.value?.database!;
    }

    return {
      databaseTypes,
      portPlaceholder,
      handleSubmit,
      suggestion,
      useSuggestion,
      ...connection,
    };
  },
});
</script>

<style scoped>
.container {
  margin-left: auto;
  margin-right: auto;
  padding: 8px;
  max-width: 380px;
  width: 100%;
}
.field-list {
  display: grid;
  row-gap: 12px;
}
.field {
  display: grid;
  row-gap: 6px;
}
.join {
  display: grid;
  column-gap: 8px;
  grid-template-columns: 1fr auto;
}
.message {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  border: 1px solid var(--vscode-input-border);
  padding: 8px;
}
.actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
