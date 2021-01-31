import { createMemoryHistory, createRouter, RouteRecordRaw } from "vue-router";
import Entities from "./views/Entities.vue";
import Controllers from "./views/Controllers.vue";
import Resolvers from "./views/Resolvers.vue";
import Other from "./views/Other.vue";

import DatabaseConnection from "./views/database/Connection.vue";
import DatabaseConnectionCreate from "./views/database/ConnectionCreate.vue";
import DatabaseConnectionEdit from "./views/database/ConnectionEdit.vue";
import DatabaseConnectionList from "./views/database/ConnectionList.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/entities",
    name: "Entities",
    component: Entities,
  },
  {
    path: "/controllers",
    name: "Controllers",
    component: Controllers,
  },
  {
    path: "/database",
    name: "DatabaseConnectionList",
    component: DatabaseConnectionList,
  },
  {
    path: "/database/create",
    name: "DatabaseConnectionCreate",
    component: DatabaseConnectionCreate,
  },
  {
    path: "/database/:uuid",
    name: "DatabaseConnection",
    component: DatabaseConnection,
  },
  {
    path: "/database/:uuid/edit",
    name: "DatabaseConnectionEdit",
    component: DatabaseConnectionEdit,
  },
  {
    path: "/resolvers",
    name: "Resolvers",
    component: Resolvers,
  },
  {
    path: "/other",
    name: "other",
    component: Other,
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
