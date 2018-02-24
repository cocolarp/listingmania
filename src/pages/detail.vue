<template lang="pug">
#content
  .row#graystrip
    .col#return
      .small-button(@click="$router.go(-1)")
        .icon-left-open
      span(translate="") Retour aux résultats de la recherche
    .col#add-like
      span(translate="") Ajouter à mes GNs favoris
      span &nbsp;
      .heart(
        @click="likeEvent"
        :style="{color: heartColor}"
        @mouseenter="doHighlightHeart()",
        @mouseleave="resetHeart()"
      ) &#x2764;
  .row(v-if="!event")
    .col
      strong(translate) Loading event {{$route.params.slug}}…
  .row#detail(v-else)
    .col#metadata
      .group
        p.blue
          strong(translate="") Débute le
          strong &nbsp;
          strong {{ event.start.format('LL') }}
        p.blue {{ event.humanDuration }}
      .group
        p
          strong {{ event.raw.location.name }}
        p
          strong {{ event.raw.location.address }} ({{event.raw.location.country}})
      .group
        p
          span(translate="") Coût joueur:
          span &nbsp;
          strong {{ event.readable_cost }}
        p(v-if="event.npc_readable_cost")
          span(translate="") Coût PNJ:
          span &nbsp;
          strong {{ event.npc_readable_cost }}
      .group
        p
          a(:href="event.raw.external_url", target="_blank", translate="") Site officiel
          a(v-if="event.raw.facebook_event", :href="event.raw.facebook_event", target="_blank", translate="") Evénement Facebook
          a(v-if="event.raw.facebook_page", :href="event.raw.facebook_page", target="_blank", translate="") Groupe Facebook
          a(v-if="event.raw.facebook_group", :href="event.raw.facebook_group", target="_blank", translate="") Page Facebook
          a(v-if="event.raw.player_signup_page", :href="event.raw.player_signup_page", target="_blank", translate="") Inscription joueur
          a(v-if="event.raw.npc_signup_page", :href="event.raw.npc_signup_page", target="_blank", translate="") Inscription PNJ
      p
        .button(translate="", @click="suggestChanges") Proposer des modifications
    .col#description
      h1 {{ event.name }}
      i {{ event.summary}}
      p.carriage-returns {{ event.description }}
</template>

<script>
/* global Backent */
import merge from 'lodash.merge'

import {BackentEvent} from 'src/models'

import HeartMixin from 'src/components/heart-mixin.js'

const EventDetail = merge({}, HeartMixin, {
  data: function () {
    return {
      event: null,
      highlightHeart: false,
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData',
  },
  methods: {
    suggestChanges () {
      window.open('mailto:mickael@cocolarp.com')
    },
    fetchData: async function () {
      try {
        const event = await Backent.getEvent(this.$route.params.slug)
        this.event = BackentEvent(event, this.$store.state.user)
      } catch (_err) {
        console.log('event could not be found')
        setTimeout(() => {
          this.$router.push({name: 'home'})
        }, 3000)
      }
    },
  },
})

export default EventDetail
</script>

<style scoped>
#content {
  margin-top: 0.5rem;
  color: white;
  margin: 0 auto;
}

#content > .row {
  line-height: var(--form-line-height);
}

#graystrip {
  margin: 0;
  background-color: #ddd;
  padding: 0.5rem 1rem;
  color: #333;
}

#graystrip .col {
  width: 50%;
}

#add-like {
  text-align: right;
}

.small-button {
  box-shadow: 0 0 4px 0 rgba(0,0,0,0.20), 0 4px 0 0 rgba(0,0,0,0.10);
  height: var(--form-line-height);
  line-height: var(--form-line-height);
  display: inline-block;
  text-align: center;
  min-width: 2rem;
  margin: 0 1rem;
  cursor: pointer;
  border-radius: 1rem;
  background-color: var(--color-orange);
  color: white;
  box-sizing: border-box;
  border: solid 1px var(--color-orange);
}

#detail {
  margin: 0;
  background-color: white;
  color: var(--highlight-text-color);
  padding: 2rem;
}

#metadata {
  width: 30%;
  text-align: center;
}

#description {
  width: 70%;
  border-left: 1px solid var(--highlight-text-color);
}

.blue {
  color: #49afeb;
}

a {
  font-family: 'Montserrat-Bold';
  color: var(--color-orange);
  display: block;
}

.group {
  -webkit-margin-before: 1rem;
  -webkit-margin-after: 1rem;
}

.group p {
  -webkit-margin-before: 0;
  -webkit-margin-after: 0;
}

.carriage-returns {
  white-space: -moz-pre-wrap; /* Firefox */
  white-space: -pre-wrap; /* ancient Opera */
  white-space: -o-pre-wrap; /* newer Opera */
  white-space: pre-wrap; /* Chrome; W3C standard */
  word-wrap: break-word; /* IE */
}

.heart {
  display: inline-block;
  font-size: 1.6rem;
  cursor: pointer;
}

@media (min-width: 768px) {
}
@media (min-width: 1600px) {
}
</style>
