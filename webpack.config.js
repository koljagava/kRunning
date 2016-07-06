var path = require('path');


module.exports = {
  entry: [
    path.resolve('app/app.ts')
  ],
  output: {
    path: path.resolve('www/build/js'),
    filename: 'app.bundle.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript',
        query: {
          doTypeCheck: true,
          resolveGlobs: false,
          externals: ["typings/browser.d.ts"]
        },
        include: path.resolve('app'),
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    alias: {
      '@angular': path.resolve('node_modules/@angular')
    },
    extensions: ['', '.js', '.ts']
  }
};