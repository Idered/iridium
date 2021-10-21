<template>
  <div @click="setAnalyzeSort(type)">
    <svg
      :class="{
        'sort-icon': true,
        'sort-icon--asc': order === Order.Ascending,
        'sort-icon--desc': order === Order.Descending,
      }"
      v-if="type === sort"
      width="10"
      height="10"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 5.55973L2.41344 5L13.6067 5L14 5.53925L8.37311 11H7.54622L2 5.55973Z"
        fill="#C5C5C5"
      />
    </svg>
    {{ label }}
  </div>
</template>
<script lang="ts">
import { computed, PropType } from "vue";
import { defineComponent } from "vue";
import { AnalyzeSortType, Order } from "../../enums";
import { useStore } from "../../lib/store";

export default defineComponent({
  name: "TableHeader",
  props: {
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<AnalyzeSortType>,
      required: true,
    },
  },
  setup() {
    const store = useStore();
    return {
      Order,
      sort: computed(() => store.state.analyzeSort),
      order: computed(() => store.state.analyzeOrder),
      setAnalyzeSort: (sortType: AnalyzeSortType) => {
        store.commit("setAnalyzeSort", sortType);
      },
    };
  },
});
</script>
<style scoped>
div {
  display: grid;
  grid-template-columns: auto 1fr;
  white-space: nowrap;
  column-gap: 0.125rem;
  align-items: center;
  cursor: pointer;
}
.sort-icon {
  transition: transform 0.2s ease-in-out;
}
.sort-icon--asc {
  transform: rotate(180deg);
}
</style>
