<template lang="pug">
#main
  #header
    p.icon-user(style="font-size: 30px;")
    p Connectez-vous ou inscrivez-vous pour profiter du meilleur de Cocolarp …
    #close-button(
      @click='closeLoginForm'
    ) ✖
</template>

<script>
export default {
  methods: {
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

#close-button {
  position: absolute;
  cursor: pointer;
  top: 10px;
  right: 20px;
  color: #333;
}
</style>
