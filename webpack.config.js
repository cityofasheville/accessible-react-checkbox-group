const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const libraryName = 'library';

const outputFile = `${libraryName}.js`;

module.exports = {
  entry: path.join(__dirname, 'demo/src/demo.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: outputFile,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        use: {
          loader: 'eslint-loader',
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'demo/src/index.html'),
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3000,
    watchContentBase: true,
  },
};
