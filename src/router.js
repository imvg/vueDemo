import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "index",
        component: () => import("./components/home.vue"),
    },
    {
        path: "/add",
        name: "add",
        component: () => import("./components/add.vue"),
    },
    {
        path: "/ssl",
        name: "ssl",
        component: () => import("./components/getssl.vue"),
    },
];

export default createRouter({
    history: createWebHistory(),
    routes,
});