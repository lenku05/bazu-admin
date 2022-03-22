<template>
  <nav
    v-if="isSignedIn"
    class="navbar navbar-default navbar-fixed-top container-fluid bg-white"
  >
    <div class="">
      <!-- Brand and toggle get grouped for better mobile display -->
      <div v-if="$route.path == '/'" class="navbar-header">
        <router-link
          class="navbar-brand"
          to="/"
          style="text-transform: capitalize"
          >{{ author }}</router-link
        >
      </div>
      <ul v-if="$route.path != '/'" class="nav navbar-nav navbar-left">
        <li>
          <a @click="$router.go(-1)">
            <i class="material-icons nav__icon small">arrow_back</i></a
          >
        </li>
      </ul>
      <!-- Collect the nav links, forms, and other content for toggling -->
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav navbar-right">
          <li><router-link to="/">blogs</router-link></li>
          <li><router-link to="/create">Create a blog</router-link></li>
          <li><router-link to="/createBlogger">Admin</router-link></li>
          <!-- <li><router-link to="/uploads">Uploads</router-link></li> -->
          <li><a @click="logout">Logout</a></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const author = computed(() => {
      return store.state.user.author;
    });
    const logout = () => {
      store.dispatch("logOutUser");
    };
    const isSignedIn = computed(() => {
      return store.getters.getAuthState;
    });
    return {
      logout,
      author,
      isSignedIn,
    };
  },
};
</script>

<style>
.small {
  font-size: 16px;
}
</style>
