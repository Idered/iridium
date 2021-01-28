<template>
  <BackLayout>
    <template #title>Edit database connection</template>
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
      <div class="actions">
        <Button variant="negative" type="button" @click="handleDelete"
          >Delete</Button
        >
        <Button>Save</Button>
      </div>
      <div
        class="message"
        v-if="isMessageVisible"
        v-delay="1500"
        :callback="dismissMessage"
      >
        Connection was updated
      </div>
    </form>
  </BackLayout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import Button from "@/components/Button.vue";
import TextInput from "@/components/TextInput.vue";
import SelectInput from "@/components/SelectInput.vue";
import BackLayout from "@/layouts/BackLayout.vue";
import { DatabaseDriver } from "@/enums";
import { useDatabase } from "@/modules/database";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "ConenctionEdit",
  components: { Button, BackLayout, TextInput, SelectInput },
  setup() {
    const router = useRouter();
    const { updateConnection, deleteConnection, connection } = useDatabase();
    const defaultType = ref({
      label: "PostgreSQL",
      value: DatabaseDriver.PostgreSQL,
    });
    const databaseTypes = ref([
      { label: "MySQL", value: DatabaseDriver.MySQL },
      defaultType.value,
    ]);
    const connectionType = databaseTypes.value.find(
      (item) => item.value === (connection.value?.type as DatabaseDriver)
    )!;
    const name = ref(connection.value?.name);
    const type = ref(connectionType);
    const host = ref(connection.value?.host);
    const username = ref(connection.value?.username);
    const password = ref(connection.value?.password);
    const database = ref(connection.value?.database);
    const portPlaceholder = computed(() => {
      const defaultPorts: Record<string, number> = {
        postgres: 5432,
        mysql: 3306,
      };
      return defaultPorts[type.value?.value];
    });
    const port = ref();

    async function handleSubmit() {
      await updateConnection({
        uuid: connection.value?.uuid,
        name: name.value,
        type: type.value.value,
        host: host.value,
        port: port.value,
        username: username.value,
        password: password.value,
        database: database.value,
      });
      isMessageVisible.value = true;
    }

    const isMessageVisible = ref(false);
    const dismissMessage = () => {
      isMessageVisible.value = false;
    };

    const handleDelete = () => {
      deleteConnection(connection.value?.uuid);
      router.push({ name: "DatabaseConnectionList" });
    };

    return {
      type,
      databaseTypes,
      portPlaceholder,
      name,
      host,
      port,
      username,
      password,
      connection,
      database,
      handleSubmit,
      handleDelete,
      isMessageVisible,
      dismissMessage,
    };
  },
});
</script>

<style scoped>
.container {
  margin-left: auto;
  margin-right: auto;
  padding: var(--container-paddding);
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
  justify-content: space-between;
}
</style>
