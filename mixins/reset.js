import filters from '~/utilities/ns/public/filters.js';
export default function (ns, filter) {
  return {
    beforeRouteLeave(to, from, next) {
      if (ns) {
        this.$store.commit(ns.mutations.SET_SELECTED, []);
      }
      this.$store.commit(filters.mutations.RESET_FILTER, filter);
      next();
    },
  };
}
