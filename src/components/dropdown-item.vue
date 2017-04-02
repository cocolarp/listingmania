<template>
<li v-on:click="toggleState" class='dropdown-item'>
	<a href='#'>{{ text }}</a>
</li>
</template>

<script>
const notEmpty = (value) => value && value.length > 0

export default {
  methods: {
    toggleState: function () {
      this.$emit('toggle', this.$props)
    }
  },
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
