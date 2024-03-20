module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Note: The key should be 'plugins', not '.plugin'
    ['react-native-reanimated/plugin'],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
        verbose: false,
      },
    ],
  ],
};
