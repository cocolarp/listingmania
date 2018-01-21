<template lang="pug">
#content
  #whitestrip
    #searchform
      .row
        .col.first
          label Période
        .col.second
          check-box(
            msg="Toutes les dates",
            :value="anyTime",
            @change="updateAnyTime"
          )
        .col.third
          date-range-slider
      .spacer
      .row
        .col.first
          label Distance
        .col.second
          check-box(
            msg="Dans le monde entier",
            :value="anyWhere",
            @change="updateAnyWhere"
          )
        .col.third(v-if="!anyWhere")
          #location-input
            location-input
          #distance-slider
            distance-slider

      #filters
        .row
          .col
            .round-filter#my-events
              check-box(
                msg="Mes GNs uniquement",
                :value="onlyMyEvents",
                @change="toggleMyEventsOnly"
              )
          .col
            .round-filter
              strong Format
              multi-sort-badge(
                class='short-duration',
                stateProperty='durationFilter',
                stateMutation='toggleDurationFilter',
                value=0,
                badgeText='COURT',
              )
              multi-sort-badge(
                class='medium-duration',
                stateProperty='durationFilter',
                stateMutation='toggleDurationFilter',
                value=1,
                badgeText='MOYEN',
              )
              multi-sort-badge(
                class='long-duration',
                stateProperty='durationFilter',
                stateMutation='toggleDurationFilter',
                value=2,
                badgeText='LONG',
              )
          .col
            .round-filter
              strong Tri
              sort-badge(
                stateProperty='sortKey',
                stateMutation='setSortKey',
                value='start',
                badgeText='DATE'
              )
              sort-badge(
                stateProperty='sortKey',
                stateMutation='setSortKey',
                value='cost',
                badgeText='COÛT'
              )
              sort-badge(
                v-if="shouldDisplayDistanceFilter",
                stateProperty='sortKey',
                stateMutation='setSortKey',
                value='distance',
                badgeText='DISTANCE'
              )
  #cards
    .row#result-count
      .col
        strong {{ events.length }}&nbsp;
        span résultat{{ events.length > 1 ? 's' : '' }}
    .row
      .col.event(v-for="event in events", :key="event.id")
        event-card(:event="event")

</template>

<script>
import moment from 'moment'
import {mapState} from 'vuex'
import merge from 'lodash.merge'

import {DURATIONS} from 'src/models'
import eventCard from 'src/components/event-card.vue'
import sortBadge from 'src/components/sort-badge.vue'

import MainFiltersMixin from './main-filters.js'

const today = moment()


const multiSortBadge = merge({}, sortBadge, {
  computed: {
    isSelected () {
      return this.$store.state[this.stateProperty][this.value]
    },
  },
  methods: {
    setSortKey () {
      this.$store.commit(this.stateMutation, this.value)
    },
  },
})


const EventsPage = merge({}, MainFiltersMixin, {
  components: {
    'event-card': eventCard,
    'sort-badge': sortBadge,
    'multi-sort-badge': multiSortBadge,
  },
  computed: mapState({
    shouldDisplayDistanceFilter (state) {
      return !state.anyWhere && state.place
    },
    events: (state) => {
      return state.rawEvents.filter((event) => {
        const eventMonth = event.start.diff(today, 'month')
        return (
          (
            !state.onlyMyEvents
            || (
              state.user && state.user.events.includes(event.id)
            )
          )
          &&
          (
            state.durationFilter[DURATIONS.indexOf(event.durationCategory)]
          )
          &&
          (
            (state.selectedMonths[eventMonth] === true)
            || (eventMonth > 12 && state.selectedMonths.slice(-1)[0] === true)
          )
          &&
          (
            (state.anyWhere)
            || (event.distance < state.maxDistance)
          )
        )
      }).sort((eventA, eventB) => {
        switch (state.sortKey) {
          case 'start':
            return eventA.start.diff(eventB.start, 'days')
          default:
            return eventA[state.sortKey] - eventB[state.sortKey]
        }
      })
    },
  }),
})
export default EventsPage
</script>

<style scoped>
#content {
  font-family: Geomanist;
  margin: 0 auto;
  height: 100%;
}

#result-count {
  margin-bottom: 1rem;
  color: white;
  font-size: 1.2rem;
}

#whitestrip {
  color: #999;
  background-color: white;
  padding: 2rem 0 3.5rem 0;
}

#searchform {
  position: relative;
  margin: 0 auto;
}

#searchform  label {
  /* color: var(--main-text-color); */
  color: #777;
  margin-right: 2rem;
  font-family: 'Geomanist-Bold';
  letter-spacing: 0.1rem;
}

#searchform > .row {
  line-height: var(--form-line-height);
}

#distance-slider * {
  font-family: Geomanist;
  font-size: 0.8rem;
}

.round-filter {
  display: inline-block;
  font-family: Geomanist;
  font-size: 0.8rem;
  background-color: white;
  border-radius: 1.2rem;
  user-select: none;
  box-sizing: border-box;
}

.round-filter strong {
  color: var(--main-text-color);
}

#cards {
  margin: 0 auto;
  margin-top: 1rem;
  height: 100%;
}

.short-duration.selected {
  background-color: #AC73ED !important;
}

.medium-duration.selected {
  background-color: #3EC89C !important;
}

.long-duration.selected {
  background-color: #49AFEB !important;
}

@media (max-width: 768px) {
  #content {
    width: 100%;
  }

  #whitestrip {
    padding: 0 0.5rem;
    margin: 0 -0.5rem;
  }

  #searchform {
    width: 100%;
  }

  #cards {
    margin-top: 1rem;
    width: 100%;
  }

  .col.first {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .col.second {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .col.third {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .col.event {
    width: 100%;
    padding-bottom: 0.5rem;
  }

  #location-input {
    width: 100%;
    margin-bottom: 2rem;
  }

  #distance-slider {
    width: 100%;
  }

  #filters {
    width: 100%;
  }

  #filters .col {
    width: 100%;
  }

  .round-filter {
    margin-bottom: 0.5rem;
  }

  .round-filter strong {
    margin: 0 0.3rem;
  }
}


@media (min-width: 768px) {
  #content {
    width: 100%;
  }

  #whitestrip {
    padding: 2rem 0 2.5rem 0;
  }

  #searchform {
    width: 90%;
  }

  #cards {
    width: 90%;
  }

  .col.first {
    width: 10%;
  }

  .col.second {
    width: 20%;
  }

  .col.third {
    width: 70%;
  }

  .col.event {
    width: 25%;
    margin-bottom: 1.5rem;
  }

  .col.event:nth-child(4n),
  .col.event:nth-child(4n+1),
  .col.event:nth-child(4n+2),
  .col.event:nth-child(4n+3) {
    padding-right: 0px;
  }

  #location-input {
    display: inline-block;
    width: 25%;
    margin-right: 5%;
  }

  #distance-slider {
    display: inline-block;
    width: 70%;
  }

  #filters {
    width: 100%;
    position: absolute;
    bottom: calc(-2.5rem - 1.1rem);  /* the form padding + adjust for box size */
  }

  #filters .col {
    width: 33%;
    text-align: center;
  }

  #my-events {
    padding: 0.6rem 0.6rem;
  }

  .round-filter {
    padding: 0.2rem 0.3rem;
  }

  .round-filter strong {
    margin: 0 1rem;
  }
}
</style>
