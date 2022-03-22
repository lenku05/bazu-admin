<template>
  <div class="blogs">
    <div class="container py">
      <div class="card" v-for="(blog, index) in blogs" :key="blog.id">
        <div class="row">
          <div class="col-sm-1 col-md-1 col-lg-1">
            <div class="num">#{{ index + 1 }}</div>
          </div>
          <div class="col-sm-9 col-md-9 col-lg-9">
            <div class="card-body" @click="view(blog.id)">
              {{ blog.title }}
            </div>
          </div>
          <div class="col-sm-2 col-md-2 col-lg-2">
            <button class="btn btn-danger" @click="deleteBlog(blog)">
              Delete
            </button>

            <button class="btn btn-warning" @click="updateBlog(blog.id)">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
export default {
  setup() {
    const router = useRouter();
    const store = useStore();

    const blogs = computed(() => {
      return store.state.blogs;
    });

    onMounted(() => {});
    // dispatching
    const view = (id) => {
      router.push("/blog/" + id);
    };
    const updateBlog = (id) => {
      router.push("/edit/" + id);

      console.log("update" + id);
    };
    const deleteBlog = (blog) => {
      store.dispatch("blogDelete", {
        blog,
      });
    };
    return {
      view,
      deleteBlog,
      blogs,
      updateBlog,
    };
  },
};
</script>

<style scoped>
.blogs {
  min-height: 100vh;
  margin-top: 55px;
  margin-bottom: 55px;
}
.card {
  box-shadow: 1px 2px 5px 1px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  margin: 10px;
  padding: 5px;
}
.float-right {
  float: right;
}
.btn {
  margin: 2px;
  float: right;
}
.num {
  font-size: 16px;
  padding: 5px;
}
.card-body {
  padding: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

/* .py {
  margin-top: 30px;
  margin-bottom: 30px;
} */
</style>
