<template lang="pug">
#content
  .row
    .col
      p(v-translate="") Nous sommes un collectif de bénévoles indépendant sans objectif lucratif.
      p(v-translate="") Nous sommes une cheffe de projet, un webdesigner, un développeur et Michael pour porter une vision au long terme et un ancrage dans le réel grâce à son expérience à gérer un calendrier de jeux de rôle grandeur nature pendant deux ans.
      p(v-translate="") C’est ce calendrier que l’on a voulu changer en site web ambitieux, toujours gratuit, sans publicité, et de qualité professionnelle, en open source. Il sera toujours aussi fiable, parce qu’on n’attend pas que les organisations nous contactent : on ajoute la majorité des jeux nous-mêmes et avec notre communauté.
      p(v-translate="") Ce service que nous rendons à la communauté internationale du GN, nous le faisons pour le plaisir, pour suivre nos idéaux d'intelligence collective, d'accessibilité et de transparence. Grâce à ça, les joueuses et les joueurs peuvent découvrir la variété des jeux existants dans leur région et s'inscrire à ceux qui leur conviendront le mieux. Et les équipes d'organisation utilisent CoCoLarp pour choisir la date de leur jeu, sans concurrence avec les autres. 
      p(v-translate="") Merci à toutes celles et ceux qui ont contribué à CoCoLarp jusqu’à présent, sous une forme ou une autre:
      ul
        li Mathieu D.
        li Diane D.
        li Laurent K.
        li Sören G.
        li Guillaume H
        li Mickael H.
        li Victor P.
        li Adrien V.
        li Jeanne V.
        li Maxime V.
        li Stéphane R.
        li Christophe S.
</template>

<script>
export default {}
</script>

<style scoped>
#content {
  margin: 0 auto;
  margin-top: 0.5rem;
  background-color: white;
  color: var(--highlight-text-color);
}

#content > .row {
  line-height: var(--form-line-height);
}

@media (max-width: 768px) {
  #content {
    width: 100%;
  }
  .col {
    padding: 1rem 2.5rem;
  }
}
@media (min-width: 768px) {
  #content {
    padding: 1rem 3rem;
    width: 50%;
  }
}
</style>
