<template>
  <div class="create">
    <br /><br /><br />
    <div class="container">
      <div class="row">
        <h2 class="heading">create a blog</h2>
        <!-- <div class="subheading">our vission mission and core values</div> -->
        <hr class="container" />
        <div class="col-sm-12 col-md-12 col-lg-12">
          <div class="alert alert-danger" v-if="error.state" role="alert">
            {{ error.message }}
          </div>
          <div class="alert alert-success" v-if="success.state" role="alert">
            {{ success.message }}
          </div>
          <form @submit.prevent="publish">
            <input
              type="text"
              class="form-control"
              placeholder="Blog title"
              required
              v-model="title"
            />
            <br />
            <select class="form-control" v-model="category" required>
              <option value="" disabled selected>Select category</option>
              <option value="trending">Trending</option>
              <option value="politics">Politics</option>
              <option value="business">Business</option>
              <option value="travel">Travel</option>
              <option value="economics">Society and Economics</option>
            </select>
            <br />
            <input
              type="file"
              accept="image/*"
              @change="fileUpload"
              class="form-control"
              placeholder="Blog image"
              required
            />
            <br />
            <QuillEditor
              placeholder="add ablog post"
              v-model:content="body"
              theme="snow"
              contentType="html"
              content="html"
              :toolbar="options"
              class="height"
            />
            <br />
            <button type="submit" class="btn btn-primary">
              <span v-if="loading">publishing...</span
              ><span v-else>Publish</span>
            </button>
            <!-- <input type="text" v-model="content"> -->
          </form>
          <!-- <div class="container">{{ content }}</div> -->
          <!-- <div class="container" v-html="content"></div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { computed, ref } from "@vue/reactivity";
import { useStore } from "vuex";
export default {
  components: {
    QuillEditor,
  },

  setup() {
    const body = ref("");
    const category = ref("");
    const title = ref("");
    const image = ref("");
    const date = ref(new Date().toISOString());

    const store = useStore();
    const options = ref([
      ["bold", "italic", "underline", "strike", "link", "image", "video"], // toggled buttons
      ["blockquote", "code-block"],
      //   [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      //   [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      //   [{ direction: "rtl" }], // text direction

      //   [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      //   [{ font: [] }],
      //   [{ align: [] }],

      ["clean"],
    ]);

    const publish = () => {
      store.dispatch("createblog", {
        title: title.value,
        body: body.value,
        category: category.value,
        date: date.value,
        file: image.value,
      });
    };
    const loading = computed(() => {
      return store.state.loading;
    });
    const error = computed(() => {
      return store.state.error;
    });
    const success = computed(() => {
      return store.state.success;
    });
    const fileUpload = (e) => {
      let file = e.target.files[0];
      image.value = file;
    };
    return {
      loading,
      options,
      body,
      publish,
      fileUpload,
      category,
      title,
      error,
      success,
    };
  },
};
</script>

<style>
.create {
  padding-bottom: 70px;
}
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
