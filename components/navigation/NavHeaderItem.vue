<script>
import {
  VSpacer,
  VList,
  VTab,
  VIcon,
  VMenu,
  VListItem,
  VListItemIcon,
  VListItemContent,
  VListItemGroup,
} from 'vuetify/lib';

import { nanoid } from 'nanoid';

export default {
  name: 'NavigationLink',

  components: {
    VSpacer,
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
      menuId: `menu-${nanoid()}`,
    };
  },

  created() {
    console.log(this.$refs);
  },

  methods: {
    genMenu(children, element, child, opts, _props, ref) {
      const scopedSlots = {
        activator: ({ on }) => {
          const options = Object.assign({}, opts, { on: on });
          return this.$createElement(element, options, child);
        },
      };

      const defaultProps = {
        'offset-y': true,
        'content-class': this.contentClass,
        bottom: true,
      };

      const on = { input: (v) => this.$emit('input', v) };

      const props = Object.assign({}, defaultProps, _props);

      const menuOptions = { scopedSlots, on, props };

      const menuList = children.map(this.genMenuItem);

      // if (ref) Object.assign(menuOptions, { ref });

      if (ref) {
        menuOptions.ref = ref;
        // menuOptions.props.attach = ref;
      }

      return this.$createElement('v-menu', menuOptions, [
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
          'close-on-content-click': true,
          transition: 'scroll-x-reverse-transition',
          bottom: false,
          top: true,
          right: true,
        };

        return this.genMenu(
          link.children,
          'v-list-item',
          [
            this.$createElement('v-list-item-content', {}, [
              this.$createElement(
                'v-list-item-title',
                { staticClass: 'd-flex' },
                [
                  link.title,
                  this.$createElement('v-spacer', {}, []),
                  this.genIcon('mdi-chevron-right'),
                ]
              ),
            ]),
          ],
          {},
          menuProps
        );
      }

      const nativeOn = { click: () => this.$refs.menu.save('') };

      return this.$createElement('v-list-item', { props, nativeOn }, [
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
      const props = Object.assign({}, opts, { right: false, small: true });
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
            },
            { 'content-class': this.menuId },
            'menu'
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
        Array.isArray(this.link.children) &&
        this.link.children.length > 0
      );
    },

    contentClass() {
      return ['nav-item-top', 'hidden-sm-and-down'].join(' ');
    },
  },
};
</script>
<style scoped>
.nav-item-top {
  top: 80px !important;
}
</style>
