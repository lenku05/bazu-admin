<template>
  <div class="create">
    <br /><br /><br />
    <div class="container">
      <div class="row">
        <h2 class="heading">create a blogger</h2>
        <!-- <div class="subheading">our vission mission and core values</div> -->
        <hr class="container" />
        <div class="col-sm-12 col-md-12 col-lg-12">
          <div class="alert alert-danger" v-if="error.state" role="alert">
            {{ error.message }}
          </div>
          <div class="alert alert-success" v-if="success.state" role="alert">
            {{ success.message }}
          </div>
          <form @submit.prevent="createBlogger">
            <input
              type="text"
              class="form-control"
              placeholder="Author name"
              required
              v-model="author"
            />
            <br />
            <input
              type="email"
              class="form-control"
              placeholder="Email"
              required
              v-model="email"
              @blur="emailhint = !emailhint"
            />
            <small v-if="emailhint">Use an official Gmail account!</small>

            <br />
            <input
              type="password"
              class="form-control"
              placeholder="password"
              required
              v-model="password"
            />
            <small v-if="passhint"
              >Password should be more than 8 characters!</small
            >
            <br />

            <input
              class="btn btn-primary"
              type="submit"
              value="create blogger"
            />
            <!-- <input type="text" v-model="content"> -->
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref } from "@vue/reactivity";
import { computed } from "vue";
export default {
  setup() {
    const password = ref("");
    const email = ref("");
    const author = ref("");
    const passhint = ref(false);
    const emailhint = ref(false);

    const store = useStore();
    const error = computed(() => {
      return store.state.error;
    });
    const success = computed(() => {
      return store.state.success;
    });
    const createBlogger = () => {
      if (password.value.length < 8) {
        passhint.value = true;
      } else {
        store.dispatch("userSignUp", {
          email: email.value,
          password: password.value,
          author: author.value,
        });
      }
    };

    return {
      createBlogger,
      password,
      email,
      author,
      passhint,
      emailhint,
      error,
      success,
    };
  },
};
</script>

<style>
.heading {
  letter-spacing: 2px;
  text-transform: capitalize;
  text-align: center;
  font-size: 36px;
  font-weight: 600;
}
.subheading {
  letter-spacing: 7px;
  text-transform: uppercase;
  text-align: center;
  font-size: 16px;
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
  .subheading {
    letter-spacing: 7px;
    text-transform: uppercase;
    text-align: center;
    font-size: 14px;
  }
}
</style>
