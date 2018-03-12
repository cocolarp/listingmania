<template lang="pug">
#main
  #header
    .icon-user(style="font-size: 30px; margin-top: 1rem;")
    p(v-translate="") Connectez-vous ou inscrivez-vous pour profiter du meilleur de Cocolarp …
    #close-button(
      @click='closeLoginForm'
    ) ✖
  #content
    .row
      a(
        href='#',
        :class="{active: displayLogin}",
        @click="toggleLogin",
        v-translate="",
      ) Connexion
      span &nbsp;|&nbsp;
      a(
        href='#',
        :class="{active: !displayLogin}",
        @click="toggleSignup",
        v-translate="",
      ) Inscription
    .row
      input(
        autofocus,
        type="text",
        required,
        v-model="username",
        :class="{'animate-shake': shakeUsername}",
        :placeholder="usernamePlaceholder",
        @keyup.enter="submit",
        @keyup.esc="closeLoginForm",
      )
    .row(v-if="!displayLogin")
      input(
        type="email",
        required,
        v-model="email",
        :class="{'animate-shake': shakeEmail}",
        placeholder="mail@example.com",
        @keyup.enter="submit",
        @keyup.esc="closeLoginForm",
      )
    .row
      input(
        type="password",
        required,
        v-model="password",
        :class="{'animate-shake': shakePassword}",
        :placeholder="passwordPlaceholder",
        @keyup.enter="submit",
        @keyup.esc="closeLoginForm",
      )
    .row(v-if="!displayLogin")
      input(
        type="password",
        required,
        v-model="passwordConfirmation",
        :class="{'animate-shake': shakePassword}",
        :placeholder="passwordConfirmationPlaceholder",
        @keyup.enter="submit",
        @keyup.esc="closeLoginForm",
      )
    .row(v-if="!displayLogin")
      check-box(
        :class="{'animate-shake': shakeGcus}",
        msg="",
        :value="gcusAccepted",
        @change="updateGcusAccepted"
      )
      strong(v-translate="") J'ai lu et accepte les
      span &nbsp;
      a(target="_blank", :href="$router.resolve('terms').href", v-translate="") conditions générales d'utilisation
    .row(v-show="!displayLogin")
      #recaptcha
    .row(v-if="invalidLogin")
      b.active(v-translate="") Nom d'utilisateur ou mot de passe erroné.
    .row(v-if="unexpectedError")
      b.active(v-translate="") Une erreur s'est produite dans l'accès à nos serveurs. Veuillez contacter le support technique.

  #footer
    .button#ok-button(
      @click="submit",
      v-translate="",
    ) OK

</template>

<script>
/* global Backent, RecaptchaLoad */

import checkBox from 'src/components/check-box.vue'

export default {
  components: {
    'check-box': checkBox,
  },
  data: function () {
    return {
      displayLogin: true,
      shakeUsername: false,
      shakePassword: false,
      shakeEmail: false,
      shakeGcus: false,
      username: null,
      email: null,
      password: null,
      passwordConfirmation: null,
      gcusAccepted: false,
      invalidLogin: false,
      unexpectedError: false,
      captchaVerified: false,
    }
  },
  computed: {
    usernamePlaceholder () { return this.$gettext("nom d'utilisateur") },
    passwordPlaceholder () { return this.$gettext('mot de passe') },
    passwordConfirmationPlaceholder () {
      return this.$pgettext('password input field', 'confirmation')
    },
  },
  mounted () {
    RecaptchaLoad.then(() => {
      grecaptcha.render('recaptcha', {
        'sitekey': '6LfwHi8UAAAAAAcPnsYGLTrqWudhe36AaEwZqZhZ',
        'callback': () => {
          this.captchaVerified = true
        },
      })
    })
  },
  methods: {
    updateGcusAccepted () {
      this.gcusAccepted = !this.gcusAccepted
    },
    validate () {
      if (!this.username) {
        this.shakeUsername = true
        throw new Error('invalid username')
      }
      if (!this.displayLogin && !this.email) {
        this.shakeEmail = true
        throw new Error('invalid email')
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
        throw new Error('invalid password')
      }
      if (!this.displayLogin && !this.gcusAccepted) {
        this.shakeGcus = true
        throw new Error('please accept gcus')
      }
      if (!this.displayLogin && !this.captchaVerified) {
        throw new Error('please check the captcha')
      }
    },
    async _doLogin () {
      try {
        await Backent.getToken(this.username, this.password)
      } catch (e) {
        if (e.status === 400) {
          this.invalidLogin = true
        } else {
          this.unexpectedError = true
        }
        return
      }
      try {
        const user = await Backent.getUser()
        this.$store.commit('setUser', user)
        this.$store.commit('showLoginForm', false)
      } catch (e) {
        this.unexpectedError = true
      }
    },
    _resetShakes () {
      setTimeout(() => {
        this.shakeUsername = false
        this.shakePassword = false
        this.shakeEmail = false
        this.shakeGcus = false
      }, 1000)
    },
    async submit () {
      try {
        this.validate()
      } catch (e) {
        this._resetShakes()
        return
      }

      if (this.displayLogin) {
        await this._doLogin()
      } else {
        try {
          await Backent.signup(
            this.username,
            this.email,
            this.password,
            this.passwordConfirmation,
          )
          await this._doLogin()
        } catch (response) {
          if (response.status === 400) {
            switch (response.responseText) {
              case 'email':
                this.shakeEmail = true
                break
              case 'username':
                this.shakeUsername = true
                break
              default:
                this.shakePassword = true
                break
            }
          } else {
            this.unexpectedError = true
          }
          this._resetShakes()
        }
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
  },
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

@media (max-width: 768px) {
  #content input[type="text"], input[type="email"], input[type="password"] {
    margin: auto;
    width: 90%;
  }
  #recaptcha {
    margin: auto;
    width: 90%;
  }
}

@media (min-width: 768px) {
  #content input[type="text"], input[type="email"], input[type="password"] {
    margin: auto;
    width: 60%;
  }
  #recaptcha {
    margin: auto;
    width: 80%;
  }
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

a {
  font-family: 'Montserrat-Bold';
  display: inline-block;
}
</style>
