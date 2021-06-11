const path = require('path');
const sass = require('sass');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, './proj/source'),
  output: {
    path: path.resolve(__dirname, './dist'),
  },
  resolve: {
    extensions: ['.js', '.json', '.wxss', '.wxml'],
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        options: {
          compact: false,
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  chrome: '58',
                  ios: '9',
                  android: '4.2',
                },
              },
            ],
            // '@babel/preset-react',
          ],
          plugins: [
            '@babel/plugin-transform-async-to-generator',
            '@babel/plugin-proposal-class-properties',
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            '@babel/plugin-proposal-export-default-from',
            '@babel/plugin-proposal-export-namespace-from',
          ],
        },
      },
      {
        test: /\.(wxml)$/,
        loader: 'wxml-loader',
        options: {
          // root: resolve('src'),
          // enforceRelativePath: true,
        },
      },
      {
        test: /\.(wxss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: false,
              importLoaders: 2,
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: sass,
              sassOptions: {
                outputStyle: 'expanded',
              },
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin(), new HtmlWebpackPlugin()],
  devServer: {
    open: true,
  },
  mode: 'development',
};
