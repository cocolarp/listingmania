<template>
<a
  class="btn btn-info"
  v-on:click="toggleState"
  v-bind:class="{ active: isActive }"
>{{ text }}</a>
</template>

<script>
import { mapState } from 'vuex'

const notEmpty = (value) => value && value.length > 0

export default {
  methods: {
    toggleState: function () {
      this.$emit('toggle', this.$props)
    }
  },
  computed: mapState({
    isActive: function (state) {
      return state[this.type] === this.code
    },
  }),
  props: {
    type: {
      type: String,
      required: true,
      validator: notEmpty,
    },
    code: {
      type: String,
      required: true,
      validator: notEmpty,
    },
    text: {
      type: String,
      required: true,
      validator: notEmpty,
    },
  }
}
</script>
