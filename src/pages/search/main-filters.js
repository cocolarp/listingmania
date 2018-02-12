import {mapState, mapMutations} from 'vuex'

import checkBox from 'src/components/check-box.vue'
import dateRangeSlider from 'src/components/date-range-slider/inline.vue'
import distanceSlider from 'src/components/distance-slider.vue'
import locationInput from 'src/components/location-input.vue'

import {gettext} from 'src/lang_utils'

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
    ...mapMutations({
      updateAnyTime: 'updateAnyTime',
      updateAnyWhere: 'updateAnyWhere',
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
      anyWhere: 'anyWhere',
      onlyMyEvents: 'onlyMyEvents',
    }),
  }
}
