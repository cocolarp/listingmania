<template lang="pug">
.month-badge(
  :class="{selected: month.selected}",
  @click="toggle",
) {{ month.display }}
</template>

<script>
export default {
  props: ['month'],
  methods: {
    toggle: function () {
      this.$store.commit('toggleMonth', this.month.key)
    },
  },
}
</script>

<style scoped>
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
