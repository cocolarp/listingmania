<template lang="pug">
#content
  .row
    .col
      strong(v-translate="") Période
      check-box(
        :msg="everyTimeCheckboxLabel",
        :value="anyTime",
        @change="updateAnyTime"
      )
  .row
    .col
      date-range-slider

  .row.spacer
  .row
    .col
      strong(v-translate="") Distance
      check-box(
        :msg="anyWhereCheckboxLabel",
        :value="anyWhere",
        @change="updateAnyWhere")
  .row(v-if="!anyWhere")
    .col#location-input(
      :class="{'animate-shake': shakeLocationInput}"
    )
      location-input
    .col#distance-slider
      distance-slider

  .row.spacer
  .row
    .col
      strong(v-translate="") Préférences
      check-box(
        :msg="myEventsCheckboxLabel",
        :value="onlyMyEvents",
        @change="toggleMyEventsOnly"
      )

  .row.spacer
  .row
    #buttons.col
      .button(
        id="ok-button",
        @click="goToSearch",
        v-translate=""
      ) Trouver mon prochain GN
</template>

<script>
import merge from 'lodash.merge'

import router from 'src/routes'

import MainFiltersMixin from './main-filters.js'

const LandingPage = merge({}, MainFiltersMixin, {
  methods: {
    goToSearch () {
      if (this.canSearch) {
        router.push('events')
      } else {
        this.$store.commit('doShakeLocationInput')
      }
    },
  },
})

export default LandingPage
</script>

<style scoped>
#content {
  color: white;
  margin: 0 auto;
}

#content strong {
  font-family: 'Montserrat-Bold';
  letter-spacing: 0.1rem;
  font-size: 1.5rem;
  margin-right: 1rem;
  text-shadow: 0 0 4px rgba(0,0,0,0.30);
}

#content > .row {
  margin-top: 0.5rem;
  line-height: var(--form-line-height);
}

#distance-slider * {
  font-family: Montserrat;
  font-size: 0.8rem;
}

#buttons {
  text-align: center;
}

#ok-button {
  background-color: var(--color-orange);
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
}

.disabled {
  background-color: #ddd !important;
  cursor: not-allowed;
}

@media (max-width: 768px) { #distance-slider {
  margin-top: var(--spacer-line-height);
}}

@media (min-width: 768px) {
  #content {
    width: 65%;
  }
  #location-input {
    width: 30%;
  }
  #distance-slider {
    width: 70%;
  }
}

@media (min-width: 1600px) {
  #content {
    width: 60%;
  }
}
</style>
