import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import store from "../store";
const routes = [
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "Login" */ "../views/Login.vue"),
  },
  {
    path: "/create",
    name: "Create",
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "Create" */ "../views/CreateBlog.vue"),
  },
  {
    path: "/",
    name: "dashboard",
    meta: { requiresAuth: true },
    component: Dashboard,
  },

  {
    path: "/:catchAll(.*)",
    component: () => import(/* webpackChunkName: "404" */ "../views/404.vue"),
  },
  {
    path: "/edit/:id",
    props: true,
    name: "Editblog",
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "Editblog" */ "../views/Editblog.vue"),
  },
  {
    path: "/blog/:id",
    props: true,
    name: "ViewBlog",
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "ViewBlog" */ "../views/ViewBlog.vue"),
  },
  {
    path: "/createBlogger",
    name: "CreateBlogger",
    meta: { requiresAuth: true },
    component: () =>
      import(
        /* webpackChunkName: "CreateBlogger" */ "../views/CreateBlogger.vue"
      ),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
//

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.getAuthState == true) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});
export default router;
