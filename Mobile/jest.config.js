module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '^react-native-chart-kit$': '<rootDir>/__mocks__/react-native-chart-kit.js',
    '^react-native-image-picker$': '<rootDir>/__mocks__/react-native-image-picker.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|react-native-image-picker|@react-native|react-native-chart-kit|react-native-svg|react-native-safe-area-context)/)',
  ],
};
