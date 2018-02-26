<template lang="pug">
#content
  .row
    .col(v-if="!$language.current.startsWith('fr')")
      i English version coming, sorry for the inconvenience.
  .row
    .col
      h1(v-translate="") Définitions
      ul
        li(v-translate="") "Nous” ou “CoCoLarp” : L’ensemble des individus qui constitue notre collectif “CoCoLarp”.
        li(v-translate="") “Site” : L'ensemble des sites, pages et services en ligne proposés par CoCoLarp sur www.cocolarp.com.
        li(v-translate="") “Usager” : La personne utilisant le Site et les services.
        li(v-translate="") “Contenu Usager” : Les données transmises par l'Usager au sein du site.
        li(v-translate="") “Membre” : L'Usager devient Membre après s’être connecté.e sur le site.
        li(v-translate="") “GN” : Jeu de rôle grandeur nature, un loisir convivial aux possibilités illimités

      h1(v-translate="") Description du service
      p(v-translate="") CoCoLarp propose deux services :
      ul
        li(v-translate="") Un moteur de recherche et de filtres pour des jeux de rôle grandeur nature et des conventions ayant lieu partout dans le monde
        li(v-translate="") L’ajout et la mise à jour des jeux de rôle grandeur nature dans certaines régions où une communauté CoCoLarp effectue une veille constante

      h1(v-translate="") Accès au site
      p(v-translate="") CoCoLarp s’efforce de permettre l’accès au site 24 heures sur 24, 7 jours sur 7, sauf en cas de force majeure ou d’un événement hors du contrôle de CoCoLarp, et sous réserve des éventuelles pannes et interventions de maintenance nécessaires au bon fonctionnement du site et des services. Par conséquent,CoCoLarp ne peut garantir une disponibilité du site et/ou des services, une fiabilité des transmissions et des performances en terme de temps de réponse ou de qualité.
      p(v-translate="") La responsabilité de CoCoLarp ne saurait être engagée en cas d’impossibilité d’accès et/ou d’utilisation des services. Par ailleurs, CoCoLarp peut être amené à interrompre le site ou une partie des services, à tout moment sans préavis, le tout sans droit à indemnités. L’Usager reconnaît et accepte que CoCoLarp ne soit pas responsable des interruptions, et des conséquences qui peuvent en découler pour l’Usager ou tout tiers.

      h1(v-translate="") Propriété intellectuelle
      p(v-translate="") Les marques, logos, signes et tout autre contenu du site font l'objet d'une protection par le Code de la propriété intellectuelle et plus particulièrement par le droit d'auteur. Cela vaut tout particulièrement pour le nom “CoCoLarp”, le logo représentant une hirondelle Africaine (ou Européenne) portant une noix de coco et l’image de fond du Site, utilisée également pour la communication.
      p(v-translate="") CoCoLarp ne saurait être tenu responsable des contenus écrits par les Usagers. Bien que CoCoLarp effectue une modération a priori, ceux-ci sont de la seule responsabilité de l’Usager. L'Usager s'engage à ne pas mettre en ligne de contenus pouvant porter atteinte aux intérêts de tierces personnes, ou aller à l’encontre de la loi de son pays et de celui qui héberge le Site (la France). Tout recours en justice contre le site, engagé par un tiers lésé ou par des services de justice, sera pris en charge par l'Usager.
      p(v-translate="") Le contenu de l'Usager peut être à tout moment et pour n'importe quelle raison supprimé ou modifié par CoCoLarp. L'Usager ne reçoit, pour le moment, aucune notification préalablement à la suppression ou à la modification du contenu Usager.

      h1(v-translate="") Notre responsabilité
      p(v-translate="") Les informations et/ou documents figurant sur ce site et/ou accessibles par ce site sont, en partie, générés par la communauté d'Usagers de CoCoLarp.
      p(v-translate="") Ces informations et/ou documents sont susceptibles de contenir des inexactitudes techniques et des erreurs typographiques. CoCoLarp se réserve le droit de les corriger, dès que ces erreurs sont portées à sa connaissance.
      p(v-translate="") Les informations et/ou documents disponibles sur ce site sont susceptibles d’être modifiés à tout moment, et peuvent avoir fait l’objet de mises à jour.
      p(v-translate="") L’utilisation des informations et/ou documents disponibles sur ce site se fait sous l’entière et seule responsabilité de l’Usager, qui assume la totalité des conséquences pouvant en découler, sans que CoCoLarp puisse être recherché à ce titre, et sans recours contre ce dernier.
      p(v-translate="") CoCoLarp ne pourra en aucun cas être tenu responsable de tout dommage de quelque nature qu’il soit résultant de l’interprétation ou de l’utilisation des informations et/ou documents disponibles sur ce site.
      p(v-translate="") Le site CoCoLarp propose notamment des liens hypertextes vers d’autres sites présents sur le réseau Internet. Les liens vers ces autres ressources vous font quitter le site CoCoLarp vers des sites tiers. Les sites tiers où mènent ces liens n'engagent en rien la responsabilité de CoCoLarp qui n'a pas le contrôle de ces sites tiers. L'Usager s'interdit donc à engager la responsabilité du Site concernant le contenu et les ressources relatives à ces liens hypertextes sortants.

      h1(v-translate="") Données collectées et utilisation
      p(v-translate="") Dans la cadre de l'utilisation du site, CoCoLarp est susceptible de collecter les données d'identification (identifiant et adresse e-mail) et les données de connexion (adresses IP, journaux d'évènement).
      p(v-translate="") Les données d'identification (identifiant et adresse e-mail) sont nécessaires à la création d'un compte membre permettant notamment de bénéficier d'une fonctionnalité de création d’une liste de GNs “favoris”, et dans le futur, d’autres fonctionnalités encore. Ces données servent strictement à créer et gérer votre compte Usager sur le site CoCoLarp. Vos données ne font l'objet d'aucune communication à des tiers.
      p(v-translate="") Certaines des données techniques de votre appareil sont collectées automatiquement par le site. Ces informations incluent notamment votre adresse IP, fournisseur d'accès à Internet, configuration matérielle, configuration logicielle, type et langue du navigateur... Ces informations nous aident à personnaliser et à améliorer continuellement votre expérience sur notre site.
      p(v-translate="") Vos données ne font l'objet d'aucune communication à des tiers. Vous êtes toutefois informé.e.s qu'elles pourront être divulguées en application d'une loi, d'un règlement ou en vertu d'une décision d'une autorité réglementaire ou judiciaire compétente.
      p(v-translate="") Vous pouvez demander, sans motif, la modification, la suppression ou la portabilité de vos données à : conversation@cocolarp.com

      h1(v-translate="") Cookies
      p(v-translate="") En vue d’adapter le site aux demandes de ses visiteurs, nous mesurons le nombre de visites, le nombre de pages vues ainsi que l'activité des visiteurs sur le site et leur fréquence de retour.
      p(v-translate="") Conformément aux recommandations de la CNIL, la durée maximale de conservation des cookies est de 13 mois au maximum après leur premier dépôt dans votre terminal.

      h1(v-translate="") Droit applicable et juridiction compétente
      p(v-translate="") La législation française s'applique au présent contrat. En cas d'absence de résolution amiable d'un litige né entre les parties, seuls les tribunaux de la ville de Paris sont compétents.


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
