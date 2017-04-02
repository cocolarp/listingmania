<template>
<tr>
  <td style="white-space:nowrap;">{{ start.format('ll') }}</td>
  <td class="truncate"><a :href="url" target="_blank">{{ name }}</a></td>
  <td class="truncate">{{ organization }}</td>
  <td style="white-space:nowrap;">{{ country }}</td>
  <td>{{ region }}</td>
</tr>
</template>

<script>
function notEmpty (value) {
  return value && value.length > 0
}
export default {
  props: {
      start: {
          type: Object,
          required: true,
      },
      organization: {
          type: String,
          required: true,
          validator: notEmpty,
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
      country: {
          type: String,
          required: true,
          validator: notEmpty,
      },
      region: {
          type: String,
          required: true,
          validator: notEmpty,
      },
  }
}
</script>
