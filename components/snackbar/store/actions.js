import types from './types/private';

const actions = {
  [types.actions.TOGGLE_BAR]({ commit }, { text, options }) {
    console.log(text);
    if (text) {
      commit(types.mutations.SET_OPTIONS, options);
      commit(types.mutations.SET_TEXT, text);
      console.log('toggling bar...');
    } else {
      commit(types.mutations.RESET_OPTIONS);
      commit(types.mutations.SET_TEXT, '');
      console.log('resetting bar...');
    }
  },
  [types.actions.ERROR]({ dispatch }) {
    const text = 'Encountered an error. Please contact administration.';
    dispatch(types.actions.TOGGLE_BAR, { text });
  },
  [types.actions.SUCCESS]({ dispatch }) {
    const text = 'Saved Changes.';
    dispatch(types.actions.TOGGLE_BAR, { text });
  },
};

export default actions;
