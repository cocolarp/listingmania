<template lang="pug">
v-card
  v-card-title
    v-container.headline
      v-layout(row)
        v-flex(xs10).pa-0
          span {{ event.name }}
        v-spacer
          span {{ event.readable_cost }}
  v-card-text
    p.description {{ event.description }}
</template>

<script>
export default {
  props: {
    event: Object,
  },
}
</script>

<style scoped>
@import "src/variables.css";
</style>
