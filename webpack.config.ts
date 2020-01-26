import { Configuration, DefinePlugin } from 'webpack';

const config: Configuration = {
  entry: './js/src/index.js',
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
  optimization: {
    minimize: false
  },
  target: 'node'
};

module.exports = config;
