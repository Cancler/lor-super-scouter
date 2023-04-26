//#############################################################################

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import TokenNotSetView from "@/views/TokenNotSetView.vue"
import store from '@/store'

//#############################################################################

// List of defined routes
const routes = [
    {
        path: "/:pathMatch(.*)*",
        redirect: "/"
    },
    {
        path: "/",
        name: "home",
        component: HomeView
    },
    {
        path: "/token-404",
        name: "token-not-set",
        component: TokenNotSetView
    }
]

// # ----------------------------------------------------

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
    if(!store.get("token") && to.name !== "token-not-set"){
        next({name: "token-not-set"})
    } else {
        next()
    }
})

// # ----------------------------------------------------

export default router

//#############################################################################