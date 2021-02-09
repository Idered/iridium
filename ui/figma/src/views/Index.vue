<template>
  <div>
    <Button @click="load">Test</Button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useVSCode } from "@/utils/use-vscode";
import Button from "@shared/components/Button.vue";

export default defineComponent({
  components: { Button },
  name: "index",
  setup() {
    const vscode = useVSCode();
    const load = async () => {
      const team = await vscode.fetch.post("/teams", { id: "random id" });
      const figma = await vscode.fetch.post("/figma", { id: "random id" });
      console.log(team);
    };
    return { load };
  },
});
</script>

<style scoped></style>
