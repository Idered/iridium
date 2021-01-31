import { createMemoryHistory, createRouter, RouteRecordRaw } from "vue-router";

import Connection from "@/views/Connection.vue";
import ConnectionCreate from "@/views/ConnectionCreate.vue";
import ConnectionEdit from "@/views/ConnectionEdit.vue";
import ConnectionList from "@/views/ConnectionList.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "",
    name: "ConnectionList",
    component: ConnectionList,
  },
  {
    path: "/create",
    name: "ConnectionCreate",
    component: ConnectionCreate,
  },
  {
    path: "/:uuid",
    name: "Connection",
    component: Connection,
  },
  {
    path: "/:uuid/edit",
    name: "ConnectionEdit",
    component: ConnectionEdit,
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
