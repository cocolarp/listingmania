import {mapState} from 'vuex'
import moment from 'moment'

import monthBadge from './month-badge.vue'

export function dateSliderFactory (monthFormatCallback) {
  return {
    components: {
      'month-badge': monthBadge,
    },
    computed: mapState({
      months: function (state) {
        const months = {
          thisYear: [],
          nextYear: [],
        }
        const currentYear = moment().year()
        state.selectedMonths.forEach((selected, i) => {
          const thatMonth = moment().add(i, 'months')
          const month = {
            key: i,
            moment: thatMonth,
            selected: selected,
            display: i !== state.selectedMonths.length - 1
              ? monthFormatCallback(thatMonth)
              : this.$gettext('Plus tard'),
          }
          if (month.moment.year() === currentYear) {
            months.thisYear.push(month)
          } else {
            months.nextYear.push(month)
          }
        })
        return months
      },
    }),
  }
}
