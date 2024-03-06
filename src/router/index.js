import { createRouter, createWebHistory } from 'vue-router'
import DashBoard from '../views/DashBoard.vue'
import Home from '../views/Home.vue'
import CreateList from "@/views/list/CreateList.vue";
import UserAuth from "@/views/auth/UserAuth.vue";
import store from '../store/index.js';
import AllMovieLists from "@/views/user/AllMovieLists.vue";
import SearchResults from "@/views/SearchResults.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashBoard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/auth',
      component: UserAuth,
      meta: {
        requiresUnauth: true
      }
    },
    {
      path: '/new-list',
      component: CreateList,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/search/:searchString',
      props: true,
      component: SearchResults
    }
  ]
});

router.beforeEach(function(to, _, next){
  if(to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next('/auth');
  } else if (to.meta.requiresUnauth && store.getters.isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
