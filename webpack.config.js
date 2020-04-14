const path = require('path')

module.exports = {
  entry: './playground/ts/main.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: "playground/ts/tsconfig.json"
          }
        }],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      lbdate: path.resolve(__dirname, 'src')
    }
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'playground/www'),
  },
}
