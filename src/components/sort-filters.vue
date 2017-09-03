<template>
<v-layout row wrap class="ma-4 text-xs-center">
  <v-flex xs12>
    <v-subheader style="display:block;">
      Trier par...
      <v-btn-toggle class="ml-2" v-model="currentBtn">
        <v-btn flat>Date</v-btn>
        <v-btn flat>Prix</v-btn>
        <v-btn flat>Distance</v-btn>
      </v-btn-toggle>
    </v-subheader>
  </v-flex>
</v-layout>
</template>

<script>
import bus from 'src/msgbus'

const SORT_KEYS = ['start', 'cost', 'distance']

export default {
  computed: {
    currentBtn: {
      get: function () {
        return SORT_KEYS.indexOf(this.$store.state.sortKey)
      },
      set: function (newValue) {
        bus.$emit('sort_changed', SORT_KEYS[newValue])
      },
    },
  },
}
</script>
