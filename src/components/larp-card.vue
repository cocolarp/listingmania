<template>
    <v-flex xs12 sm6 md4>
      <v-card class="mb-4">

        <v-card-title class="blue-grey lighten-4 smallpadding">
          <span>{{ start.format('ll') }}</span>
          <v-spacer></v-spacer>
          <v-menu id="space" bottom left origin="top right" transition="v-scale-transition">
            <v-btn icon="icon" slot="activator" @click.native="openLink">
              <v-icon>link</v-icon>
            </v-btn>
          </v-menu>
        </v-card-title>

        <v-card-text class="blue-grey lighten-3 title truncate">{{ name }}</v-card-text>

        <v-card-media height="200px">
          <v-container fill-height fluid>
            <v-layout fill-height>
              <v-flex xs12 align-end flexbox>
                <span>{{ description }}</span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-media>

        <v-card-actions class="blue-grey lighten-4 mt-0">
          <span>
            <v-icon>explore</v-icon>
            {{ address }}
            <span v-show="distance!=null"> ({{distance}} km)</span>
          </span>
          <v-spacer></v-spacer>
          <span>{{ readable_cost }}</span>
        </v-card-actions>
      </v-card>
    </v-flex>
</template>

<script>
function notEmpty (value) {
  return value && value.length > 0
}
export default {
  methods: {
    openLink: function () {
      window.open(this.url, '_blank')
    },
  },
  props: {
    address: {
      type: String,
      required: true,
      validator: notEmpty,
    },
    readable_cost: {
      type: String,
      required: true,
      validator: notEmpty,
    },
    start: {
      type: Object,
      required: true,
    },
    name: {
      type: String,
      required: true,
      validator: notEmpty,
    },
    url: {
      type: String,
      required: true,
      validator: notEmpty,
    },
    description: {
      type: String,
      required: true,
      validator: notEmpty,
    },
    distance: {
      type: Number,
      required: false,
    },
  },
}
</script>

<style>
.smallpadding {
  padding: 0px 16px;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
