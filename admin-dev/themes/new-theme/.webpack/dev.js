const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const {VueLoaderPlugin} = require('vue-loader');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const common = require('./common.js');

/**
 * Returns the development webpack config,
 * by merging development specific configuration with the common one.
 */
function devConfig() {
  const dev = Object.assign(
    common,
    {
      devtool: 'inline-source-map',
      devServer: {
        allowedHosts: 'all',
        client: {
          logging: 'error',
          progress: false,
          overlay: {
            errors: true,
            warnings: false,
          },
        },
        hot: true,
        static: {
          directory: path.join(__dirname, '/../public'),
          watch: false,
        },
        port: 3000,
        open: true,
        proxy: {
          '**': {
            target: process.env.PS_URL,
            secure: false,
            changeOrigin: true,
          },
        },
        devMiddleware: {
          publicPath: path.join(__dirname, '/../public'),
          writeToDisk: (filePath) => !(/hot-update/.test(filePath)),
        },
      },
      plugins: [
        new MiniCssExtractPlugin({filename: '[name].css'}),
        new webpack.ProvidePlugin({
          moment: 'moment', // needed for bootstrap datetime picker
          $: 'jquery', // needed for jquery-ui
          jQuery: 'jquery',
        }),
        new VueLoaderPlugin(),
        new ForkTsCheckerWebpackPlugin({
          typescript: {
            extensions: {
              vue: true,
            },
            diagnosticOptions: {
              semantic: true,
              syntactic: true,
            },
          },
        }),
      ],
    },
  );

  return dev;
}

module.exports = devConfig;
