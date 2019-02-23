<template lang="pug">
v-app
  v-toolbar(app, clipped-left, dense, fixed, dark, color='primary')
    v-toolbar-side-icon
      img(height='28', src='~src/assets/small-logo.png')
    v-toolbar-title.white--text Cocolarp
    v-spacer
    v-btn(icon)
      v-icon account_circle
  router-view
  v-footer(app).pa-3
      div &copy; 2019 CocoLarp
      v-spacer
      v-flex.xs3
        v-select.xs4.compact-form(
          dense,
          prepend-icon="language",
          v-model="selectedLanguage",
          :items="languages",
          item-value="id",
          item-text="label",
        )
      v-flex.xs3
        v-select.xs4.compact-form(
          dense,
          prepend-icon="money",
          v-model="selectedCurrency",
          :items="currencies",
          item-value="id",
          :item-text="currencyLabel",
          @change="updateCurrency",
        )

</template>

<script>
import { mapState } from 'vuex'

import { CURRENCY_SYMBOLS } from 'src/enums'
import router from 'src/routes'
import { getBrowserLanguage } from 'src/lang_utils'

import { computeConversionTable } from 'src/models'

export default {
  components: {
  },
  data: function () {
    return {
      languages: [
        { id: 'fr_FR', label: 'Français' },
        { id: 'en_US', label: 'English' },
      ],
      selectedLanguage: 'fr_FR',
      currencies: [
        { id: 'CAD', symbol: '$', label: 'Canadian Dollar' },
        { id: 'CHF', symbol: 'CHF', label: 'Swiss Franc' },
        { id: 'DKK', symbol: 'kr', label: 'Danish Krone' },
        { id: 'EUR', symbol: '€', label: 'Euro' },
        { id: 'GBP', symbol: '£', label: 'British Pound' },
        { id: 'NOK', symbol: 'kr', label: 'Norwegian Krone' },
        { id: 'RUB', symbol: '₽', label: 'Ruble' },
        { id: 'SEK', symbol: 'kr', label: 'Swedish Krona' },
        { id: 'USD', symbol: '$', label: 'US Dollar' },
      ],
      selectedCurrency: 'EUR',
    }
  },
  methods: {
    currencyLabel (item) {
      return `${item.label} (${item.symbol})`
    },
    async updateCurrency (currencyCode) {
      const conversionTable = await computeConversionTable(currencyCode) // this is cached
      this.$store.commit('setCurrency', { currency: currencyCode, table: conversionTable })
      this.$store.commit('updateCosts')
    },
    goHome () {
      router.push({ name: 'home', query: this.$route.query })
    },
    onLoginBtnClick () {
      this.$ga.event({
        eventCategory: 'LoginButton',
        eventAction: 'click',
        eventLabel: 'is_connected',
        eventValue: this.displayName != null,
      })
      if (!this.displayName) {
        this.$store.commit('showLoginForm', true)
      } else {
        this.$store.commit('showLogoutForm', true)
      }
    },
    onCurrencyBtnClick: async function () {
      this.$ga.event({
        eventCategory: 'CurrencyButton',
        eventAction: 'click',
      })
      this.$store.commit('showCurrencyForm', true)
    },
    openAddEventForm () {
      this.$ga.event({
        eventCategory: 'AddEventButton',
        eventAction: 'click',
      })
      switch (getBrowserLanguage()) {
        case 'fr':
          window.open('https://docs.google.com/forms/d/e/1FAIpQLSdEsDJcxV4isR4QUjIKhKAyuHGqNb-mbzhTdp7k7RQOKzdj3g/viewform?c=0&w=1')
          break
        default:
          window.open('https://docs.google.com/forms/d/e/1FAIpQLScp7n5Hw1VY4UZW1NvKcrm5y1YWqkk1nIcvOQG0C0tKZafOXQ/viewform?c=0&w=1')
          break
      }
    },
  },
  computed: {
    selectedCurrencySymbol () {
      return CURRENCY_SYMBOLS[this.selectedCurrency]
    },
    ...mapState({
      canSwitchCurrencies (state) {
        return Object.keys(state.conversionTable).length > 1
      },
      displayName (state) {
        if (state.user) {
          return state.user.username
        }
        return null
      },
      loginFormDisplayed: 'loginFormDisplayed',
      logoutFormDisplayed: 'logoutFormDisplayed',
      currencyFormDisplayed: 'currencyFormDisplayed',
    }),
  },
}
</script>

<style scoped>
</style>
