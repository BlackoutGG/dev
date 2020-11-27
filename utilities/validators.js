import capitalize from 'lodash/capitalize';

export default {
  isRequired(fieldName) {
    return (v) => !!v || `${capitalize(fieldName)} is required.`;
  },

  minLength(length, fieldName) {
    return (v) =>
      (v && v.length >= length) ||
      `${capitalize(
        fieldName
      )} must be equal to or longer than ${length} characters.`;
  },

  isNotPast(date, fieldName) {
    return (v) =>
      (v && !this.$dayjs(this.$dayjs(v)).isBefore(this.$dayjs(date))) ||
      `${capitalize(fieldName)} cannot be in the past.`;
  },

  isNotAfter(date, fieldName) {
    return (v) =>
      (v && !this.$dayjs(this.$dayjs(v)).isAfter(this.$dayjs(date))) ||
      `${capitalize(fieldName)} cannot be after end date.`;
  },

  // isNotPast(date, fieldName) {
  //   return (v) =>
  //     (v &&
  //       !this.$dateFns.isBefore(
  //         this.$dateFns.parseISO(v),
  //         this.$dateFns.parseISO(date)
  //       )) ||
  //     `${capitalize(fieldName)} cannot be in the past.`;
  // },

  // isNotAfter(date, fieldName) {
  //   return (v) =>
  //     (v &&
  //       !this.$dateFns.isAfter(
  //         this.$dateFns.parseISO(v),
  //         this.$dateFns.parseISO(date)
  //       )) ||
  //     `${capitalize(fieldName)} cannot be after end date.`;
  // },
};
