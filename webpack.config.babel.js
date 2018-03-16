import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

module.exports = {
  entry: './src/main.js',
  output: {
    path: __dirname + '/src/public',
    publicPath: '/public/',
    filename: 'bundle.js'
  },
  plugins: [
    new ExtractTextPlugin('bundle.css'),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.ProvidePlugin({ riot: 'riot' })
  ],
  module: {
    rules: [
      { test: /\.tag$/, enforce: 'pre', exclude: /node_modules/, use: [ { loader: 'riotjs-loader', options: { type: 'babel' } }]},
      { test: /\.js$|\.tag$/, exclude: /node_modules/, use: 'babel-loader' },
      { test: /\.css$|\.styl$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
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
      { test: /\.svg$/, exclude: /node_modules/, use: 'file-loader?name=[name].[ext]' }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.tag', '.styl']
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: { test: /[\\/]node_modules[\\/]/, name: 'vendors', chunks: 'all' }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: {
            drop_console: true,
            ecma: 6
          },
          mangle: true
        }
      })
    ]    
  }
}
