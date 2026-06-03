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
import AdminPrograms from "../pages/admin/Programs.vue";
import AdminResources from "../pages/admin/Resources.vue";
import AdminTestimonials from "../pages/admin/Testimonials.vue";
import AdminInterests from "../pages/admin/Interests.vue";
import AdminMembers from "../pages/admin/Members.vue";

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
      { path: "programs", component: AdminPrograms },
      { path: "resources", component: AdminResources },
      { path: "testimonials", component: AdminTestimonials },
      {  path: "interests", component: AdminInterests },
      {  path: "members", component: AdminMembers },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  await auth.fetchUser();

  if (to.meta.guestOnly && auth.user) {
    return "/admin";
  }

  if (to.meta.requiresAuth && !auth.user) {
    return "/admin/login";
  }

  return true;
});

export default router;
