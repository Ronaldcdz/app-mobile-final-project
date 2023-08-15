import { createRouter, createWebHistory } from "@ionic/vue-router";

import { userStore } from "../store/user";

const authCheck = (to, from, next) => {
  const store = userStore();
  console.log("Estamos en el chekeo de usuario");
  console.log(store.isLoggedIn);
  console.log(store);

  if (store.isLoggedIn) {
    if (to.name === "login") {
      next({ name: "currentLocation" });
    } else {
      next();
    }
  } else {
    if (to.name === "login") {
      next();
    } else {
      next({ name: "login" });
    }
  }
};

const routes = [
  {
    path: "/",
    redirect: "/login",
  },

  {
    name: "login",
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    beforeEnter: authCheck,
  },

  {
    path: "/locations/",
    component: () => import("@/views/locations/index.vue"),
    children: [
      {
        name: "currentLocation",
        path: "currentLocation",
        component: () => import("@/views/locations/CurrentLocation.vue"),
        beforeEnter: authCheck,
      },
      {
        name: "userProfile",
        path: "userProfile",
        component: () => import("@/views/UserProfile.vue"),
        beforeEnter: authCheck,
      },
      {
        name: "favPlaces",
        path: "favPlaces",
        component: () => import("@/views/FavPlaces.vue"),
        beforeEnter: authCheck,
      },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
