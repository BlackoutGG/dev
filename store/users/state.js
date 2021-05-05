const state = () => ({
  users: [],
  selected: [],

  queryParams: {
    page: 1,
    limit: 25,
    total: 0,
    sortBy: 'id',
    orderBy: 'ASC',
  },
});

export default state;
