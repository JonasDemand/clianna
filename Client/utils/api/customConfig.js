module.exports = {
  primitiveTypeConstructs: (constructs) => ({
    ...constructs,
    string: {
      'date-time': 'Date',
      date: 'Date',
    },
  }),
};
