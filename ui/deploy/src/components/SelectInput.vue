<template>
  <Multiselect
    :modelValue="modelValue"
    :options="options"
    :can-clear="false"
    :searchable="true"
    :allow-empty="false"
    :max-height="200"
    label="name"
    track-by="value"
    @select="handleSelect"
  >
    <template #singleLabel="{ option }">
      {{ option.name || option }}
    </template>
    <template #option="{ option }">
      {{ option.name || option }}
    </template>
    <template #noResult>
      <div>No elements found.</div>
    </template>
    <template #caret>
      <svg
        class="caret"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M7.97612 10.0719L12.3334 5.7146L12.9521 6.33332L8.28548 11L7.66676 11L3.0001 6.33332L3.61882 5.7146L7.97612 10.0719Z"
          fill="currentColor"
        />
      </svg>
    </template>
  </Multiselect>
</template>

<script lang="ts">
import Multiselect from "vue-multiselect";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "SelectInput",
  emits: ["update:modelValue"],
  components: { Multiselect },
  props: {
    modelValue: {
      type: [String, Object],
    },
    options: {
      type: Array as PropType<
        | string[]
        | {
            value: string;
            name: string;
          }[]
      >,
      required: true,
    },
  },
  setup(_props, { emit }) {
    const handleSelect = (
      option:
        | string
        | {
            value: string;
            name: string;
          }
    ) => {
      emit("update:modelValue", option);
    };
    return { handleSelect };
  },
});
</script>

<style>
.multiselect {
  background-color: var(--vscode-settings-dropdownBackground);
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas: "tags caret";
  border: 1px solid var(--vscode-settings-dropdownBorder);
  min-height: 26px;
  align-items: center;
  padding-left: 0.5rem;
  position: relative;
}
.multiselect--active {
  border-color: var(--vscode-focusBorder);
}
.caret {
  grid-area: caret;
  margin: 0 0.5rem;
}
.multiselect__tags {
  grid-area: tags;
}
.multiselect__content-wrapper {
  position: absolute;
  display: block;
  left: -1px;
  right: -1px;
  overflow: auto;
  z-index: 50;
  top: 100%;
  padding: 1px;
  margin-top: 1px;
  background-color: var(--vscode-dropdown-listBackground);
  border: 1px solid var(--vscode-focusBorder);
}
.multiselect__content {
  list-style: none;
  display: inline-block;
  padding: 0;
  margin: 0;
  min-width: 100%;
  vertical-align: top;
}
.multiselect__input {
  background: transparent;
  color: inherit;
  border: none;
  font-family: inherit;
}
.multiselect__input:focus {
  outline: transparent;
}
.multiselect__element {
  display: block;
}
.multiselect__option {
  line-height: 1;
  display: block;
  padding: 0.225rem 0.5rem;
  white-space: nowrap;
  border: 1px solid transparent;
  cursor: pointer;
  display: flex;
  box-sizing: border-box;
  text-decoration: none;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
}
.multiselect__option--highlight {
  border-color: var(--vscode-focusBorder);
  background: var(--vscode-list-activeSelectionBackground);
  color: var(--vscode-list-activeSelectionForeground);
}
.multiselect__option--selected {
  color: var(--vscode-quickInput-foreground);
}
.multiselect__option--highlight.multiselect__option--selected {
  color: var(--vscode-list-focusForeground);
  background-color: var(--vscode-list-activeSelectionBackground);
}
</style>
