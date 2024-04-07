import { createRouter, createWebHistory } from 'vue-router'
import DashBoard from '../views/DashBoard.vue'
import Home from '../views/Home.vue'
import CreateList from "@/views/list/CreateList.vue";
import UserAuth from "@/views/auth/UserAuth.vue";
import store from '../store/index.js';
import AllMovieLists from "@/views/user/AllMovieLists.vue";
import SearchResults from "@/views/SearchResults.vue";
import MovieDetails from "@/views/movie/MovieDetails.vue";
import NotFound from "@/views/NotFound.vue";
import WatchList from "@/views/user/WatchList.vue";
import GottaWatchList from "@/views/user/GottaWatchList.vue";
import PublicLists from "@/views/discover/PublicLists.vue";
import ListDetails from "@/views/list/ListDetails.vue";
import EditList from "@/views/list/EditList.vue";
import Search from "@/views/Search.vue";
import Trending from "@/views/discover/Trending.vue";

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
      path: '/login',
      name: 'login',
      component: UserAuth,
      meta: {
        requiresUnauth: true
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: UserAuth,
      meta: {
        requiresUnauth: true
      }
    },
    {
      path: '/new-list',
      name: 'CreateList',
      component: CreateList,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/user/lists',
      component: AllMovieLists,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/search/:searchString',
      name: 'SearchResults',
      props: true,
      component: SearchResults
    },
    {
      path: '/discover/movie-lists',
      component: PublicLists
    },
    {
      path: '/discover/trending',
      component: Trending
    },
    {
      path: '/list/:listId',
      props: true,
      component: ListDetails
    },
    {
      path: '/list/:listId/edit',
      name: 'EditList',
      props: true,
      component: EditList,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/movie/:movieId',
      props: true,
      component: MovieDetails
    },
    {
      path: '/404',
      component: NotFound
    },
    {
      path: '/user/watched-list',
      component: WatchList,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/user/gotta-watch-list',
      component: GottaWatchList,
      meta: {
        requiresAuth: true
      }
    },
  ]
});

router.beforeEach(function(to, _, next){
  if(to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresUnauth && store.getters.isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
