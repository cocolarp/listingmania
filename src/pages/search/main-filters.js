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
    ...mapMutations([
      'updateAnyTime',
      'updateAnyWhere',
      'toggleMyEventsOnly',
    ]),
  },
  computed: mapState({
    anyTime: (state) => {
      return state.selectedMonths.every((x) => x === true)
    },
    anyWhere: 'anyWhere',
    onlyMyEvents: 'onlyMyEvents',
  }),
}
