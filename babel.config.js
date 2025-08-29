// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // keep nativewind JSX transform exactly as you had it
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      // Path aliases so we can import like: import X from '~/features/...'
      [
        'module-resolver',
        {
          alias: {
            '~': './src',
          },
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      ],

      // MUST remain at the end per Reanimated docs
      'react-native-reanimated/plugin',
    ],
  };
};