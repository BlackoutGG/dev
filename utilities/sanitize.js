import DOMPurify from 'dompurify';
import isObjectLike from 'lodash/isObjectLike';
import isString from 'lodash/isString';

export default function sanitize(obj) {
  let results = {};
  Object.keys(obj).forEach((key) => {
    if (isObjectLike(obj[key])) {
      sanitize(obj[key]);
    } else if (!isString(obj[key])) {
      results[key] = obj[key];
    }
    results[key] = DOMPurify.sanitize(obj[key]);
  });
  return results;
}
