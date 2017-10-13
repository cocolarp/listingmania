<template>
  <v-app id="example-2">
    <v-container style="max-width:1024px;">

      <login-form></login-form>

      <v-layout row wrap>
        <v-flex xs12 class="text-xs-right">
          <v-btn @click.stop="openLoginForm" icon>
            <v-icon>account_circle</v-icon>
          </v-btn>
          <span v-if="username">{{ username }}</span>
        </v-flex>
      </v-layout>

      <v-layout row wrap class="overflow-over-navbar">
        <v-flex xs12 class="text-xs-center">
          <img :src="logoSrc" id="headerImg">
        </v-flex>
      </v-layout>

      <search-filters></search-filters>

      <sort-filters></sort-filters>

      <v-layout row wrap>
        <larp-card v-for='larp in larps' :key='larp.id' v-bind='larp'></larp-card>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import sortby from 'lodash.sortby'
import { mapState } from 'vuex'

import headerImg from 'src/logo.png'  // OMG is ugly

import larpCard from './larp-card.vue'
import loginForm from './login-form.vue'
import searchFilters from './search-filters.vue'
import sortFilters from './sort-filters.vue'

export default {
  data: function () {
    return {
      logoSrc: headerImg,
    }
  },
  components: {
    'login-form': loginForm,
    'larp-card': larpCard,
    'search-filters': searchFilters,
    'sort-filters': sortFilters,
  },
  methods: {
    openLoginForm: function () {
      this.$store.commit('showLoginForm', true)
    },
  },
  computed: mapState({
    username: function (state) {
      if (state.user) return state.user.username
    },
    larps: function (state) {
      let larps = state.rawLarps.map((x) => x)  // copy

      if (state.startDate) larps = larps.filter((d) => d.start.isAfter(state.startDate))
      if (state.endDate) larps = larps.filter((d) => d.end.isBefore(state.endDate))
      if (state.maxDistance) larps = larps.filter((d) => d.distance <= state.maxDistance)

      return sortby(larps, state.sortKey)
    },
  }),
}
</script>
