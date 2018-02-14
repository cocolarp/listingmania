<template lang="pug">
#content
  #whitestrip
    #searchform(:class="{hide: hideOnMobile}")
      .row
        .col.first
          label(v-translate="") Période
        .col.second
          check-box(
            :msg="everyTimeCheckboxLabel",
            :value="anyTime",
            @change="updateAnyTime"
          )
        .col.third
          date-range-slider
      .spacer
      .row
        .col.first
          label(v-translate="") Distance
        .col.second
          check-box(
            :msg="anyWhereCheckboxLabel",
            :value="anyWhere",
            @change="updateAnyWhere"
          )
        .col.third(v-if="!anyWhere")
          #location-input(
            :class="{'animate-shake': shakeLocationInput}"
          )
            location-input
          #distance-slider
            distance-slider

      #filters
        .row
          .col
            .round-filter#my-events
              check-box(
                :msg="myEventsCheckboxLabel",
                :value="onlyMyEvents",
                @change="toggleMyEventsOnly"
              )
          .col
            .round-filter
              strong(v-translate="") Format
              multi-sort-badge(
                class='short-duration',
                stateProperty='durationFilter',
                stateMutation='toggleDurationFilter',
                value=0,
                :badgeText='shortFormatLabel',
              )
              multi-sort-badge(
                class='medium-duration',
                stateProperty='durationFilter',
                stateMutation='toggleDurationFilter',
                value=1,
                :badgeText='mediumFormatLabel',
              )
              multi-sort-badge(
                class='long-duration',
                stateProperty='durationFilter',
                stateMutation='toggleDurationFilter',
                value=2,
                :badgeText='longFormatLabel',
              )
          .col
            .round-filter
              strong(v-translate="") Tri
              sort-badge(
                stateProperty='sortKey',
                stateMutation='setSortKey',
                value='start',
                :badgeText="dateFilterLabel"
              )
              sort-badge(
                stateProperty='sortKey',
                stateMutation='setSortKey',
                value='cost',
                :badgeText='costFilterLabel'
              )
              sort-badge(
                v-if="shouldDisplayDistanceFilter",
                stateProperty='sortKey',
                stateMutation='setSortKey',
                value='distance',
                :badgeText='distanceFilterLabel'
              )
  #cards
    .row#result-count
      .col
        translate(
          :translate-n="events.length",
          translate-plural="%{ events.length } résultats",
        ) %{ events.length } résultat
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
  computed: {
    shortFormatLabel () { return this.$gettext('COURT') },
    mediumFormatLabel () { return this.$gettext('MOYEN') },
    longFormatLabel () { return this.$gettext('LONG') },
    dateFilterLabel () { return this.$gettext('DATE') },
    costFilterLabel () { return this.$gettext('COÛT') },
    distanceFilterLabel () { return this.$gettext('DISTANCE') },
    ...mapState({
      hideOnMobile (state) {
        return state.hideMobileSearchBar
      },
      shouldDisplayDistanceFilter (state) {
        return !state.anyWhere && state.place
      },
      events: (state) => {
        return state.rawEvents.filter((event) => {
          const eventMonth = event.start.diff(today, 'month')
          return (
            (
              !state.onlyMyEvents ||
              (
                state.user && event.isLiked
              )
            ) &&
            (
              state.durationFilter[DURATIONS.indexOf(event.durationCategory)]
            ) &&
            (
              (state.selectedMonths[eventMonth] === true) ||
              (eventMonth > 12 && state.selectedMonths.slice(-1)[0] === true)
            ) &&
            (
              (state.anyWhere) ||
              (event.distance < state.maxDistance)
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
  },
})
export default EventsPage
</script>

<style scoped>
#content {
  font-family: Montserrat;
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
  font-family: 'Montserrat-Bold';
  letter-spacing: 0.1rem;
}

#searchform > .row {
  line-height: var(--form-line-height);
}

#distance-slider * {
  font-family: Montserrat;
  font-size: 0.8rem;
}

.round-filter {
  display: inline-block;
  font-family: Montserrat;
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

  .hide {
    display: none;
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
    width: 18%;
  }

  .col.third {
    width: 72%;
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
