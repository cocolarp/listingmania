<template lang="pug">
div
  v-navigation-drawer(app, clipped, width=400)
    v-container(fluid)
      v-layout(justify-center, column)
        v-flex(xs12)
          v-select(
            prepend-icon="date_range",
            v-model="selectedMonths",
            :items="months",
            label="Months",
            solo,
            multiple,
            menu-props="close-on-click, close-on-content-click",
          )
    v-divider
    v-container(fluid)
      v-layout(justify-center, column)
        v-flex(xs12)
          v-card
            v-card-title Le Serpent de Cendres
  v-content(app)
    v-container(fluid)
      p Map
</template>

<script>
export default {
  data: function () {
    return {
      months: ['January', 'February', 'March'],
      selectedMonths: [],
    }
  },
}
</script>

<style scoped>
@import "src/variables.css";
</style>
