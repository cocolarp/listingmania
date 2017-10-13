<template lang="pug">
#main
  #wrapper
    .row#navbar
      #user.nav-item
        .button(@click="openLoginForm")
          span &#x1F464;&nbsp;
          span {{ displayName || 'Connexion' }}
      #new-event.nav-item
        .button
          span &#x271A;&nbsp;
          span Annoncer un GN
    .row#logo
      #logo.col(@click="goHome")
        img(:src="logoSrc")
        #motto L'annuaire communautaire des jeux de rôle
    .row.spacer
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
</template>

<script>
import { mapState } from 'vuex'

import router from 'src/routes'

import headerImg from 'src/assets/logo.png'  // OMG is ugly

export default {
  data: function () {
    return {
      logoSrc: headerImg,
    }
  },
  methods: {
    goHome () {
      router.push({name: 'home'})
    },
    openLoginForm () {
      this.$store.commit('showLoginForm', true)
    },
  },
  computed: mapState({
    displayName: function (state) {
      if (state.user) {
        return state.user.username
      }
    },
  }),
}
</script>

<style scoped>
#main {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
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
}

@media (max-width: 768px) {
  #navbar {
    text-align: center;
  }
}

#motto {
  font-family: 'Geomanist-Bold';
  color: white;
  font-style: italic;
  text-shadow: 0 0 2px rgba(0,0,0,0.30);
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
</style>
