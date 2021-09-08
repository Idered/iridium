<template>
  <div>
    <div>Hello1</div>
    <Button :height="24" variant="secondary" title="Discard changes">
      Discard
    </Button>
    <div>Hello2</div>
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
      try {
        const team = await vscode.fetch.post("/teams", { id: "random id" });
        const figma = await vscode.fetch.post("/figma", { id: "random id" });
        console.log({ team, figma });
      } catch (err) {
        console.log(err);
      }
    };
    return { load };
  },
});
</script>

<style scoped></style>
