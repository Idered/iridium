import { createMemoryHistory, createRouter, RouteRecordRaw } from "vue-router";

import Index from "@/views/Index.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "",
    name: "Index",
    component: Index,
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
