export const defaultQueryParams = () => ({
  page: 1,
  limit: 25,
  total: 0,
  orderBy: 'DESC',
  sortBy: 'id',
});

const state = () => ({
  items: {
    categories: [],
    tags: [],
  },

  type: '',

  selected: [],

  // queryParams: {
  //   page: 1,
  //   limit: 25,
  //   total: 0,
  //   orderBy: 'DESC',
  //   sortBy: 'id',
  // },
  queryParams: defaultQueryParams(),
});

export default state;
