import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RoomsView from "../views/RoomsView.vue";
import BookingView from "../views/BookingView.vue";
import ReviewsView from "../views/ReviewsView.vue";
import LoginView from "../views/LoginView.vue";
import AdminView from "../views/AdminView.vue";

const routes = [
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: "/home",
    name: "home",
    component: HomeView
  },
  {
    path: "/rooms",
    name: "rooms",
    component: RoomsView
  },
  {
    path: "/booking",
    name: "booking",
    component: BookingView
  },
  {
    path: "/reviews",
    name: "reviews",
    component: ReviewsView
  },
  {
    path: "/login",
    name: "login",
    component: LoginView
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: "smooth" };
  }
});

export default router;
