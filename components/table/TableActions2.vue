<script>
import {
  VIcon,
  VBtn,
  VMenu,
  VList,
  VListItem,
  VListItemContent,
  VListItemTitle,
} from 'vuetify/lib';

export default {
  name: 'Actions',

  props: {
    actions: {
      type: Array,
    },
    suffix: {
      type: String,
    },
  },

  data() {
    return {
      closeOnClick: true,
      open: false,
    };
  },

  render(h) {
    const menu = (children) => {
      const props = {
        'close-on-content-click': this.closeOnClick,
        value: this.open,
      };

      const scopedSlots = {
        activator: ({ on }) => {
          return h(VIcon, { on: on }, ['mdi-dots-vertical']);
        },
      };

      const on = { input: (v) => this.$emit('input', v) };

      return h(VMenu, { props, on, scopedSlots }, [children]);
    };

    const vListItemContent = (children) => {
      return h(VListItemContent, {}, [children]);
    };

    const vListItemTitle = (children) => h(VListItemTitle, {}, children);

    const text = (text) => h('span', {}, [text]);

    const icon = (icon) => {
      const props = { left: true };
      return h(VIcon, { props }, [icon]);
    };

    const item = (action) => {
      const props = { link: true };
      const nativeOn = { click: () => this.$emit(action.text.toLowerCase()) };

      return h(VListItem, { props, nativeOn }, [
        vListItemContent(
          vListItemTitle([icon(action.icon), text(action.text)])
        ),
      ]);
    };

    const list = (actions) => {
      const props = {
        dense: true,
        nav: true,
        flat: true,
      };

      const actionsToShow = actions.reduce((output, action) => {
        const scope = action.scope.toLowerCase(),
          suffix = this.suffix.toLowerCase();

        if (this.$auth.hasScope(`${scope}:${suffix}`)) {
          output.push(item(action));
        }
        return output;
      }, []);

      return h(VList, { props }, actionsToShow);
    };

    return menu(list(this.actions));
  },
};
</script>