<script>
export default {
  name: 'AdminNavDrawer',

  props: {
    links: {
      type: [Object, Array],
      default: () => [],
    },
  },

  methods: {
    genNavItem(link) {
      const props = {
        nuxt: true,
        to: link.to,
      };

      const components = [];

      if (link.children && link.children.length) {
        return this.genListGroup(link);
      }

      if (link.icon) {
        components.push(
          this.$createElement(
            'v-list-item-icon',
            {},
            this.$createElement('v-icon', {}, link.icon)
          )
        );
      }

      components.push(
        this.$createElement(
          'v-list-item-content',
          {},
          this.$createElement('v-list-item-title', {}, link.title)
        )
      );

      return this.$createElement('v-list-item', { props }, components);
    },
  },

  genListGroup(link) {
    let open = false;

    const props = {
      'no-action': true,
      'prepend-icon': link.icon,
      value: open,
    };

    const on = {
      input: (val) => this.$emit('input', val),
    };

    const scopedSlots = {
      activator: () =>
        this.$createElement(
          'v-list-item-content',
          {},
          this.$createElement('v-list-item-title', {}, link.title)
        ),
    };

    const menuItems = link.children.map(this.genNavItem);

    return this.$createElement(
      'v-list-group',
      { props, scopedSlots, on },
      menuItems
    );
  },

  computed: {
    open: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>
