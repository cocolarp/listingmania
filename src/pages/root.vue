<template lang="pug">
v-app
  v-content
    v-container(fluid, fill-height)
      v-layout(align-center, justify-center)
        v-flex(xs12, sm8, md4)
          v-card.elevation-12
            v-toolbar(dark, color="primary")
              v-toolbar-title Login form
              v-spacer
              v-tooltip(bottom)
                v-btn(
                  slot="activator",
                  href="#",
                  icon,
                  large
                  target="_blank",
                )
                  v-icon(large) code
                span Source
            v-card-text
              v-form
                v-text-field(prepend-icon="person", name="login", label="Login", type="text")
                v-text-field(id="password", prepend-icon="lock", name="password" label="Password" type="password")
            v-card-actions
              v-spacer
              v-btn(color="primary") Login
</template>

<script>
import { mapState } from 'vuex'

import { CURRENCY_SYMBOLS } from 'src/enums'
import router from 'src/routes'
import { getBrowserLanguage } from 'src/lang_utils'

import headerImg from 'src/assets/logo.png'
import smallLogoImg from 'src/assets/small-logo.png' // OMG is ugly

export default {
  components: {
  },
  data: function () {
    return {
      logoSrc: headerImg,
      smallLogoSrc: smallLogoImg,
    }
  },
  methods: {
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
      selectedCurrency: 'currency',
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
