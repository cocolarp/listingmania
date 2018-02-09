<template lang="pug">
#main
  #wrapper
    .row#mobile-navbar
      img(:src="smallLogoSrc", @click="goHome")
      #mobile-buttons
        .round-button
          .icon-add
        .round-button
          .icon-user
        .round-button(@click="displaySearchBar")
          .icon-more
    .row#navbar
      #user.nav-item
        .button(@click="onLoginBtnClick")
          span(:class="[displayName ? 'icon-logout' : 'icon-user']")
          span &nbsp;
          span {{ displayName || 'Connexion' }}
      #new-event.nav-item
        .button
          span.icon-add
          span Annoncer un GN
    .row#logo
      .col(@click="goHome")
        img(:src="logoSrc")
        #motto Le calendrier le plus exhaustif des jeux de rôle grandeur nature français & internationaux
    .row#top-spacer.spacer
    .row#pages
      router-view
    .row.spacer
  .row#footer
    router-link(to="/about") A propos
    span |
    a(href="https://www.facebook.com/LarpCollaborativeCommunity/", target="_blank") Suivez-nous sur Facebook
    span |
    router-link(to="/faq") FAQ
    span |
    router-link(to="/map") Plan du site
  #login-form(:class="{show: loginFormDisplayed}")
    login-form
</template>

<script>
import { mapState, mapMutations } from 'vuex'

import router from 'src/routes'

import loginForm from 'src/components/login-form.vue'

import headerImg from 'src/assets/logo.png'
import smallLogoImg from 'src/assets/small-logo.png'  // OMG is ugly

export default {
  components: {
    'login-form': loginForm,
  },
  data: function () {
    return {
      logoSrc: headerImg,
      smallLogoSrc: smallLogoImg,
    }
  },
  methods: {
    goHome () {
      router.push({name: 'home'})
    },
    onLoginBtnClick () {
      if (!this.displayName) {
        this.$store.commit('showLoginForm', true)
      } else {
        this.$store.commit('setUser', null)
      }
    },
    ...mapMutations({
      displaySearchBar: 'toggleMobileSearchBar',
    })
  },
  computed: mapState({
    displayName (state) {
      if (state.user) {
        return state.user.username
      }
    },
    loginFormDisplayed: 'loginFormDisplayed',
  }),
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

@media (min-width: 768px) {
  #navbar {
    float: right;
  }
  #mobile-navbar {
    display: none;
  }
}

@media (max-width: 768px) {
  #navbar, #logo, #footer, #top-spacer {
    display: none;
  }
}

#motto {
  font-family: 'Geomanist-Bold';
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

.round-button {
  color: #333;
  margin: 0.3rem;
  background-color: white;
  padding: 0.6rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border: solid 1px #ddd;
  border-radius: 50%;
  cursor: pointer;
}

#login-form {
  position: absolute;
  top: 5%;
  left: 35%;
  width: 30%;
  display: none;
}

.show {
  display: block !important;
}
</style>
