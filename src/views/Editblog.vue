<template>
  <div class="edit">
    <br /><br /><br />

    <div class="container">
      <div class="row">
        <h2 class="heading">edit a blog</h2>
        <!-- <div class="subheading">our vission mission and core values</div> -->
        <hr class="container" />
        <div class="col-sm-12 col-md-12 col-lg-12">
          <div class="alert alert-danger" v-if="error.state" role="alert">
            {{ error.message }}
          </div>
          <div class="alert alert-success" v-if="success.state" role="alert">
            {{ success.message }}
          </div>
          <form @submit.prevent="update">
            <input
              type="text"
              class="form-control"
              placeholder="Blog title"
              required
              v-model="state.title"
            />
            <br />
            <select class="form-control" v-model="state.category" required>
              <option value="" disabled selected>Select category</option>
              <option value="trending">Trending</option>
              <option value="politics">Politics</option>
              <option value="business">Business</option>
              <option value="travel">Travel</option>
              <option value="economics">Society and Economics</option>
            </select>
            <br />
            <input
              v-if="!preview"
              @change="fileUpload"
              type="file"
              class="form-control"
              placeholder="Blog image"
            />
            <br />
            <img
              v-if="preview"
              :src="state.image"
              class="img-responsive"
              alt=""
            />
            <a
              v-if="preview"
              class="btn btn-danger"
              style="margin: 6px"
              @click="removephoto(state.image)"
            >
              Remove Cover photo
            </a>
            <br />
            <QuillEditor
              placeholder="add ablog post"
              v-model:content="state.body"
              theme="snow"
              contentType="html"
              content="html"
              :toolbar="options"
              class="height"
              ref="editor"
            />

            <br />
            <button type="submit" class="btn btn-primary">
              <span v-if="loading">updating...</span><span v-else>update</span>
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
import { computed, reactive, ref } from "@vue/reactivity";
import { onBeforeMount } from "@vue/runtime-core";
import { db, storage } from "../firebase";
import { useStore } from "vuex";
export default {
  props: ["id"],
  components: {
    QuillEditor,
  },
  setup(props) {
    const preview = ref(true);
    const state = reactive({
      title: "",
      category: "",
      body: "",
      image: "",
      file: null,
    });
    const editor = ref("editor");
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
    const update = () => {
      // console.log(state)
      store.dispatch("blogUpdate", {
        id: state.id,
        title: state.title,
        category: state.category,
        body: state.body,
        image: state.image,
        file: state.file,
      });
    };
    const store = useStore();
    const fileUpload = (e) => {
      let file = e.target.files[0];
      state.file = file;
    };
    const removephoto = (image) => {
      preview.value = false;
      // console.log(image);
      const deleteImage = storage.refFromURL(image);
      deleteImage
        .delete()
        .then(() => {
          console.log("deleted");
        })
        .catch((error) => {
          console.log(error);
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
    onBeforeMount(() => {
      // loading.value = true;
      db.collection("blogs")
        .doc(props.id)
        .get()
        .then((snap) => {
          // console.log(snap.id);
          state.id = snap.id;
          state.title = snap.data().title;
          state.body = snap.data().body;
          state.author = snap.data().author;
          state.image = snap.data().image;
          state.category = snap.data().category;
          // setHTML(state.body);
          editor.value.setHTML(state.body);
        })
        .catch(() => {
          // console.log(error);
          // loading.value = false;
        });
    });

    return {
      state,
      options,
      removephoto,
      editor,
      update,
      preview,
      loading,
      error,
      success,
      fileUpload,
    };
  },
};
</script>

<style>
.edit {
  min-height: 100vh;
  /* margin-top: 55px; */
  margin-bottom: 75px;
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
</style>
