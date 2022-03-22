<template>
  <div class="container blog">
    <div class="loading" v-if="loading">
      <div class="spin"></div>
    </div>
    <div class="card" v-else>
      <img
        class="card-img-top img-responsive"
        :src="image"
        alt="Card image cap"
      />
      <div class="card-body">
        <div class="blog-label">
          {{ category }} - <span>{{ new Date(date).toDateString() }}</span>
        </div>
        <div class="blog-title">
          {{ title }}
        </div>
        <div class="body" v-html="body"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { db } from "../firebase";
export default {
  props: ["id"],
  setup(props) {
    const title = ref("");
    const category = ref("");
    const body = ref("");
    const author = ref("");
    const date = ref("");
    const image = ref("");
    const loading = ref(false);

    onMounted(() => {
      loading.value = true;

      db.collection("blogs")
        .doc(props.id)
        .get()
        .then((snap) => {
          console.log(snap.data());
          title.value = snap.data().title;
          date.value = snap.data().date;
          body.value = snap.data().body;
          author.value = snap.data().author;
          image.value = snap.data().image;
          category.value = snap.data().category;
          loading.value = false;
        })
        .catch((error) => {
          console.log(error);
          loading.value = false;
        });
    });
    return {
      title,
      date,
      category,
      image,
      author,
      body,
      loading,
    };
  },
};
</script>

<style scoped>
@keyframes spinner {
  0% {
    transform: translate3d(-50%, -50%, 0) rotate(0deg);
  }
  100% {
    transform: translate3d(-50%, -50%, 0) rotate(360deg);
  }
}
.spin::before {
  animation: 1.5s linear infinite spinner;
  animation-play-state: inherit;
  border: solid 5px #cfd0d1;
  border-bottom-color: #1c87c9;
  border-radius: 50%;
  content: "";
  height: 80px;
  width: 80px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  will-change: transform;
  text-align: center;
  display: flex;
  margin: auto;
  justify-content: center;
  /* margin-bottom: 45px; */
}
.spin {
  top: 40vh;
}
.loading {
  height: 100vh;
}
.blog {
  min-height: 100vh;
  margin-top: 55px;
  margin-bottom: 55px;
}
.card-body {
  padding: 10px;
}
.blog-label {
  font-weight: 700;
  font-size: 16px;
  padding: 3px;
  text-transform: capitalize;
  color: black;
}
.blog-label span {
  font-weight: 400;
  font-size: 16px;
  padding: 3px;
  text-transform: capitalize;
  color: grey;
}
.blog-title {
  font-weight: 700;
  text-transform: capitalize;
  font-size: 26px;
  padding: 2px;
  color: black;
}
.blog-author {
  display: inline;
  text-transform: capitalize;
  font-size: 16px;
}
.body {
  font-size: 18px;
}
.icon {
  width: 10px;
  height: 10px;
  background-color: grey;
  border-radius: 50px;
  display: inline-block;
  padding-top: 3px;
}
@media only screen and (max-width: 576px) {
  .blog-label {
    font-weight: 700;
    font-size: 15px;
    padding: 3px;
    color: black;
  }
  p {
    font-size: 18px;
  }
  .blog-label span {
    font-weight: 400;
    font-size: 15px;
    padding: 3px;
    color: grey;
  }
  .blog-title {
    font-weight: 700;
    font-size: 24px;
    padding: 2px;
    color: black;
  }
  .blog-author {
    display: inline;
    margin-top: 10px;
    text-transform: capitalize;
  }
  .icon {
    width: 10px;
    height: 10px;
    background-color: grey;
    border-radius: 50px;
    display: inline-block;
    padding-top: 3px;
  }
}
</style>
