import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import About from "../pages/About.vue";
import Events from "../pages/Events.vue";
import Programs from "../pages/Programs.vue";
import Community from "../pages/Community.vue";
import Resources from "../pages/Resources.vue";
import Testimonials from "../pages/Testimonials.vue";
import Contact from "../pages/Contact.vue";
import Login from "../pages/admin/Login.vue";
import Dashboard from "../pages/admin/Dashboard.vue";
import { useAuthStore } from "../stores/auth.js";
import AdminEvents from "../pages/admin/Events.vue";
import Layout from "../layouts/Layout.vue";
import AdminLayout from "../layouts/AdminLayout.vue";
const routes = [
  {
    path: "/",
    component: Layout,
    children: [
      { path: "", component: Home },
      { path: "about", component: About },
      { path: "events", component: Events },
      { path: "programs", component: Programs },
      { path: "community", component: Community },
      { path: "resources", component: Resources },
      { path: "testimonials", component: Testimonials },
      { path: "contact", component: Contact },
    ],
  },
  {
    path: "/admin/login",
    component: Login,
    meta: { guestOnly: true },
  },

  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", component: Dashboard },
      { path: "events", component: AdminEvents },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach(async (to) => {
  console.log("route", to.path);

  if (!to.meta.requiresAuth) {
    return true;
  }

  const auth = useAuthStore();

  await auth.fetchUser();

  console.log("user", auth.user);

  if (!auth.user) {
    return "/admin/login";
  }

  return true;
});
export default router;
