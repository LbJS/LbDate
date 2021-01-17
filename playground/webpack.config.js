const path = require('path')
const { merge } = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

/** @type {import('webpack').Configuration} */
const COMMON_CONFIG = {
  entry: {
    main: './playground/ts/main.ts',
    "loading-script": './playground/ts/loading-script.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: 'playground/tsconfig.json',
          }
        }],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      lbdate: path.resolve(__dirname, '../src'),
    }
  },
}

/** @type {import('webpack').Configuration} */
const DEV_CONFIG = {
  devtool: 'inline-source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'www'),
  },
}

/** @type {import('webpack').Configuration} */
const PROD_CONFIG = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        extractComments: false,
        // sourceMap: false,
        terserOptions: {
          mangle: true
        },
      })
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'playground/www/',
          to: './',
          globOptions: {
            ignore: ['main.js']
          }
        },
      ]
    }),
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
  },
  performance: {
    assetFilter: function (assetFilename) {
      return assetFilename.endsWith('.js') || assetFilename.endsWith('.css') || assetFilename.endsWith('.html')
    }
  }
}

module.exports = (env, argv) => merge(COMMON_CONFIG, argv.mode === 'production' ? PROD_CONFIG : DEV_CONFIG)
