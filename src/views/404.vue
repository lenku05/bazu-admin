<template>
  <div class="lost">
    <div class="notfound">404</div>
    <!-- <div class="center message"> You are lost</div> -->
    <center>
      <router-link to="/" class="my-2 btn btn-primary"
        >GO BACK HOME</router-link
      >
    </center>
  </div>
</template>

<script>
export default {};
</script>

<style>
.notfound {
  font-size: 180px;
  text-align: center;
  padding-top: 130px;
}
</style>
