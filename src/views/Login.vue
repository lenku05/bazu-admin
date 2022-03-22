<template>
  <div class="login">
    <div class="container form">
      <h2 class="heading">login</h2>
      <hr class="container" />
      <div class="row">
        <div class="col-sm-2 col-md-2 col-lg-2"></div>
        <div class="col-sm-8 col-md-8 col-lg-8">
          <div class="alert alert-danger" v-if="error.state" role="alert">
            {{ error.message }}
          </div>
          <form class="" @submit.prevent="login">
            <div class="form-group">
              <label for="inputEmail">Email</label>
              <input
                type="email"
                v-model="email"
                class="form-control"
                id="inputEmail"
                placeholder="Email"
              />
            </div>
            <div class="form-group">
              <label for="inputPassword">Password</label>
              <input
                v-model="password"
                type="password"
                class="form-control"
                id="inputPassword"
                placeholder="Password"
              />
            </div>

            <button type="submit" class="btn btn-primary">
              <span v-if="loading">Loading...</span><span v-else>Login</span>
            </button>
          </form>
        </div>
        <div class="col-sm-2 col-md-2 col-lg-2"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "@vue/reactivity";
import { useStore } from "vuex";
export default {
  setup() {
    const email = ref("");
    const password = ref("");

    const store = useStore();

    const loading = computed(() => {
      return store.state.loading;
    });
    const error = computed(() => {
      return store.state.error;
    });
    const login = () => {
      store.dispatch("userSignIn", {
        email: email.value,
        password: password.value,
      });
    };

    return {
      email,
      password,
      error,
      loading,
      login,
    };
  },
};
</script>

<style scoped>
.form {
  margin-top: 100px;
}

.heading {
  letter-spacing: 2px;
  text-transform: capitalize;
  text-align: center;
  font-size: 36px;
  font-weight: 600;
}

hr {
  padding-bottom: 30px;
}
.height {
  height: 200px;
}

@media only screen and (max-width: 576px) {
  .heading {
    letter-spacing: 2px;
    text-transform: capitalize;
    text-align: center;
    font-size: 30px;
    font-weight: 600;
  }
}
.login {
  height: 100vh;
  /* margin-top: 55px;
  margin-bottom: 55px; */
}
</style>
