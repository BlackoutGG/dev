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

  components: {
    VIcon,
    VBtn,
    VMenu,
    VList,
    VListItem,
    VListItemContent,
    VListItemTitle,
  },

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

  methods: {
    genMenu(children) {
      const props = {
        'close-on-content-click': this.closeOnClick,
        value: this.open,
      };

      const scopedSlots = {
        activator: ({ on }) => {
          return this.$createElement('v-icon', { on: on }, 'mdi-dots-vertical');
        },
      };

      const on = { input: (v) => this.$emit('input', v) };

      return this.$createElement('v-menu', { props, on, scopedSlots }, [
        children,
      ]);
    },

    genList(actions) {
      const props = {
        dense: true,
        nav: true,
        flat: true,
      };

      if (!Array.isArray(actions)) {
        throw new Error('Actions must be an array.');
      }

      const actionsToShow = actions.reduce((output, action) => {
        const scope = action.scope.toLowerCase(),
          suffix = this.suffix.toLowerCase();

        if (this.$auth.hasScope(`${scope}:${suffix}`)) {
          output.push(this.genItem(action));
        }
        return output;
      }, []);

      return this.$createElement('v-list', { props }, actionsToShow);
    },

    genItem(action) {
      const props = { link: true };
      const nativeOn = { click: () => this.$emit(action.text.toLowerCase()) };

      const icon = () => {
        const iconProps = { left: true };
        return this.$createElement('v-icon', { props: iconProps }, [
          action.icon,
        ]);
      };

      const text = () => this.$createElement('span', {}, [action.text]);

      return this.$createElement('v-list-item', { props, nativeOn }, [
        this.$createElement('v-list-item-content', {}, [
          this.$createElement('v-list-item-title', {}, [icon(), text()]),
        ]),
      ]);
    },
  },

  render(h) {
    return this.genMenu(this.genList(this.actions));
  },
};
</script>