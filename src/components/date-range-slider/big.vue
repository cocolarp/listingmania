<template lang="pug">
#root.topmargin
  month-badge(
    v-for="month in months.thisYear",
    :key="month.key",
    :month="month",
  )
  .year.before {{ months.thisYear[0].moment.format('YYYY') }}
  .separator
  .year.after {{ months.nextYear[0].moment.format('YYYY') }}
  month-badge(
    v-for="month in months.nextYear",
    :key="month.key",
    :month="month"
  )
</template>

<script>
import {dateSliderFactory} from './base.js'

const BigDateSliderComponent = dateSliderFactory(function (month) {
  return month.format('MMM')
})

export default BigDateSliderComponent
</script>

<style scoped src="./styles.css" />
