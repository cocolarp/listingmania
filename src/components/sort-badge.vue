<template lang="pug">
.badge(
  :class="{selected: isSelected}",
  @click="setSortKey"
) {{ badgeText }}
</template>

<script>
import {mapState} from 'vuex'

export default {
  props: {
    'stateProperty': {type: String},
    'stateMutation': {type: String},
    'value': {type: String},
    'badgeText': {type: String},
  },
  computed: {
    isSelected () {
      return this.value === this.$store.state[this.stateProperty]
    },
  },
  methods: {
    setSortKey () {
      if (this.canToggle && this.isSelected) {
        this.$store.commit(this.stateMutation, null)
      } else {
        this.$store.commit(this.stateMutation, this.value)
      }
    },
  },
}
</script>

<style scoped>
.badge {
  display: inline-block;
  vertical-align: middle;
  border-radius: 1.2rem;
  vertical-align: middle;
  padding: 0.5rem;
  cursor: pointer;
  margin: 0 0.2rem;
  font-weight: 600;
  color: var(--highlight-text-color);
  box-sizing: border-box;
  border: transparent solid 1px;
}

.badge:hover {
  color: var(--main-text-color);
  border: #dedede solid 1px;
}

.badge.selected {
  background-color: var(--color-orange);
  border: solid 1px transparent;
  color: white;
  box-shadow: 0 0 1px 0 rgba(0,0,0,0.20), 0 2px 0 0 rgba(0,0,0,0.10);
}
</style>
