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
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.ProvidePlugin({ riot: 'riot' })
  ],
  module: {
    rules: [
      { test: /\.tag$/, enforce: 'pre', exclude: /node_modules/, loader: 'riotjs-loader', options: { type: 'babel' } },
      { test: /\.js$|\.tag$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.css$|\.styl$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('autoprefixer')({
                    browsers: ['last 2 versions', 'ie >= 9', 'Android >= 4','ios_saf >= 8']
                  })
                ]
              }
            },
            'stylus-loader'] }) },
      { test: /\.svg$/, exclude: /node_modules/, loader: 'file-loader?name=[name].[ext]' }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.tag', '.styl']
  }
}
