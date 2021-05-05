<template>
  <v-text-field v-model="search"></v-text-field>
</template>

<script>
export default {
  name: 'SearchInput',

  props: {
    name: {
      type: String,
    },
  },
};
</script>
