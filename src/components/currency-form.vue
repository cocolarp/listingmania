<template lang="pug">
#main
  #header
    p(v-translate="") Choisissez votre devise ci-dessous:
    #close-button(
      @click='closeForm'
    ) ✖
  #content
    .row
      .button(
        @click="submit('EUR')",
        v-translate="",
      ) Euro (€)
    .row
      .button(
        @click="submit('CHF')",
        v-translate="",
      ) Franc Suisse (CHF)
    .row
      .button(
        @click="submit('GBP')",
        v-translate="",
      ) Livre Sterling (£)
    .row
      .button(
        @click="submit('SEK')",
        v-translate="",
      ) Couronne Suédoise (kr)
    .row
      .button(
        @click="submit('USD')",
        v-translate="",
      ) Dollars US ($)

</template>

<script>
import {computeConversionTable} from 'src/models'

export default {
  methods: {
    async submit (destCurrency) {
      const conversionTable = await computeConversionTable(destCurrency)  // this is cached
      this.$store.commit('setCurrency', {currency: destCurrency, table: conversionTable})
      this.$store.commit('updateCosts')
      this.$store.commit('showCurrencyForm', false)
    },
    closeForm () {
      this.$store.commit('showCurrencyForm', false)
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
