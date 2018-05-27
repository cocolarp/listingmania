(<template lang="pug">
#main
  #wrapper
    .row#mobile-navbar
      img(:src="smallLogoSrc", @click="goHome")
      #mobile-buttons
        .round-button(@click="onCurrencyBtnClick")
          span {{ selectedCurrencySymbol}}
        .round-button(@click="openAddEventForm")
          .icon-add
        .round-button(@click="onLoginBtnClick")
          div(:class="[displayName ? 'icon-logout' : 'icon-user']")
    .row#navbar
      #currencies.nav-item
        .button(@click="onCurrencyBtnClick")
          span(v-translate="") Monnaie:
          span &nbsp;
          span {{ selectedCurrencySymbol }}
      #user.nav-item
        .button(@click="onLoginBtnClick")
          span(:class="[displayName ? 'icon-logout' : 'icon-user']")
          span &nbsp;
          span(v-if="displayName") {{ displayName }}
          span(v-else, v-translate="") Connexion
      #new-event.nav-item
        .button(@click="openAddEventForm")
          span.icon-add
          span(v-translate="") Annoncer un GN
    .row#logo
      .col(@click="goHome")
        img(:src="logoSrc")
        translate(tag="div")#motto Le calendrier le plus exhaustif des jeux de rôle grandeur nature français & internationaux
    .row#top-spacer.spacer
    .row#pages
      router-view
    .row.spacer
  .row#footer
    router-link(to="/about", v-translate="") A propos
    span |
    a(href="https://www.facebook.com/LarpCollaborativeCommunity/", target="_blank", v-translate="") Suivez-nous sur Facebook
    span |
    router-link(to="/faq", v-translate="") FAQ
  #login-backdrop(:class="{show: loginFormDisplayed || logoutFormDisplayed || currencyFormDisplayed}")
  #login-form(:class="{show: loginFormDisplayed}")
    login-form
  #logout-form(:class="{show: logoutFormDisplayed}")
    logout-form
  #currency-form(:class="{show: currencyFormDisplayed}")
    currency-form
</template>)

<script>
import { mapState } from 'vuex'

import {CURRENCY_SYMBOLS} from 'src/models'
import router from 'src/routes'
import {getBrowserLanguage} from 'src/lang_utils'

import currencyForm from 'src/components/currency-form.vue'
import loginForm from 'src/components/login-form.vue'
import logoutForm from 'src/components/logout-form.vue'

import headerImg from 'src/assets/logo.webp'
import smallLogoImg from 'src/assets/small-logo.webp' // OMG is ugly

export default {
  components: {
    'currency-form': currencyForm,
    'login-form': loginForm,
    'logout-form': logoutForm,
  },
  data: function () {
    return {
      logoSrc: headerImg,
      smallLogoSrc: smallLogoImg,
    }
  },
  methods: {
    goHome () {
      router.push({name: 'home', query: this.$route.query})
    },
    onLoginBtnClick () {
      if (!this.displayName) {
        this.$store.commit('showLoginForm', true)
      } else {
        this.$store.commit('showLogoutForm', true)
      }
    },
    onCurrencyBtnClick: async function () {
      this.$store.commit('showCurrencyForm', true)
    },
    openAddEventForm () {
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
      selectedCurrency: 'currency',
      displayName (state) {
        if (state.user) {
          return state.user.username
        }
      },
      loginFormDisplayed: 'loginFormDisplayed',
      logoutFormDisplayed: 'logoutFormDisplayed',
      currencyFormDisplayed: 'currencyFormDisplayed',
    }),
  },
}
</script>

<style scoped>
#main {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
}

#footer {
  margin-top: auto;
  height: 2rem;
  right: 0;
  bottom: 0;
  left: 0;
  text-align: right;
  font-size: 0.8rem;
  color: white;
  text-shadow: 0 0 2px rgba(0,0,0,0.30);
}

#footer a {
  margin: 0rem 1rem;
}

@media (min-width: 1200px) {
  #navbar {
    float: right;
  }
  #mobile-navbar {
    display: none;
  }
  #login-form, #logout-form, #currency-form {
    top: 4rem;
    left: 35%;
    width: 30%;
  }
}

@media (min-width: 768px) and  (max-width: 1200px) {
  #navbar {
    float: right;
  }
  #mobile-navbar {
    display: none;
  }
  #login-form, #logout-form, #currency-form {
    top: 4rem;
    left: 20%;
    width: 60%;
  }
}

@media (max-width: 768px) {
  #navbar, #logo, #footer, #top-spacer {
    display: none;
  }
  #login-form, #logout-form, #currency-form {
    top: 10rem;
    left: 5%;
    width: 90%;
  }
}

#motto {
  font-family: 'Montserrat-Bold';
  color: white;
  font-style: italic;
  text-shadow: 0 0 2px rgba(0,0,0,0.30);
}

#mobile-navbar {
  padding: 0.3rem 0;
}

#mobile-navbar img {
  cursor: pointer;
  height: var(--mobile-logo-height);
  display: inline-block;
}

#logo {
  text-align: center;
}

#logo img {
  cursor: pointer;
  height: var(--logo-height);
}

.nav-item {
  line-height: var(--navbar-height);
  display: inline-block;
  vertical-align: middle;
}

#mobile-buttons {
  float: right;
}

#login-form, #logout-form, #currency-form {
  position: absolute;
  display: none;
}

#login-backdrop {
  position: absolute;
  display: none;
  width: 100%;
  height: 100%;
  background-color: rgba(200,200,200,0.80)
}

.show {
  display: block !important;
}
</style>
