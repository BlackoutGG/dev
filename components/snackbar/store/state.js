const defaultOptions = {
  x: null,
  y: 'bottom',
  mode: null,
  color: '#000',
  timeout: 3000,
};

const state = () => ({
  text: '',

  options: {
    x: defaultOptions.x,
    y: defaultOptions.y,
    mode: defaultOptions.mode,
    color: defaultOptions.color,
    timeout: defaultOptions.timeout,
  },
});

export default state;
