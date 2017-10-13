<template lang="pug">
#root
  month-badge(
    v-for="month in months.thisYear",
    :key="month.key",
    :month="month",
  )
  month-badge(
    v-for="month in months.nextYear",
    :key="month.key",
    :month="month"
  )
</template>

<script>
import {dateSliderFactory} from './base.js'

function getMonthDisplay (month) {
  let str = month.format('MMM')

  if ([0, 11].includes(month.month())) return `${str} ${month.format('YYYY')}`

  return str
}

const InlineDateSliderComponent = dateSliderFactory(getMonthDisplay)

export default InlineDateSliderComponent
</script>

<style scoped src="./styles.css" />
