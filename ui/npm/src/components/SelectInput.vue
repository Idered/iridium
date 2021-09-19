<template>
  <div :class="align">
    <VueNextSelect
      :modelValue="modelValue"
      :options="options"
      :value-by="valueBy"
      :label-by="labelBy"
      :maxHeight="maxHeight"
      :close-on-select="closeOnSelect"
      @selected="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script lang="ts">
import VueNextSelect from "vue-next-select";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "SelectInput",
  emits: ["update:modelValue"],
  components: { VueNextSelect },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    closeOnSelect: Boolean,
    maxHeight: Number,
    options: {
      type: Array,
      required: true,
    },
    align: {
      type: String as PropType<"contain" | "bottom-right">,
      default: "contain",
    },
    labelBy: {
      type: String,
    },
    valueBy: {
      type: String,
    },
  },
});
</script>

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
</style>
