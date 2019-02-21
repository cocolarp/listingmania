<template lang="pug">
div
  v-navigation-drawer(app, clipped, width=400)
    v-container(fluid).pb-0
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
    v-container(fluid, v-bind="{ ['grid-list-xl']: true }")
      v-layout(justify-center, column)
        v-flex(xs12 v-for="event in events", :key="event.id")
          event-card(:event="event")
  v-content(app)
    v-container(fluid)
      p Map
</template>

<script>
/* global Backent */

import { transformBackentData } from 'src/models'

import EventCard from 'src/components/event-card.vue'

export default {
  data: function () {
    return {
      events: [],
      months: ['January', 'February', 'March'],
      selectedMonths: [],
    }
  },
  mounted () {
    Backent.getEvents().then((rawEvents) => {
      this.events = transformBackentData(
        rawEvents,
        this.$store.state.currency,
        this.$store.state.conversionTable,
      )
    })
  },
  components: {
    'event-card': EventCard,
  },
}
</script>

<style scoped>
@import "src/variables.css";
</style>
