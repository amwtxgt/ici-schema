var path = require('path');

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  entry: './src/index.js',
  output: {
    libraryTarget: 'umd',
    umdNamedDefine: true,
    path: path.resolve(__dirname, './lib'),
    publicPath: '/lib/',
    filename: 'Schema.class.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (!isDev) {
  module.exports.devtool = '#source-map'
  module.exports.mode = 'production'
}else{
  module.exports.mode = 'development'
}
