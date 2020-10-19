<template>
  <section id="event-options">
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <span>Allow RVSP</span>
          </v-list-item-title>
          <v-list-item-subtitle>
            <span>Enable participants to sign up for an event.</span>
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-switch v-model="_rvsp"></v-switch>
        </v-list-item-action>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <span>Event Visibility</span>
          </v-list-item-title>
          <v-list-item-subtitle>
            <span
              >Enable to choose which roles can see this event. Defaults to
              member.</span
            >
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <!-- <event-switch v-model="showRoles"></event-switch> -->
          <v-switch v-model="showRoles"></v-switch>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <event-role-list v-model="computedRoles" v-if="showRoles"></event-role-list>
  </section>
</template>

<script>
import EventSwitch from './EventSwitch.vue';
import EventRoleList from './EventRoleList.vue';
export default {
  name: 'EventDialogOptions',
  components: { EventSwitch, EventRoleList },
  props: {
    rvsp: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      showRoles: false,
    };
  },

  computed: {
    _rvsp: {
      get() {
        return this.rvsp;
      },
      set(val) {
        this.$emit('update:rvsp', val);
      },
    },

    computedRoles: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
};
</script>