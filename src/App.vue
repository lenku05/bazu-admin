<template>
  <Navbar />
  <!-- <Notification/> -->
  <router-view v-slot="{ Component }">
    <transition name="fadeIn">
      <component :is="Component" />
    </transition>
  </router-view>
  <BottomNavbar />
</template>
<script>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import Navbar from "./components/global/Navbar.vue";
import BottomNavbar from "./components/global/BottomNav.vue";
// import Notification from "./components/blogs/Notification.vue"
export default {
  components: {
    Navbar,
    BottomNavbar,
    // Notification
  },
  setup() {
    const store = useStore();
    const isSignedIn = computed(() => {
      return store.getters.getAuthState;
    });
    if (isSignedIn == true) {
      store.dispatch("loadBlogs");
    }
  },
};
</script>
<style>
* {
  margin: 0;
}
html {
  scroll-behavior: smooth;
}

@font-face {
  font-family: "Raleway";
  font-style: normal;
  font-weight: 400;
  src: url("./assets/fonts/Raleway-VariableFont_wght.ttf");
}

* {
  font-family: "Raleway", sans-serif;
  font-weight: 400;
}

@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.fadeIn {
  -webkit-animation-name: fadeIn;
  animation-name: fadeIn;
}

.fadeIn-enter-active {
  animation: fadeIn 0.6s ease-out;
}

.fadeIn-leave-active {
  animation: fadeOut 0s ease-in delay 0.2s;
}
</style>
