<template lang="pug">
div.fill-height
  v-navigation-drawer(app, clipped,  width=400)
    v-select.pl-4.pr-4.pt-4(
      single-line,
      prepend-icon="date_range",
      v-model="selectedMonths",
      :items="months",
      :item-value="monthId",
      :item-text="monthLabel",
      label="Months",
      solo,
      multiple,
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

    v-container(fluid).pb-0.pt-0.blue-grey.lighten-5
      v-layout(row)
        v-flex(xs6)
          v-select.compact-form.mt-2.pt-0.mb-2(
            hide-details,
            dense,
            prepend-icon="sort",
            v-model="selectedSortKey",
            :items="sortItems",
            item-value="id",
            item-text="label",
          )

    v-divider

    v-container.fix-height(fluid, ref="eventList", data-simplebar)
      v-layout(justify-center, column)
        v-flex(xs12 v-for="event in events", :key="event.id")
          .localizer(:id="'event-' + event.id")
            event-card(, :event="event")

  v-content.full-height.padding-bottom-36(app)
    v-container.full-height(fluid, ref="googleMap")
</template>

<script>
/* global Backent, GoogleLoad */

import moment from 'moment'

import { transformBackentData } from 'src/models'

import EventCard from 'src/components/event-card.vue'

export default {
  data: function () {
    return {
      originalEvents: [],
      months: [],
      selectedMonths: [],
      selectedSortKey: 'start',
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
    sortItems () {
      return [
        { id: 'cost', label: 'Sort by price' },
        { id: 'start', label: 'Sort by date' },
      ]
    },
    events () {
      return this.originalEvents.filter((event) => {
        return this.selectedMonths.includes(this.monthId(event.start))
      }).sort((eventA, eventB) => {
        const sortKey = this.selectedSortKey
        switch (sortKey) {
          case 'start':
            return eventA.start.diff(eventB.start)
          default:
            if (eventA[sortKey] == null) return 1
            if (eventB[sortKey] == null) return -1
            return eventA[sortKey] - eventB[sortKey]
        }
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
  },
  async mounted () {
    await GoogleLoad

    const map = new google.maps.Map(this.$refs.googleMap, {
      zoom: 6,
      center: { lat: 48.86471, lng: 2.349014 },
      disableDefaultUI: true,
      zoomControl: true,
    })

    Backent.getEvents().then((rawEvents) => {
      this.originalEvents = transformBackentData(
        rawEvents,
        this.$store.state.currency,
        this.$store.state.conversionTable,
      )
      this.originalEvents.forEach((event) => {
        this.larpCountByMonth[this.monthId(event.start)] += 1
        const marker = new google.maps.Marker({ // eslint-disable-line no-new
          position: event.coords,
          map: map,
          title: event.name,
        })
        marker.addListener('click', () => {
          const eventDiv = document.getElementById(`event-${event.id}`)
          eventDiv.scrollIntoView({behavior: 'auto', block: 'start'});
        })
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

.compact-form {
  /* Make our form smaller */
  transform: scale(0.875);
  transform-origin: left;
}

.full-height {
  height: 100%;
}

.padding-bottom-36 {
  /* Default padding of v-content does not work well with our custom footer */
  padding-bottom: 36px;
}

.fix-height {
  /* the height of this list is wrongly computed for some reason, it overflows.
  Let's hardcode it to 100%, minus the size of our top forms. */
  height: calc(100% - 150px);
}

.localizer {
  /* A localizer div that also is useful to set the margins. */
  padding-top: 12px;
  margin-top: 12px;
}

</style>
