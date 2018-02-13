<template lang="pug">
#content
  .row
    .col
      strong VUE DE DETAIL
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
#content strong {
  font-family: 'Montserrat-Alternate';
  font-size: 1.5rem;
  margin-right: 1rem;
  text-shadow: 0 0 4px rgba(0,0,0,0.30);
}
#content > .row {
  margin-top: 0.5rem;
  line-height: var(--form-line-height);
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
