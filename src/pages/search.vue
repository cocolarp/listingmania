<template lang="pug">
div
  v-navigation-drawer(app, clipped, data-simplebar, width=400)
    v-container(fluid).pb-0
      v-layout(justify-center, column)
        v-flex(xs12)
          v-select(
            single-line,
            prepend-icon="date_range",
            v-model="selectedMonths",
            :items="months",
            :item-value="monthId",
            :item-text="monthLabel",
            label="Months",
            solo,
            multiple,
            menu-props="close-on-click, close-on-content-click",
          )
            v-list-tile(slot='prepend-item', ripple, @click='toggleMonths')
              v-list-tile-action
                v-icon {{ selectAllIcon }}
              v-list-tile-title Select All ({{ originalEvents.length }})
            v-divider.mt-2(slot='prepend-item')
            template(slot='selection', slot-scope='{ item, index }')
              v-chip(v-if='index === 0')
                span {{ monthLabel(item) }}
              span.grey--text.caption(v-if='index === 1') (+{{ selectedMonths.length - 1 }} others)

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

import moment from 'moment'

import { transformBackentData } from 'src/models'

import EventCard from 'src/components/event-card.vue'


export default {
  data: function () {
    return {
      originalEvents: [],
      months: [],
      selectedMonths: [],
      larpCountByMonth: {},
    }
  },
  computed: {
    allMonthsSelected () {
      return (this.selectedMonths.length === this.months.length)
    },
    selectAllIcon () {
      if (this.allMonthsSelected) {
        return 'check_box'
      }
      return 'check_box_outline_blank'
    },
    events () {
      return this.originalEvents.filter((event) => {
        return this.selectedMonths.includes(this.monthId(event.start))
      })
    },
  },
  methods: {
    monthId (month) {
      return month.format('MM-YYYY')
    },
    monthLabel (month) {
      return `${month.format('MMMM YYYY')} (${this.larpCountByMonth[this.monthId(month)]})`
    },
    selectAllMonths () {
      this.selectedMonths = this.months.slice().map(this.monthId)
    },
    toggleMonths () {
      if (this.allMonthsSelected) {
        this.selectedMonths = []
      } else {
        this.selectAllMonths()
      }
    },
  },
  created () {
    this.months = Array(13).fill(0).map((_, i) => {
      const currentMonth = moment().add(i, 'months')
      this.larpCountByMonth[this.monthId(currentMonth)] = 0
      return currentMonth
    })
    this.selectAllMonths()
    Backent.getEvents().then((rawEvents) => {
      this.originalEvents = transformBackentData(
        rawEvents,
        this.$store.state.currency,
        this.$store.state.conversionTable,
      )
      this.originalEvents.forEach((event) => {
        this.larpCountByMonth[this.monthId(event.start)] += 1
      })
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
