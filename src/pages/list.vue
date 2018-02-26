<template lang="pug">
#content
  #whitestrip
    #hamburger-menu.round-button(@click="displaySearchBar")
      .icon-more
    #searchform(:class="{hide: hideOnMobile}")
      .row
        .col.first
          label(v-translate="") Période
        .col.second
          check-box(
            :msg="everyTimeCheckboxLabel",
            :value="anytime",
            @change="updateAnyTime"
          )
        .col.third
          date-range-slider(
            :selected-months="months"
            @toggle="toggleMonth"
          )
      .spacer
      .row
        .col.first
          label(v-translate="") Distance
        .col.second
          check-box(
            :msg="anyWhereCheckboxLabel",
            :value="anywhere",
            @change="updateAnyWhere"
          )
        .col.third(v-if="!anywhere")
          #location-input(
            :class="{'animate-shake': shakeLocationInput}"
          )
            location-input(
              :place="place"
              @change="updatePlaceAndKms"
            )
          #distance-slider
            distance-slider(
              :place="place"
              :distance="max_distance"
              @change="updateMaxDistance"
              @warn="_doShakeLocationInput"
            )

      #filters
        .row
          .col
            .round-filter#my-events
              check-box(
                :msg="myEventsCheckboxLabel",
                :value="my_events",
                @change="toggleMyEventsOnly"
              )
          .col
            .round-filter
              strong(v-translate="") Format
              multi-sort-badge(
                class='short-duration',
                :sort_key="durations"
                @toggle="toggleDuration"
                value=0,
                :badgeText='shortFormatLabel',
              )
              multi-sort-badge(
                class='medium-duration',
                :sort_key="durations"
                @toggle="toggleDuration"
                value=1,
                :badgeText='mediumFormatLabel',
              )
              multi-sort-badge(
                class='long-duration',
                :sort_key="durations"
                @toggle="toggleDuration"
                value=2,
                :badgeText='longFormatLabel',
              )
          .col
            .round-filter
              strong(v-translate="") Tri par
              sort-badge(
                :sort_key="sort"
                @toggle="setSortKey"
                value='start',
                :badgeText="dateFilterLabel"
              )
              sort-badge(
                :sort_key="sort"
                @toggle="setSortKey"
                value='cost',
                :badgeText='costFilterLabel'
              )
              sort-badge(
                v-show="shouldDisplayDistanceFilter",
                :sort_key="sort"
                @toggle="setSortKey"
                value='distance',
                :badgeText='distanceFilterLabel'
              )
  #cards
    .row#result-count
      .col
        span(v-if="!isLoaded", v-translate="") Veuillez patienter, nous chargeons les événements...
        translate(
          v-else,
          :translate-n="events.length",
          translate-plural="%{ events.length } résultats",
        ) %{ events.length } résultat
    .row
      .col.event(v-for="event in events", :key="event.id")
        event-card(:event="event", :anywhere="anywhere")

</template>

<script>
/* global Backent */

import moment from 'moment'

import * as models from 'src/models'
import eventCard from 'src/components/event-card.vue'
import sortBadge from 'src/components/sort-badge.vue'

import SearchMixin from 'src/mixins/search.js'

const startOfMonth = moment().startOf('month')

const multiSortBadge = {
  mixins: [sortBadge],
  props: {
    'sort_key': {type: Array},
  },
  computed: {
    isSelected () {
      return this.sort_key[this.value]
    },
  },
}

export default {
  mixins: [SearchMixin],
  components: {
    'event-card': eventCard,
    'sort-badge': sortBadge,
    'multi-sort-badge': multiSortBadge,
  },
  beforeRouteEnter: async function (to, from, next) {
    // FIXME: not 100% ideal since we could wait either events or getPlace to get this done
    const events = await Backent.getEvents()
    next((vm) => {
      vm.rawEvents = models.transformBackentData(events)
      vm.isLoaded = true
      vm.updateInstanceData.call(vm, to.query)
    })
  },
  data: function () {
    return {
      rawEvents: [],
      isLoaded: false,
      hideOnMobile: true,
    }
  },
  watch: {
    place: function () {
      if (this.place) {
        this.computeKms()
      }
    },
  },
  methods: {
    displaySearchBar () {
      this.hideOnMobile = !this.hideOnMobile
    },
    hasCompatibleDuration (event) {
      let index = {
        [models.DURATION_HOURS]: 0,
        [models.DURATION_SHORT]: 0,
        [models.DURATION_MEDIUM]: 1,
        [models.DURATION_LONG]: 2,
      }[event.durationCategory]
      return this.durations[index]
    },
    computeKms () {
      const lat = this.place.geometry.location.lat()
      const lng = this.place.geometry.location.lng()
      this.rawEvents.forEach((event, i) => {
        event.computeDistance(lat, lng)
      })
    },
    updatePlaceAndKms (place) {
      this.updatePlace(place)
      this.computeKms()
    },
  },
  computed: {
    shortFormatLabel () { return this.$gettext('COURT') },
    mediumFormatLabel () { return this.$gettext('MOYEN') },
    longFormatLabel () { return this.$gettext('LONG') },
    dateFilterLabel () { return this.$gettext('DATE') },
    costFilterLabel () { return this.$gettext('COÛT') },
    distanceFilterLabel () { return this.$gettext('DISTANCE') },
    events () {
      return this.rawEvents.filter((event) => {
        const eventMonth = event.start.diff(startOfMonth, 'month')
        return (
          (
            !this.my_events ||
            (
              this.$store.getters.isLiked(event)
            )
          ) &&
          (
            this.hasCompatibleDuration(event)
          ) &&
          (
            (this.months[eventMonth] === true) ||
            (eventMonth > 12 && this.months.slice(-1)[0] === true)
          ) &&
          (
            (this.anywhere) ||
            (event.distance < this.max_distance)
          )
        )
      }).sort((eventA, eventB) => {
        switch (this.sort) {
          case 'start':
            return eventA.start.diff(eventB.start, 'days')
          default:
            return eventA[this.sort] - eventB[this.sort]
        }
      })
    },
    shouldDisplayDistanceFilter () {
      return !this.anytime && this.place
    },
  },
}
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

  #hamburger-menu {
    display: none;
  }
}
</style>
