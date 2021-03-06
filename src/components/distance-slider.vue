<template lang="pug">
#root(
  @mousemove="mouseMove",
  @touchmove="touchMove",
  @mousedown="setupEventTrap($event, 'mouseup')",
)
  #distance-badges
    .distance-badge(
      v-for="(dist, key) in distances",
      :key="dist.text",
      :class="{active: dist.active}",
      @click="setSliderIndex(key)",
    ) {{ dist.text }}
  #background(:style="{ width: `${posX}px` }")
  #button(
    :style="{ left: `${posX}px` }",
    @touchstart="setupEventTrap($event, 'touchend')",
  )
</template>

<script>
import throttle from 'lodash/throttle'

const BUTTON_SIZE = 16 // in px. And it's empiric.

const DISTANCES_ENUM = [10, 50, 150, 250, 500]
const DISTANCES = DISTANCES_ENUM.map((d) => {
  return {
    value: d,
    text: `${d}kms`,
    active: false,
  }
})

let stopPoints = null // this will be filled when mounting the component

function closestStopPointIndex (x, threshold = BUTTON_SIZE / 3) {
  const distances = stopPoints.map((p) => Math.abs(p - x))
  const minDistance = Math.min(...distances)
  if (minDistance < threshold) return distances.indexOf(minDistance)
}

export default {
  props: ['distance', 'place'],
  data: function () {
    return {
      dockedPosX: 0,
      posX: 0,
      mouseDown: false,
      distances: DISTANCES,
    }
  },
  mounted () {
    const tabWidth = this.$el.clientWidth / DISTANCES.length
    stopPoints = DISTANCES.map((d, i) => i * tabWidth + (tabWidth - BUTTON_SIZE) / 2)
    this.initPosition()
  },
  watch: {
    distance: function (newDistance) {
      this.initPosition()
    },
  },
  methods: {
    initPosition () {
      const selectedIndex = DISTANCES_ENUM.indexOf(this.distance)
      this.setSliderIndex(selectedIndex, false)
    },
    setSliderIndex (i, checkState = true) {
      if (checkState && !this.place) {
        this.$emit('warn')
        return
      }
      this.distances.forEach((dist) => {
        dist.active = false
      })
      this.distances[i].active = true
      this.dockedPosX = this.posX = stopPoints[i]
      this.$emit('change', DISTANCES_ENUM[i])
    },
    setupEventTrap (event, eventKind) {
      event.preventDefault()
      const handleMouseUp = () => {
        document.removeEventListener(eventKind, handleMouseUp)
        this.posX = this.dockedPosX
      }
      document.addEventListener(eventKind, handleMouseUp)
    },
    processSliderMove (sliderXPosition) {
      const newPosition = sliderXPosition - this.$el.getBoundingClientRect().x - BUTTON_SIZE / 2
      if (newPosition < 0) return // before slider
      if (newPosition > this.$el.clientWidth - BUTTON_SIZE / 2) return // after slider
      const closest = closestStopPointIndex(newPosition, BUTTON_SIZE)
      if (closest) {
        this.setSliderIndex(closest)
      } else {
        this.posX = newPosition
      }
    },
    touchMove: throttle(function (event) {
      this.processSliderMove(event.touches[0].pageX)
    }, 50), // ms
    mouseMove: throttle(function (event) {
      if (event.buttons === 1) {
        this.processSliderMove(event.pageX)
      } else {
        this.posX = this.dockedPosX
      }
    }, 50), // ms
  },
}
</script>

<style scoped>
@import "src/variables.css";

#root {
  background-color: white;
  border-radius: 1.2rem;
  display: inline-block;
  height: 0.8rem;
  width: 100%;
  vertical-align: middle;
  position: relative;
  user-select: none;
  box-shadow: 0 0 4px 0 rgba(0,0,0,0.20), 0 4px 0 0 rgba(0,0,0,0.10);
}
#distance-badges {
  width: 100%;
  position: absolute;
  top: -1.7rem;
  display: flex;
  justify-content: space-around;
}
.distance-badge {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: bold;
}

.active, .distance-badge:hover {
  cursor: pointer;
  color: black;
  text-shadow: white 0px 0px 10px;
}

#background {
  width: 70px;
  background-color: var(--color-orange);
  height: 0.4rem;
  border-radius: 1.2rem;
  position: absolute;
  top: 0.2rem;
  left: 0.2rem;
  box-shadow: 0 0 1px 0 rgba(0,0,0,0.20);
}

#button {
  background-color: white;
  height: 1rem;
  width: 1rem;
  border-radius: 1.2rem;
  position: absolute;
  top: -0.1rem;
  cursor: pointer;
  box-shadow: 0 0 1px 0 rgba(0,0,0,0.20), 0 2px 0 0 rgba(0,0,0,0.10);
}
</style>
