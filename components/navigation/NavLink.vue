<template>
  <v-list-item :nuxt="nuxt" :to="to" v-if="!hasChildren && !button">
    <v-list-item-icon v-if="icon">
      <v-icon>{{ icon }}</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>{{ title }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>

  <v-list-item link v-else-if="!hasChildren && button">
    <v-list-item-icon>
      <v-icon>{{ icon }}</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>{{ title }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>

  <v-list-group
    no-action
    v-model="open"
    exact-active-class="primary"
    :sub-group="subGroup"
    :prepend-icon="icon"
    v-else
  >
    <template v-slot:activator>
      <v-list-item-content>
        <v-list-item-title>{{ title }}</v-list-item-title>
      </v-list-item-content>
    </template>
    <template v-for="(child, idx) in children">
      <nav-link
        :key="idx"
        :title="child.title"
        :icon="child.icon"
        :subGroup="true"
        :children="child.children"
        v-if="child.children"
      ></nav-link>
      <nav-link
        :key="idx"
        :title="child.title"
        :icon="child.icon"
        :to="child.to"
        v-else
      ></nav-link>
    </template>
  </v-list-group>
</template>

<script>
export default {
  name: 'NavLink',
  props: {
    nuxt: {
      type: Boolean,
      default: true,
    },
    button: {
      type: Boolean,
      default: false,
    },
    to: {
      type: [String, Object],
      default: '/',
    },
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
    },
    subGroup: {
      type: Boolean,
      default: false,
    },
    children: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    hasChildren() {
      return this.children && this.children.length > 0;
    },
  },
};
</script>