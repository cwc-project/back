module.exports = {
  env: {
    node: true,
    es6: true,
  },
  extends: 'airbnb-base',
  plugins: ['babel', 'prettier'],
  rules: {
    // 2 - error, 1 - warning, 0 - off
    'prettier/prettier': 'error', // mark prettier definitions as error
    'arrow-parens': [2, 'as-needed'], // for compatablility with prettier
    'object-curly-newline': [2, { consistent: true }], // open prettier issue https://github.com/prettier/prettier/issues/2550
    'no-unused-expressions': [2, { allowShortCircuit: true }],
  },
};
