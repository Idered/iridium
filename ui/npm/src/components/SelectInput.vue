<template>
  <Multiselect
    ref="select"
    :modelValue="modelValue"
    :options="options"
    :canClear="false"
    :canDeselect="false"
    @click.prevent.stop="handleClose"
    @select="$emit('update:modelValue', $event)"
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
          fill="#C5C5C5"
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
  setup() {
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
    return { isOpen, handleClose, select };
  },
});
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
<style>
.caret {
  margin-right: 0.5rem;
}
:root {
  --ms-font-size: var(--vscode-font-size);
  --ms-line-height: 1.231;
  --ms-bg: var(--vscode-input-background);
  --ms-bg-disabled: #f3f4f6;
  --ms-border-color: var(--vscode-input-border);
  --ms-border-width: 1px;
  --ms-radius: 0;
  --ms-py: 0.3125rem;
  --ms-px: 0.75rem;
  --ms-ring-width: -1px;
  --ms-ring-color: var(--vscode-focusBorder);
  --ms-placeholder-color: #9ca3af;
  --ms-max-height: 10rem;

  --ms-spinner-color: #10b981;
  --ms-caret-color: #999999;
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

  --ms-dropdown-bg: var(--vscode-input-background);
  --ms-dropdown-border-color: var(--vscode-input-border);
  --ms-dropdown-border-width: 1px;
  --ms-dropdown-radius: 0;

  --ms-group-label-py: 0.3rem;
  --ms-group-label-px: 0.75rem;
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
  --ms-option-bg-selected: var(--vscode-list-activeSelectionBackground);
  --ms-option-bg-disabled: #ffffff;
  --ms-option-bg-selected-pointed: var(--vscode-list-activeSelectionBackground);
  --ms-option-bg-selected-disabled: #ffffff;
  --ms-option-color-pointed: var(--vscode-list-activeSelectionForeground);
  --ms-option-color-selected: var(--vscode-list-activeSelectionForeground);
  --ms-option-color-disabled: #d1d5db;
  --ms-option-color-selected-pointed: var(--vscode-list-focusForeground);
  --ms-option-color-selected-disabled: #d1fae5;
  --ms-option-py: 0.225rem;
  --ms-option-px: 0.75rem;

  --ms-empty-color: #4b5563;
}
.multiselect {
  justify-content: space-between;
}
.multiselect-dropdown {
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
}
</style>
<!-- 
<style>
.icon.delete {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  height: 8px;
  width: 8px;
  min-height: 8px;
  min-width: 8px;
  max-height: 8px;
  max-width: 8px;
  cursor: pointer;
}

.icon.arrow-downward {
  position: relative;
  display: block;
  width: 22px;
  height: 22px;
  transform: scale(0.7);
  border: 2px solid transparent;
  border-radius: 100px;
}
.icon.arrow-downward::after {
  content: "";
  display: block;
  position: absolute;
  width: 8px;
  height: 8px;
  border-bottom: 2px solid;
  border-right: 2px solid;
  transform: rotate(45deg);
  left: 4px;
  top: 2px;
  transition: transform 0.2s linear;
  cursor: pointer;
}

.vue-select {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  border: 1px solid var(--vscode-input-border);
  box-sizing: border-box;
  outline: none;
}

.vue-select[data-is-focusing="true"]:not([data-visible-length="0"]) {
  outline: 0;
  border-color: var(--vscode-focusBorder);
}

.vue-select.disabled {
  background-color: rgba(239, 239, 239);
}

.vue-select.disabled * {
  cursor: not-allowed;
}

.vue-select-header {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  background: var(--vscode-input-background);
}

.vue-select-header > .icon.loading,
.vue-select-header > .icon.arrow-downward {
  margin-right: 4px;
}

.vue-tags {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 2px;
  min-height: calc(1rem + 4px);
  user-select: none;
}

.vue-tags.collapsed {
  flex-wrap: nowrap;
  overflow: auto;
}

.vue-tag {
  display: none;
  align-items: center;
  justify-content: center;
  list-style-type: none;
  border-radius: 4px;
  background-color: #999;
  padding: 0 4px;
  margin: 2px;
  min-height: 1rem;
  font-size: 0.8rem;
}

.vue-tag > span {
  margin-right: 4px;
}

.vue-tag.selected {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #999;
  border-radius: 4px;
  padding: 0 4px;
  font-size: 0.8rem;
}

.vue-input {
  display: flex;
  align-items: center;
  border-radius: 4px;
  border: none;
  outline: none;
  max-width: 100%;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
  background: transparent;
  padding: 4px 4px;
}

.vue-input > input {
  border: none;
  outline: none;
  background: none;
  width: 100%;
  min-width: 0;
  font-size: 13px;
  height: 18px;
  line-height: 18px;
  font-family: inherit;
  padding: 0;
}

.vue-input > input::placeholder {
  color: var(--vscode-input-placeholderForeground);
}

.vue-input > input[disabled] {
  background-color: rgba(239, 239, 239);
}

.vue-input > input[readonly] {
  cursor: default;
}

.vue-select-header > .vue-input > input[disabled] {
  background-color: unset;
}

.vue-dropdown {
  display: none;
  position: absolute;
  background: var(--vscode-input-background);
  z-index: 40;
  overflow-y: auto;
  top: 100% !important;
  left: -1px;
  min-width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  border: 1px solid var(--vscode-focusBorder);
  list-style-type: none;
}

.vue-select[aria-expanded="true"] .vue-dropdown {
  display: block;
}

.contain .vue-dropdown {
  left: -1px;
  right: -1px;
}

.bottom-right {
  position: relative;
}
.bottom-right .vue-dropdown {
  right: -1px;
}

.vue-dropdown[data-visible-length="0"] {
  border: none;
}

.vue-dropdown-item {
  list-style-type: none;
  line-height: 1.25;
  padding: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.vue-dropdown-item:last-child {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

.vue-dropdown-item:hover,
.vue-dropdown-item.selected,
.vue-dropdown-item.selected:hover {
  background-color: var(--vscode-inputOption-activeBackground);
  color: var(--vscode-inputOption-activeForeground);
}

.icon.loading {
  display: inline-block;
  position: relative;
  width: 8px;
  min-width: 8px;
  height: 8px;
  min-height: 8px;
}

.icon.loading div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  border: 1px solid #999;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: loading 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #999 transparent transparent transparent;
}

.icon.loading div:nth-child(1) {
  animation-delay: -0.08s;
}
.icon.loading div:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style> -->
