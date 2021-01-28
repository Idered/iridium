<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>

<style>
:root {
  --container-paddding: 16px;
  --input-padding-vertical: 4px;
  --input-padding-horizontal: 4px;
  --input-margin-vertical: 4px;
  --input-margin-horizontal: 0;
}

#app {
  user-select: none;
  max-height: 100vh;
  display: grid;
  grid-template-rows: 1fr;
}

body {
  /* user-select: none; */
  overflow: hidden;
  padding: 0;
  color: var(--vscode-foreground);
  font-size: var(--vscode-font-size);
  font-weight: var(--vscode-font-weight);
  font-family: var(--vscode-font-family);
  background-color: var(--vscode-panel-background);
}

* {
  margin: 0;
}

*,
*::after,
*::before {
  box-sizing: border-box;
}

/* ol,
ul {
  padding-left: var(--container-paddding);
}

body > *,
form > * {
  margin-block-start: var(--input-margin-vertical);
  margin-block-end: var(--input-margin-vertical);
}

*:focus {
  outline-color: var(--vscode-focusBorder) !important;
}

a {
  color: var(--vscode-textLink-foreground);
}

a:hover,
a:active {
  color: var(--vscode-textLink-activeForeground);
}

code {
  font-size: var(--vscode-editor-font-size);
  font-family: var(--vscode-editor-font-family);
}

button {
  border: none;
  padding: var(--input-padding-vertical) var(--input-padding-horizontal);
  width: 100%;
  text-align: center;
  outline: 1px solid transparent;
  outline-offset: 2px !important;
  color: var(--vscode-button-foreground);
  background: var(--vscode-button-background);
}

button:hover {
  cursor: pointer;
  background: var(--vscode-button-hoverBackground);
}

button:focus {
  outline-color: var(--vscode-focusBorder);
}

button.secondary {
  color: var(--vscode-button-secondaryForeground);
  background: var(--vscode-button-secondaryBackground);
}

button.secondary:hover {
  background: var(--vscode-button-secondaryHoverBackground);
}

input:not([type="checkbox"]),
textarea {
  display: block;
  width: 100%;
  border: none;
  font-family: var(--vscode-font-family);
  padding: var(--input-padding-vertical) var(--input-padding-horizontal);
  color: var(--vscode-input-foreground);
  outline-color: var(--vscode-input-border);
  background-color: var(--vscode-input-background);
}

input::placeholder,
textarea::placeholder {
  color: var(--vscode-input-placeholderForeground);
} */

.left-0 {
  left: 0;
}
.z-10 {
  z-index: 10;
}
.z-20 {
  z-index: 20;
}
.z-30 {
  z-index: 30;
}
.sticky {
  position: sticky;
}
.text-right {
  text-align: right;
}
.whitespace-nowrap {
  white-space: nowrap;
}
</style>
