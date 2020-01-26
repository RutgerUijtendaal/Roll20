import { Configuration, DefinePlugin } from 'webpack';

const config: Configuration = {
  entry: './src/index.ts',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: `${__dirname}/dist`
  },
  plugins: [
    new DefinePlugin({
      global: {} // Shim for lack of NodeJS global object
    })
  ],
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts"]
  },
  module: {
    rules: [
      // all files with a `.ts` extension will be handled by `ts-loader`
      { test: /\.ts?$/, loader: "ts-loader" }
    ]
  },
  optimization: {
    minimize: false
  },
  target: 'node'
};

module.exports = config;
