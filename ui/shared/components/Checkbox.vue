<template>
  <div class="container" :class="$attrs.class">
    <input
      class="input"
      type="checkbox"
      v-bind="$attrs"
      :value="value"
      :checked="checked"
      @input="onChange"
    />
    <span class="substitute">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        class="icon"
        v-if="checked"
      >
        <g fill="currentColor">
          <path
            d="M6.61 11.89L3.5 8.78 2.44 9.84 6.61 14l8.95-8.95L14.5 4z"
          ></path>
        </g>
      </svg>
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "Checkbox",
  props: ["modelValue", "value"],
  emits: ["update:modelValue"],
  data() {
    return {
      checked: false,
    };
  },
  setup(props, { emit }) {
    const checked = computed(() => props.modelValue.includes(props.value));
    const onChange = (e: Event) => {
      let currentValue = [...props.modelValue];
      const target = e.target as HTMLInputElement;
      if (target?.checked) {
        currentValue.push(target.value);
      } else {
        currentValue = currentValue.filter((item) => item !== target.value);
      }
      emit("update:modelValue", currentValue);
    };
    return { checked, onChange };
  },
});
</script>

<style scoped>
.input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  border: 0;
}
.substitute {
  border: 1px solid var(--vscode-checkbox-border);
  background: 1px solid var(--vscode-checkbox-background);
  width: 16px;
  height: 16px;
  padding: 8px;
  border-radius: 3px;
  display: grid;
  justify-content: center;
  align-content: center;
}
.icon {
}
</style>
