<template>
<v-layout row justify-center>
	<v-dialog v-model="display" persistent>
		<v-card>
			<v-card-title>
				<span class="headline">Login</span>
			</v-card-title>
			<v-card-text>
				<v-text-field label="Username" v-model="username" required></v-text-field>
				<v-text-field label="Password" v-model="password" type="password" required></v-text-field>
        <small v-if="attemptFailed">Login failed. Please try again.</small>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn class="blue--text darken-1" flat @click.stop="closeDialog()">Cancel</v-btn>
				<v-btn class="blue--text darken-1" flat @click.stop="attemptLogin()">Login</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</v-layout>
</template>

<script>
import { mapState } from 'vuex'

import {client} from 'src/services/backent'

export default {
  data () {
    return {
      username: '',
      password: '',
      attemptFailed: false,
    }
  },
  methods: {
    closeDialog: function () {
      this.$store.commit('showLoginForm', false)
    },
    attemptLogin: async function () {
      try {
        const token = await client.getToken(this.username, this.password)
        localStorage.setItem('token', token)
        const user = await client.getUser()
        this.$store.commit('setUser', user)
        this.$store.commit('showLoginForm', false)
      } catch (err) {
        this.attemptFailed = true
      }
    },
  },
	computed: mapState({
    display: 'loginFormDisplayed',
  }),
}
</script>
