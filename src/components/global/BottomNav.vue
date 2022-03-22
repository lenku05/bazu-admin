<template>
  <nav v-if="isSignedIn" class="nav-bottom">
    <router-link to="/" class="nav__link">
      <i class="material-icons nav__icon">home</i>
      <span class="nav__text">Home</span>
    </router-link>
    <router-link to="/create" class="nav__link">
      <i class="material-icons nav__icon">add</i>
      <span class="nav__text">Add</span>
    </router-link>
    <router-link to="/createBlogger" class="nav__link">
      <i class="material-icons nav__icon">settings</i>
      <span class="nav__text">Admin</span>
    </router-link>

    <a @click="logout" class="nav__link">
      <i class="material-icons nav__icon">exit_to_app</i>
      <span class="nav__text">Logout</span>
    </a>

    <!-- <a href="#" class="nav__link">
      <i class="material-icons nav__icon">lock</i>
      <span class="nav__text">Privacy</span>
    </a> -->
    <!-- <router-link to="/login" class="nav__link">
      <i class="material-icons nav__icon">settings</i>
      <span class="nav__text">Settings</span>
    </router-link> -->
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
      // console.log("object");
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
@import "https://fonts.googleapis.com/icon?family=Material+Icons";

@media only screen and (min-width: 576px) {
  .nav-bottom {
    display: none;
  }
}
@media only screen and (max-width: 576px) {
  .nav-bottom {
    position: fixed;
    min-height: 56px;
    bottom: 0;
    width: 100%;
    height: 3.3rem;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
    background-color: #ffffff;
    display: flex;
    overflow-x: auto;
  }

  .nav__link {
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    min-width: 50px;
    overflow: hidden;
    white-space: nowrap;
    font-family: sans-serif;
    font-size: 13px;
    color: #444444;
    text-decoration: none !important;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
    transition: background-color 0.1s ease-in-out;
  }

  .nav__link:hover {
    background-color: #eeeeee;
  }

  .nav__icon {
    font-size: 18px;
  }

  .router-link-exact-active {
    color: #4a4ae4;
  }

  @media only screen and (max-width: 576px) {
    body {
      margin: 0 0 0 0;
    }
  }
  @media only screen and (min-width: 576px) {
    body {
      margin: 0 0 0 0;
    }
  }
}
</style>
