<template>
<v-layout row wrap class="ma-4 text-xs-center">
  <v-flex xs12>
    <v-subheader style="display:block;">
      Trier par...
      <v-btn-toggle @change="sortChanged" class="ml-2" v-bind:items="toggle_text" v-model="toggle_exclusive"></v-btn-toggle>
    </v-subheader>
  </v-flex>
</v-layout>
</template>

<script>
import {mapState} from 'vuex'
import bus from 'src/msgbus'

export default {
  methods: {
    sortChanged: function (value) {
      bus.$emit('sort_changed', value)
    },
  },
  computed: mapState({
    toggle_exclusive: 'sortKey',
  }),
  data () {
    return {
      toggle_text: [
        { text: 'Date', value: 'start' },
        { text: 'Prix', value: 'cost' },
        { text: 'Distance', value: 'distance' },
      ],
    }
  },
}
</script>
