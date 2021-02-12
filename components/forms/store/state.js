const state = () => ({
  name: '',
  category_id: 1,
  description: '',

  questions: [],

  forms: [],
  selected: [],

  queryParams: {
    page: 1,
    limit: 25,
    total: 0,
    orderBy: 'DESC',
    sortBy: 'id',
  },
});

export default state;
