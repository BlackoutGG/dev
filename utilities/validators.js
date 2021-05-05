import capitalize from 'lodash/capitalize';

const emailPattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
// const alphaPattern = /^[A-Za-z]\d\s$/g;
const alphaPattern = /^[a-zA-Z0-9\-\s]+$/;

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

  isAlphanumeric(fieldName) {
    return (v) =>
      alphaPattern.test(v) || `${capitalize(fieldName)} must be alphanumeric.`;
  },

  isEmail(fieldName) {
    return (v) =>
      emailPattern.test(v) ||
      `${capitalize(fieldName)} must be a valid email address.`;
  },

  compare(target, fieldName) {
    return (v) =>
      (v && v === target) || `${capitalize(fieldName)} must be match.`;
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
