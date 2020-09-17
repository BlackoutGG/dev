<template>
  <v-dialog v-model="value" persistent :max-width="maxWidth">
    <v-card>
      <v-card-title>Delete {{ numOfItemsMarkedForDeletion }} items</v-card-title>
      <v-card-text>
        Do you wish to proceed and delete the selected item(s)? This action is
        irrevesible.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="primary" @click="deleteAll">OK</v-btn>
        <v-btn text @click="$emit('cancel')">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'TableDeleteConfirmDialog',

  props: {
    length: {
      type: Number,
    },
    value: {
      type: Boolean,
      default: false,
    },
    single: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      maxWidth: 300,
    };
  },

  methods: {
    deleteAll() {
      this.$emit('deleteAll');
      this.$emit('input', false);
    },
  },

  computed: {
    numOfItemsMarkedForDeletion() {
      return this.single ? 1 : length;
    },
  },
};
</script>
