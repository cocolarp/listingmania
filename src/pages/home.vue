<template lang="pug">
#content
  .row
    .col
      strong(v-translate="") Période
      check-box(
        :msg="everyTimeCheckboxLabel",
        :value="anytime",
        @change="updateAnyTime"
      )
  .row
    .col
      date-range-slider(
        :selected-months="months"
        @toggle="toggleMonth"
      )

  .row.spacer
  .row
    .col
      strong(v-translate="") Distance
      check-box(
        :msg="anyWhereCheckboxLabel",
        :value="anywhere",
        @change="updateAnyWhere"
      )
  .row(v-if="!anywhere")
    .col#location-input(
      :class="{'animate-shake': shakeLocationInput}"
    )
      location-input(
        :place="place"
        @change="updatePlace"
      )
    .col#distance-slider
      distance-slider(
        :place="place"
        :distance="max_distance"
        @change="updateMaxDistance"
        @warn="_doShakeLocationInput"
      )

  .row.spacer
  .row
    .col
      strong(v-translate="") Préférences
      check-box(
        :msg="myEventsCheckboxLabel",
        :value="my_events",
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
import router from 'src/routes'

import SearchMixin from 'src/mixins/search.js'

export default {
  mixins: [SearchMixin],
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.updateInstanceData.call(vm, to.query)
    })
  },
  methods: {
    goToSearch () {
      if (this.canSearch) {
        router.push({name: 'events', query: this.$route.query})
      } else {
        this._doShakeLocationInput()
      }
    },
  },
}
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
