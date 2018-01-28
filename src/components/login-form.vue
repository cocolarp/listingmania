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
        v-model="username",
        :class="{'animate-shake': shakeUsername}",
        placeholder="nom d'utilisateur",
      )
    .row(v-if="!displayLogin")
      input(
        type="text",
        v-model="email",
        :class="{'animate-shake': shakeEmail}",
        placeholder="mail@example.com",
      )
    .row
      input(
        type="password",
        v-model="password",
        :class="{'animate-shake': shakePassword}",
        placeholder="mot de passe",
      )
    .row(v-if="!displayLogin")
      input(
        type="password",
        v-model="passwordConfirmation",
        :class="{'animate-shake': shakePassword}",
        placeholder="confirmation",
      )
    .row(v-if="invalidLogin")
      b.active Nom d'utilisateur ou mot de passe erroné.
    .row(v-if="unexpectedError")
      b.active Une erreur s'est produite dans l'accès à nos serveurs. Veuillez contacter le support technique.

  #footer
    .button#ok-button(
      @click="submit",
    ) OK

</template>

<script>
import {client} from 'src/services/backent'

export default {
  data: function () {
    return {
      displayLogin: true,
      shakeUsername: false,
      shakePassword: false,
      shakeEmail: false,
      username: null,
      email: null,
      password: null,
      passwordConfirmation: null,
      invalidLogin: false,
      unexpectedError: false,
    }
  },
  methods: {
    validate () {
      if (!this.username) {
        this.shakeUsername = true
        throw "invalid username"
      }
      if (!this.displayLogin && !this.email) {
        this.shakeEmail = true
        throw "invalid email"
      }
      if (
          (this.displayLogin && !this.password) ||
          (!this.displayLogin && (
            (!this.password || !this.passwordConfirmation ||
              this.password !== this.passwordConfirmation
            )
          ))
      ) {
        this.shakePassword = true
        throw "invalid password"
      }
    },
    async submit () {
      try {
        this.validate()
      } catch (e) {
        setTimeout(() => {
          this.shakeUsername = false
          this.shakePassword = false
          this.shakeEmail = false
        }, 1000)
        return
      }
      if (this.displayLogin) {
        let token = null
        try {
          token = await client.getToken(this.username, this.password)
        } catch (e) {
          if (e.status === 400) {
            this.invalidLogin = true
          } else {
            this.unexpectedError = true
          }
          return
        }
        try {
          const user = await client.getUser()
          this.$store.commit('setUser', user)
          this.$store.commit('showLoginForm', false)
        } catch (e) {
          this.unexpectedError = true
        }
      } else {
        // do the signup
      }
    },
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
