<template lang="pug">
#main
  #header
    .icon-user(style="font-size: 30px; margin-top: 1rem;")
    p Connectez-vous ou inscrivez-vous pour profiter du meilleur de Cocolarp …
    #close-button(
      @click='closeLoginForm'
    ) ✖
  #content
    .row
      a(
        href='#',
        :class="{active: displayLogin}",
        @click="toggleLogin",
      ) Connexion
      span &nbsp;|&nbsp;
      a(
        href='#',
        :class="{active: !displayLogin}",
        @click="toggleSignup",
      ) Inscription
    .row
      input(
        type="text",
        placeholder="nom d'utilisateur",
      )
    .row(:style="{display: displayLogin ? 'none' : 'block'}")
      input(
        type="text",
        placeholder="mail@example.com",
      )
    .row
      input(
        type="password",
        placeholder="mot de passe",
      )
    .row(:style="{display: displayLogin ? 'none' : 'block'}")
      input(
        type="password",
        placeholder="confirmation",
      )
  #footer
    .button#ok-button OK

</template>

<script>
export default {
  data: function () {
    return {
      displayLogin: true,
    }
  },
  methods: {
    toggleLogin () {
      this.displayLogin = true
    },
    toggleSignup () {
      this.displayLogin = false
    },
    closeLoginForm () {
      this.$store.commit('showLoginForm', false)
    },
  }
}
</script>

<style scoped>
#main {
  background-color: white;
  border: solid 1px #ddd;
  text-align: center;
  border-radius: 1rem;
}

#header {
  padding: 0 3rem;
  color: var(--color-orange);
  position: relative;
}

#content {
  padding: 0.5rem;
  background-color: #eee;
  font-size: 0.9em;
}

#content .row {
  margin-bottom: 1rem;
  text-align: center;
}

#content input[type="text"], input[type="password"] {
  margin: auto;
  width: 60%;
}

#footer {
  height: 2rem;
  position: relative;
  width: 100%;
}

#ok-button {
  color: white;
  background-color: var(--color-orange);
  position: absolute;
  bottom: -1rem;
  left: 33%;
}

#close-button {
  position: absolute;
  cursor: pointer;
  top: 10px;
  right: 20px;
  color: #333;
}

.active {
  color: var(--color-orange);
}
</style>
