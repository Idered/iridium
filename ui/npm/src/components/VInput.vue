<template>
  <input
    class="w-full input h-[26px] px-2"
    autocomplete="off"
    spellcheck="false"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<script setup lang="ts">
defineEmits(["update:modelValue"]);
defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
});
</script>

<style scoped>
.input {
  font-size: var(--vscode-font-size);
  background: var(--vscode-settings-textInputBackground);
  border: 1px solid
    var(
      --vscode-settings-textInputBorder,
      var(--vscode-settings-textInputBackground)
    );
  color: var(--vscode-settings-textInputForeground);
}
</style>
