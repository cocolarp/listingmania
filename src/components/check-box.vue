<template lang="pug">
.main(@click="toggle")
  input(type="checkbox", v-model="checked")
  label {{ msg }}
</template>

<script>
export default {
  props: ['msg', 'value'],
  methods: {
    toggle: function () {
      this.$emit('change', !this.checked)
    },
  },
  watch: {
    'value': function (value) {
      this.checked = value
    },
  },
  data: function () {
    return {
      checked: this.value,
    }
  },
}
</script>

<style scoped>
.main {
  display: inline-block;
  cursor: pointer;
  font-size: 0.8rem;
  user-select: none;
  font-size: 0.9rem;
}

input[type=checkbox] {
  -moz-appearance:none;
  -webkit-appearance:none;
  -o-appearance:none;
  background-color: white;
  margin-top: 0;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 0.2rem;
  display: inline-block;
  cursor: pointer;
  vertical-align: middle;
  border: solid 1px #bbb;
  box-sizing: border-box;
}

input[type=checkbox]:checked::before {
  content: '\2714';
  color: #666;
  padding-left: 2px;
  padding-top: -4px;
}

.main > label {
  cursor: pointer;
}
</style>
