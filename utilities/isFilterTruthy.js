import isBoolean from 'lodash/isBoolean';
import isString from 'lodash/isString';

export default function isFilterTruthy(value) {
  return (
    (Array.isArray(value) && value.length) ||
    (isBoolean(value) && value) ||
    (isString(value) && value)
  );
}
