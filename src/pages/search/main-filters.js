import {mapState, mapMutations} from 'vuex'

import checkBox from 'src/components/check-box.vue'
import dateRangeSlider from 'src/components/date-range-slider/inline.vue'
import distanceSlider from 'src/components/distance-slider.vue'
import locationInput from 'src/components/location-input.vue'

export default {
  components: {
    'check-box': checkBox,
    'distance-slider': distanceSlider,
    'date-range-slider': dateRangeSlider,
    'location-input': locationInput,
  },
  methods: {
    toggleMyEventsOnly (value) {
      if (this.$store.state.user) {
        this.$store.commit('toggleMyEventsOnly', value)
      } else {
        this.$store.commit('showLoginForm', true)
      }
    },
    updateAnyWhere (value) {
      if (!this.$store.state.place) {
        this.$store.commit('doShakeLocationInput')
      }
      this.$store.commit('updateAnyWhere', value)
    },
    ...mapMutations({
      updateAnyTime: 'updateAnyTime',
    }),
  },
  computed: {
    everyTimeCheckboxLabel () { return this.$gettext('Toutes les dates') },
    anyWhereCheckboxLabel () { return this.$gettext('Dans le monde entier') },
    myEventsCheckboxLabel () { return this.$gettext('Mes GNs uniquement') },
    ...mapState({
      anyTime: (state) => {
        return state.selectedMonths.every((x) => x === true)
      },
      canSearch (state) {
        return (state.anyWhere || state.place)
      },
      anyWhere: 'anyWhere',
      onlyMyEvents: 'onlyMyEvents',
      shakeLocationInput: 'shakeLocationInput',
    }),
  },
}
