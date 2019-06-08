<template>
  <td class="border p-2" :style="'background-color: ' + color" />
</template>

<script>
export default {
  name: 'Cell',
  props: {
    color: {
      type: String,
      default: 'black',
    }
  }
}
</script>
