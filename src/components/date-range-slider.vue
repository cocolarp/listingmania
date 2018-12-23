<template lang="pug">
#root
  .month-badge(
    v-for="month in months",
    :key="month.key",
    :month="month",
    :class="{selected: month.selected}",
    @click="toggleMonth(month)",
  ) {{ month.display }}
</template>

<script>
import moment from 'moment'

import { gettext } from 'src/lang_utils'

function getMonthDisplay (month) {
  let str = month.format('MMM')
  if ([0, 11].includes(month.month())) return `${str} ${month.format('YYYY')}`
  return str
}

export default {
  props: ['selectedMonths'],
  methods: {
    toggleMonth (month) {
      this.$emit('toggle', month.key)
    },
  },
  computed: {
    months () {
      return this.selectedMonths.map((selected, i) => {
        const thatMonth = moment().add(i, 'months')
        return {
          key: i,
          moment: thatMonth,
          selected: selected,
          display: i !== this.selectedMonths.length - 1
            ? getMonthDisplay(thatMonth)
            : this.$gettext(gettext('Plus tard')),
        }
      })
    },
  },
}
</script>

<style scoped>
@import "src/variables.css";

#root {
  background-color: white;
  border-radius: 1.2rem;
  position: relative;
  user-select: none;
  box-shadow: 0 0 4px 0 rgba(0,0,0,0.20), 0 4px 0 0 rgba(0,0,0,0.10);
  padding-bottom: 1px;
  padding-left: 2px;
  text-align: center;
}

.topmargin {
  margin-top: var(--spacer-line-height);
}

#root * {
  font-family: Montserrat;
  font-size: 0.8rem;
}

.separator {
  border-left: solid 2px var(--highlight-text-color);
  height: 1rem;
  margin-top: 0.8rem;
}

.year {
  position: relative;
  display: inline;
  top: -2rem;
  color: white;
  font-weight: bold;
}

.year.before {
  margin-left: -1.5rem;
}

.year.after {
  margin-right: -1.5rem;
}

.month-badge {
  color: var(--highlight-text-color);
  border-radius: 1.2rem;
  display: inline-block;
  white-space: nowrap;
  padding: 0 0.5rem;
  border: transparent solid 1px;
  cursor: pointer;
  box-sizing: border-box;
  /* Some black magic... 100% / 13 items = 7% more or less. */
  min-width: 7%;
  margin: 0.2rem 0.1%;
}

.month-badge:hover {
  color: black;
  border: #dedede solid 1px;
}

.selected {
  background-color: var(--color-orange);
  border: solid 1px var(--color-orange);
  color: white;
  box-shadow: 0 0 1px 0 rgba(0,0,0,0.20), 0 2px 0 0 rgba(0,0,0,0.10);
}
</style>
