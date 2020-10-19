<script>
import {
  VList,
  VIcon,
  VMenu,
  VListItem,
  VListItemIcon,
  VListItemContent,
  VListItemGroup,
} from 'vuetify/lib';

import pick from 'lodash/pick';

export default {
  name: 'NavLink',

  components: {
    VList,
    VIcon,
    VMenu,
    VListItem,
    VListItemIcon,
    VListItemContent,
    VListItemGroup,
  },

  props: {
    nuxt: {
      type: Boolean,
      default: true,
    },
    direction: {
      type: String,
      default: 'horizontal',
      validator: (val) => {
        const valid = ['horizontal', 'vertical'];
        return valid.includes(val);
      },
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

  methods: {
    genMenu(children, title) {
      const scopedSlots = {
        activator: ({ on }) =>
          this.$createElement(
            'a',
            {
              staticClass: 'v-tab',
              on,
            },
            [title]
          ),
      };

      const menuList = children.map((link) => {
        const childProps = { nuxt: true, to: link.to };

        const item = this.$createElement(
          'v-list-item',
          link.children && link.children.length
            ? {}
            : { nuxt: true, to: link.to, exact: true },
          [
            link.children && link.children.length
              ? this.genMenu(link.children, link.title)
              : this.$createElement('v-list-item-content', {}, [
                  this.$createElement('v-list-item-title'),
                  {},
                  [link.title],
                ]),
          ]
        );
      });

      return this.$createElement('v-menu', { scopedSlots }, [menuList]);
    },

    genHorizontalLink() {
      const props = Object.assign({}, this.linkProps, { exact: true });

      return this.children && this.children.length
        ? this.genMenu(this.children, this.title)
        : this.$createElement('n-link', { props }, [this.title]);
    },
  },

  computed: {
    hasChildren() {
      return this.children && this.children.length > 0;
    },

    linkProps() {
      return pick(this.$props, ['to', 'title', 'icon']);
    },
  },
};
</script>