<template>
  <div class="group">
    <label
      class="item"
      :class="itemClass"
      v-for="option in options"
      :key="option.value"
    >
      <Checkbox
        type="checkbox"
        :value="option.value"
        :id="option.label"
        :modelValue="modelValue"
        @update:modelValue="handleChange"
      />
      {{ option.label }}
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Checkbox from "./Checkbox.vue";

export default defineComponent({
  name: "CheckboxGroup",
  components: { Checkbox },
  emits: ["update:modelValue"],
  props: {
    options: {
      type: Array as PropType<
        {
          value: string;
          label: string;
        }[]
      >,
      required: false,
      default: () => [],
    },
    name: String,
    modelValue: Array,
    itemClass: String,
  },
  setup(props, { emit }) {
    const handleChange = (e: Event) => {
      emit("update:modelValue", e);
    };
    return { handleChange };
  },
});
</script>

<style scoped>
.item {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  column-gap: 8px;
  cursor: pointer;
}
.item:hover {
  color: var(--vscode-tab-activeForeground);
}
</style>
