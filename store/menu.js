import menu from '~/utilities/ns/private/menu.js';

const state = () => ({
  links: [
    { icon: 'mdi-home', title: 'Home', to: '/' },
    { icon: 'mdi-book', title: 'Guides', to: '/guides' },
    { icon: 'mdi-information', title: 'History', to: '/history' },
    {
      icon: 'mdi-information',
      title: 'Community',
      children: [
        { title: 'Discord', to: '/' },
        { title: 'Forum', to: '/' },
        {
          title: 'Social',
          children: [
            { title: 'Youtube', to: '/' },
            { title: 'Twitch', to: '/' },
          ],
        },
        {
          title: 'Twitter',
          children: [
            { title: 'Child 1', to: '/guides' },
            {
              title: 'Community',
              to: '/guides',
              children: [
                { title: 'Descendent 1', to: '/guides' },
                { title: 'Descendent 2', to: '/guides' },
              ],
            },
            { title: 'Child 3', to: '/history' },
          ],
        },
      ],
    },
    { title: 'Tools', to: '/' },
    // { icon: "mdi-calendar", title: "Events", to: "/events" }
  ],
});

const getters = {
  [menu.getters.LINKS]: (state) => state.links,
};

const mutations = {
  [menu.mutations.SET_LINKS](state, links) {},
  [menu.mutations.ADD_LINK](state, link) {},
  [menu.mutations.EDIT_LINK](state, { id, title, to }) {},
  [menu.mutations.REMOVE_LINK](state, id) {},
};

const actions = {
  [menu.mutations.FETCH]({ commit }) {},
  [menu.mutations.ADD_MENU_LINK]({ commit }) {},
  [menu.mutations.EDIT_MENU_LINK]({ commit }) {},
  [menu.mutations.REMOVE_MENU_LINK]({ commit }) {},
};

export default { state, getters, mutations, actions };
