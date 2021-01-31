<template>
  <div class="layout">
    <div class="header">
      <div class="header__item">
        <slot name="left">
          <button @click="$props.to ? $router.push($props.to) : $router.back()">
            <svg
              width="6"
              height="10"
              viewBox="0 0 6 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.928092 4.97603L5.2854 9.33334L4.66668 9.95206L1.43051e-05 5.28539V4.66667L4.66668 3.8147e-06L5.2854 0.618722L0.928092 4.97603Z"
                fill="currentColor"
              />
            </svg>

            <span>Back</span>
          </button>
        </slot>
      </div>
      <div class="header__title">
        <h2><slot name="title"></slot></h2>
      </div>
      <div class="header__item header__item--right">
        <slot name="right" />
      </div>
    </div>
    <slot>
      <router-view />
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BackLayout",
  props: {
    to: {
      type: Object,
    },
  },
});
</script>

<style scoped>
.header {
  display: grid;
  align-items: center;
  grid-template-columns: 86px 1fr 86px;
  border-top: 1px solid var(--vscode-tab-border);
  border-bottom: 1px solid var(--vscode-tab-border);
  min-height: 48px;
  line-height: 16px;
}
.header__title h2 {
  font-weight: normal;
  font-size: 13px;
  text-align: center;
}
.layout {
  display: grid;
  height: 100%;
  overflow: auto;
  grid-template-rows: auto 1fr;
}
</style>

<style>
.header__item button {
  border: 0;
  cursor: pointer;
  padding: 8px 12px;
  color: var(--vscode-panel-foreground);
  background-color: var(--vscode-panel-background);
  justify-content: center;
  align-items: center;
  display: grid;
  grid-auto-flow: column;
  column-gap: 4px;
  font-size: 13px;
}
.header__item button svg {
  margin-right: 8px;
}
.header__item--right {
  display: flex;
  justify-content: flex-end;
}
.header__item button:focus {
  color: var(--vscode-tab-activeForeground);
  outline: 0;
}
.header__item button:hover {
  color: var(--vscode-tab-activeForeground);
}
</style>
