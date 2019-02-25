<template lang="pug">
v-container
  v-layout(align-center, row, justify-center)
    v-flex(xs12, sm8, md4)
      v-card.elevation-12
        v-toolbar(dark, color='primary')
          v-toolbar-title
            v-btn(flat, @click="signupMode = false") Login
          v-spacer
          v-btn(flat, color="orange accent-2", @click="signupMode = true") Sign up
        v-card-text
          v-form(v-model="isValid")
            v-text-field(
              prepend-icon='person',
              name='login',
              v-model="username",
              :rules="usernameRules",
              label='Login',
              type='text',
              required,
            )
            v-text-field(
              v-if="signupMode",
              prepend-icon='person',
              :rules="emailRules",
              name='email',
              v-model="email",
              label='E-Mail',
              type='text',
              required,
            )
            v-text-field#password(
              prepend-icon='lock',
              name='password',
              v-model="password",
              label='Password',
              type='password',
              :rules="passwordRules",
              required,
            )
            v-text-field#passwordConfirmation(
              v-if="signupMode",
              prepend-icon='lock',
              name='password',
              v-model="password2",
              :rules="passwordRules2",
              label='Password',
              type='password',
              required,
            )
        v-card-actions
          v-spacer
          v-btn(color='green darken-1', flat='flat', @click="$emit('close')") Cancel
          v-btn(
            color='primary',
            @click="submit",
            :disabled="!isValid",
          ) Submit
</template>

<script>
/* global Backent */

export default {
  data: function () {
    return {
      isValid: false,
      username: null,
      email: null,
      password: null,
      password2: null,
      signupMode: false,
      usernameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length > 4) || 'Name must be more than 4 characters long'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length > 6) || 'Password must be more than 6 characters long'
      ],
    }
  },
  computed: {
    passwordRules2 () {
      return [(v) => (!!v && v) === this.password || 'Values do not match']
    },
  },
  methods: {
    async submit () {
      if (this.signupMode) {
        try {
          await Backent.signup(
            this.username,
            this.email,
            this.password,
            this.password2,
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
        }
      } else {
        await this._doLogin()
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
  },
}
</script>

<style scoped>
</style>
