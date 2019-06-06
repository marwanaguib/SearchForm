const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const SplitChunksPlugin = require('webpack/lib/optimize/SplitChunksPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");


const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.js', '.pug', '.scss']
  },
  entry: {
    index: './src/js/index.js'
  },
  output: {
    filename: '[name]-bundle.js',
    path: path.resolve(__dirname, '../dist'),
    // chunkFilename: '[name]-lazy-chunk.js',
  },
  module: {
    rules: [{
        test: /\.pug$/,
        include: path.resolve(__dirname, '../src/pug'),
        use: [{
            loader: 'html-loader'
          },
          {
            loader: 'pug-html-loader',
            options: {
              pretty: true,
            }
          }
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: ['/node_modules/'],
        query: {
          'presets': [
            ['env', {
              "modules": false,
              "targets": {
                "browsers": ["last 2 versions", "safari >= 7"]
              }
            }]
          ],
          'plugins': [],
        },
      },
      {
        test: /\.(css|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
              loader: 'css-loader',
              options: {
                minimize: true,
              }
            }, {
              loader: 'postcss-loader',
              options: {
                plugins: () => [autoprefixer()]
              }
            },
            'sass-loader'
          ]
        })
      }, {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        }]
      }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/'
        }
      }, {
        test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/'
        }
      },
      {
        test: /\.(mp4|mov|wav)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        uglifyOptions: {compress: true},
        uglifyOptions: {
          output: {
            comments: false
          }
        }
      }),
    ]
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new ProgressPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: process.env.NODE_ENV === 'production',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],

      Util: 'exports-loader?Util!bootstrap/js/dist/util',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new HtmlwebpackPlugin({
      inject: true,
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/pug/index.pug'),
      minify: false,
      hash: true,
      chunks: ['index'],
      chunksSortMode: 'manual'
    }),
    new ExtractTextPlugin('styles.min.css'),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../assets/images'),
      to: path.resolve(__dirname, '../dist/assets/images')
    }])
  ]
};
