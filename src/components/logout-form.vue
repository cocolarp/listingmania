<template lang="pug">
#main
  #header
    .icon-user(style="font-size: 30px; margin-top: 1rem;")
    p(v-translate="") Voulez-vous vous déconnecter ?
    #close-button(
      @click='close'
    ) ✖

  #footer
    .button#ok-button(
      @click="submit",
      v-translate="",
    ) Oui
    .button#no-button(
      @click="close",
      v-translate="",
    ) Annuler

</template>

<script>
export default {
  methods: {
    async submit () {
      this.$store.commit('setUser', null)
      this.close()
    },
    close () {
      this.$store.commit('showLogoutForm', false)
    },
  },
}
</script>

<style scoped>
@import "src/variables.css";

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
  left: 10%;
}

#no-button {
  color: white;
  background-color: #dedede;
  position: absolute;
  bottom: -1rem;
  right: 10%;
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
