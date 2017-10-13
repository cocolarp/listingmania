<template lang="pug">
#content
  .row
    p Lorem ipsum dolor sit amet
    p Lorem ipsum dolor sit amet
</template>

<script>
export default {}
</script>

<style scoped>
#content {
  color: white;
  margin: 0 auto;
  margin-top: var(--navbar-height);
}
@media (min-width: 768px) {
  #content {
    width: 60%;
  }
}
@media (min-width: 1600px) {
  #content {
    width: 50%;
  }
}
</style>
