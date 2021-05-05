<template>
  <v-menu v-model="open" close-on-content-click>
    <template #activator="{ on, attrs }">
      <v-btn small icon v-on="on" v-bind="attrs">
        <v-icon v-text="icon"></v-icon>
      </v-btn>
    </template>
    <v-list dense nav flat>
      <v-list-item
        v-for="(action, idx) in computedActions"
        :key="idx"
        link
        @click="$emit(action.label)"
      >
        <v-list-item-content>
          <v-list-item-title>
            <v-icon left small v-text="action.icon"></v-icon>
            <span>{{ action.text }}</span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'Actions',
  props: {
    actions: {
      type: Array,
      default: () => [],
    },
    suffix: {
      type: String,
    },
  },

  data() {
    return {
      open: false,
      icon: 'mdi-dots-veritcal',
    };
  },

  computed: {
    computedActions() {
      return this.actions.reduce((output, action) => {
        // const scope = action.scope.toLowerCase(),
        //   suffix = this.suffix.toLowerCase();

        // if (this.$auth.hasScope(`${scope}:${target}:${suffix}`)) {
        //   action.label = action.text.toLowerCase();
        //   action.text =
        //     action.text.charAt(0).toUpperCase() + action.text.slice(1);
        //   output.push(action);
        // }

        if (this.$auth.hasScope(action.scope)) {
          action.label = action.text.toLowerCase();
          action.text =
            action.text.charAt(0).toUpperCase() + action.text.slice(1);
          output.push(action);
        }
        return output;
      }, []);
    },
  },
};
</script>
