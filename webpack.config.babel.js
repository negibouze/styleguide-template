import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

module.exports = {
  entry: './src/main.js',
  output: {
    path: __dirname + '/src/public',
    publicPath: '/public/',
    filename: 'bundle.js'
  },
  plugins: [
    new ExtractTextPlugin('bundle.css'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.ProvidePlugin({ riot: 'riot' })
  ],
  module: {
    preLoaders: [
      { test: /\.tag$/, exclude: /node_modules/, loader: 'riotjs', query: { type: 'babel' } }
    ],
    loaders: [
      { test: /\.js$|\.tag$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.css$|\.styl$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract('style', 'css!postcss!stylus') }
    ]
  },
  postcss: () => {
    return [autoprefixer({ browsers: ['last 2 versions', 'ie >= 9', 'Android >= 4','ios_saf >= 8'] })];
  },
  resolve: {
      extensions: ['', '.js', '.tag', '.styl']
  }
}
