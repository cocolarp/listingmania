<template lang="pug">
#content
  .row
    .col
      h1 FAQ
      p(v-translate="") En cours d'écriture, un peu de patience...
</template>

<script>
export default {}
</script>

<style scoped>
#content {
  margin: 0 auto;
  margin-top: 0.5rem;
  background-color: white;
  color: var(--highlight-text-color);
}

#content > .row {
  line-height: var(--form-line-height);
}

@media (max-width: 768px) {
  #content {
    width: 100%;
  }
  .col {
    padding: 1rem 2.5rem;
  }
}
@media (min-width: 768px) {
  #content {
    padding: 1rem 3rem;
    width: 50%;
  }
}
</style>
