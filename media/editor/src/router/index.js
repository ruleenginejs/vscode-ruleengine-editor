import { createRouter, createWebHashHistory } from "vue-router"
import editor from "./editor";
import system from "./system";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    ...editor,
    ...system
  ]
})

export default router;
