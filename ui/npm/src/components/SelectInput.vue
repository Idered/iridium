<template>
  <Multiselect
    ref="select"
    :modelValue="modelValue"
    :options="options"
    :canClear="false"
    :canDeselect="false"
    @blur="isOpen = false"
    @select="handleSelect"
  >
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
import Multiselect from "@vueform/multiselect";
import { defineComponent, PropType, ref } from "vue";

export default defineComponent({
  name: "SelectInput",
  emits: ["update:modelValue"],
  components: { Multiselect },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    options: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  setup(_props, { emit }) {
    const select = ref<any>();
    const isOpen = ref(false);
    const handleClose = () => {
      isOpen.value = !isOpen.value;
      if (isOpen.value) {
        select.value?.open();
      } else {
        select.value?.close();
      }
    };
    const handleSelect = (event: Event) => {
      isOpen.value = false;
      emit("update:modelValue", event);
    };
    return { isOpen, handleClose, select, handleSelect };
  },
});
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
<style>
.caret {
  margin-right: 0.5rem;
  margin-left: 0.5rem;
}
:root {
  --ms-font-size: var(--vscode-font-size);
  --ms-line-height: 1.231;
  --ms-bg: var(--vscode-settings-dropdownBackground);
  --ms-bg-disabled: #f3f4f6;
  --ms-border-color: var(--vscode-settings-dropdownBorder);
  --ms-border-width: 1px;
  --ms-radius: 0;
  --ms-py: 0.25rem;
  --ms-px: 0.5rem;
  --ms-ring-width: -1px;
  --ms-ring-color: var(--vscode-focusBorder);
  --ms-placeholder-color: #9ca3af;
  --ms-max-height: 10rem;

  --ms-spinner-color: #10b981;
  --ms-caret-color: var(--vscode-foreground);
  --ms-clear-color: #999999;
  --ms-clear-color-hover: #000000;

  --ms-tag-font-size: var(--vscode-font-size);
  --ms-tag-line-height: 1.25rem;
  --ms-tag-font-weight: 600;
  --ms-tag-bg: #10b981;
  --ms-tag-bg-disabled: #9ca3af;
  --ms-tag-color: #ffffff;
  --ms-tag-color-disabled: #ffffff;
  --ms-tag-radius: 4px;
  --ms-tag-py: 0.125rem;
  --ms-tag-px: 0.5rem;
  --ms-tag-my: 0.25rem;
  --ms-tag-mx: 0.25rem;

  --ms-tag-remove-radius: 4px;
  --ms-tag-remove-py: 0.25rem;
  --ms-tag-remove-px: 0.25rem;
  --ms-tag-remove-my: 0rem;
  --ms-tag-remove-mx: 0.125rem;

  --ms-dropdown-bg: var(--vscode-dropdown-listBackground);
  --ms-dropdown-border-color: var(--vscode-dropdown-border);
  --ms-dropdown-border-width: 1px;
  --ms-dropdown-radius: 0;

  --ms-group-label-py: 0.3rem;
  --ms-group-label-px: 0.5rem;
  --ms-group-label-line-height: 1.375;
  --ms-group-label-bg-pointed: #d1d5db;
  --ms-group-label-color-pointed: #374151;
  --ms-group-label-bg-disabled: #f3f4f6;
  --ms-group-label-color-disabled: #d1d5db;
  --ms-group-label-bg-selected: #059669;
  --ms-group-label-color-selected: #ffffff;
  --ms-group-label-bg-selected-pointed: #0c9e70;
  --ms-group-label-color-selected-pointed: #ffffff;
  --ms-group-label-bg-selected-disabled: #75cfb1;
  --ms-group-label-color-selected-disabled: #d1fae5;

  --ms-option-font-size: var(--vscode-font-size);
  --ms-option-line-height: 1;
  --ms-option-bg-pointed: var(--vscode-list-activeSelectionBackground);
  --ms-option-bg-selected: transparent;
  --ms-option-bg-disabled: #ffffff;
  --ms-option-bg-selected-pointed: var(--vscode-list-activeSelectionBackground);
  --ms-option-bg-selected-disabled: #ffffff;
  --ms-option-color-pointed: var(--vscode-list-activeSelectionForeground);
  --ms-option-color-selected: var(--vscode-quickInput-foreground);
  --ms-option-color-disabled: #1b1c1d;
  --ms-option-color-selected-pointed: var(--vscode-list-focusForeground);
  --ms-option-color-selected-disabled: #d1fae5;
  --ms-option-py: 0.225rem;
  --ms-option-px: 0.5rem;

  --ms-empty-color: #4b5563;
}
.multiselect {
  display: grid;
  grid-template-columns: 1fr auto;
  align-content: center;
}
.multiselect.is-open {
  border-color: var(--vscode-focusBorder);
}
.multiselect.is-open .multiselect-dropdown {
  border-color: var(--vscode-focusBorder);
}
.multiselect-dropdown {
  padding: 1px;
  transform: none;
  bottom: auto;
  top: 100%;
  transform: translateY(2px);
  overflow-y: auto;
  z-index: 110;
}
.multiselect-single-label {
  position: relative;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.multiselect-option {
  white-space: nowrap;
  border: 1px solid transparent;
}
.multiselect-option.is-selected {
  white-space: nowrap;
}
.multiselect-option.is-pointed {
  white-space: nowrap;
  border-color: var(--vscode-focusBorder);
}
</style>
