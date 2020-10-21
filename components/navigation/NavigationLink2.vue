<script>
import {
  VList,
  VTab,
  VIcon,
  VMenu,
  VListItem,
  VListItemIcon,
  VListItemContent,
  VListItemGroup,
} from 'vuetify/lib';

import pick from 'lodash/pick';

export default {
  name: 'NavigationLink',

  components: {
    VList,
    VTab,
    VIcon,
    VMenu,
    VListItem,
    VListItemIcon,
    VListItemContent,
    VListItemGroup,
  },

  props: {
    direction: {
      type: String,
      default: 'horizontal',
      validator: (val) => {
        const valid = ['horizontal', 'vertical'];
        return valid.includes(val);
      },
    },
    link: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      open: false,
    };
  },

  methods: {
    genMenu(children, element, child, opts, _props) {
      const scopedSlots = {
        activator: ({ on }) => {
          const options = Object.assign({}, opts, { on: on });
          return this.$createElement(element, options, child);
        },
      };

      const defaultProps = {
        'offset-y': true,
        bottom: true,
      };

      const props = Object.assign({}, defaultProps, _props);

      const menuList = children.map(this.genMenuItem);

      return this.$createElement('v-menu', { scopedSlots, props }, [
        this.$createElement('v-list', {}, [menuList]),
      ]);
    },

    genMenuItem(link) {
      const props = { nuxt: true, exact: true };

      const hasChildren =
        link.hasOwnProperty('children') &&
        link.children &&
        link.children.length;

      if (link.to) Object.assign(props, { to: link.to });

      if (hasChildren) {
        const menuProps = {
          'offset-y': false,
          'offset-x': true,
          bottom: false,
          top: true,
          right: true,
        };

        return this.genMenu(
          link.children,
          'v-list-item',
          [
            this.$createElement('v-list-item-content', {}, [
              this.$createElement('v-list-item-title', {}, [
                link.title,
                this.genIcon('mdi-chevron-right'),
              ]),
            ]),
          ],
          {},
          menuProps
        );
      }

      return this.$createElement('v-list-item', { props }, [
        this.$createElement('v-list-item-content', {}, [
          this.$createElement('v-list-item-title', {}, link.title),
        ]),
      ]);
    },

    genMobileMenu(children, title) {
      const scopedSlots = {
        activator: ({ on }) =>
          this.$createElement('v-list-item-content', { on: on }, [
            this.$createElement('v-list-item-title'),
            {},
            [title],
          ]),
      };
    },

    genIcon(icon, opts = {}) {
      const props = Object.assign({}, opts, { right: true, small: true });
      return this.$createElement('v-icon', { props }, icon);
    },

    genHorizontalLink() {
      const props = {
        nuxt: true,
        exact: true,
        to: this.link.to,
      };

      return this.hasChildren
        ? this.genMenu(
            this.link.children,
            'div',
            [this.link.title, this.genIcon('mdi-chevron-down')],
            {
              staticClass: 'v-tab',
            }
          )
        : this.$createElement('v-tab', { props }, [this.link.title]);
    },
  },

  render(h) {
    return this.genHorizontalLink();
  },

  computed: {
    hasChildren() {
      return (
        this.link.hasOwnProperty('children') &&
        this.link.children &&
        this.link.children.length > 0
      );
    },
  },
};
</script>