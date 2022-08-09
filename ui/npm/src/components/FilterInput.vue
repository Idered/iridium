<script setup lang="ts">
import { useStore } from "../lib/store";

const store = useStore();
</script>

<template>
  <label
    class="search-input"
    :class="{
      'flex-auto': store.state.filterInputIsFocused || store.state.filterQuery,
    }"
  >
    <input
      class="focus:w-full"
      :class="{
        'w-0': !store.state.filterQuery,
        'w-full': store.state.filterQuery,
      }"
      :value="store.state.filterQuery"
      @input="store.commit('setFilterQuery', ($event.currentTarget as HTMLInputElement).value)"
      @focus="store.commit('setFilterInputIsFocused', true)"
      @blur="store.commit('setFilterInputIsFocused', false)"
      @keydown.esc="store.commit('setFilterQuery', '')"
      type="text"
      placeholder="Filter..."
    />
    <svg
      v-if="!store.state.filterQuery"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
      class="flex-shrink-0"
      width="16"
      height="16"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 16 16"
    >
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M15 2v1.67l-5 4.759V14H6V8.429l-5-4.76V2h14zM7 8v5h2V8l5-4.76V3H2v.24L7 8z"
        clip-rule="evenodd"
      ></path>
    </svg>
    <button
      v-else
      @click="store.commit('setFilterQuery', '')"
      class="focus:outline-1 focus:outline focus:outline-[color:var(--vscode-focusBorder)]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        class="flex-shrink-0"
        width="24"
        height="24"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 16 16"
      >
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="m8 8.707l3.646 3.647l.708-.707L8.707 8l3.647-3.646l-.707-.708L8 7.293L4.354 3.646l-.707.708L7.293 8l-3.646 3.646l.707.708L8 8.707z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </button>
  </label>
</template>

<style scoped>
.search-input {
  display: flex;
  padding: 0 0.5rem;
  align-items: center;
  font-size: var(--vscode-font-size);
  background: var(--vscode-settings-textInputBackground);
  border: 1px solid
    var(
      --vscode-settings-textInputBorder,
      var(--vscode-settings-textInputBackground)
    );
}
.search-input:focus-within {
  border-color: var(--vscode-focusBorder);
}
.search-input svg {
  width: 16px;
}
.search-input input {
  color: var(--vscode-settings-textInputForeground);
  border: 0;
  background: none;
  -webkit-appearance: none;
  appearance: none;
  height: 24px;
  color: inherit;
}
.search-input input::placeholder {
  color: var(--vscode-input-placeholderForeground);
}
.search-input input:focus {
  outline: none;
}
.search-input:focus-within {
  border-color: var(--vscode-focusBorder);
}
</style>
