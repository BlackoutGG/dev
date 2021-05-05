import filters from '~/constants/filters/public.js';

export default function (ns, filter) {
  return {
    methods: {
      onUpdate() {
        this.$store.commit(ns.mutations.SET_SELECTED, []);
        this.$store.dispatch(ns.actions.FETCH, false);
      },
      onReset() {
        this.$store.commit(ns.mutations.SET_SELECTED, []);
        this.$store.commit(filters.mutations.RESET_FILTER, filter);
        this.$store.dispatch(ns.actions.FETCH, false);
      },
    },
  };
}
