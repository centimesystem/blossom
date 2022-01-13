const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { WebpackOpenBrowser } = require('webpack-open-browser');




module.exports = {
  entry: {
    //stylesheets
    ensyspace: './src/scss/stylesheets/ensyspace.scss',
    tokens: './src/scss/centime/tokens.scss',

    // Individual Components
    'downloads/components/css/base': './src/scss/stylesheets/base.scss',
    'downloads/components/css/buttons': './src/scss/stylesheets/individuals/buttons.scss',
    'downloads/components/css/ratings': './src/scss/stylesheets/individuals/ratings.scss',
  },
  output: {
    filename: 'assets/js/unused/[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
     rules: [
       {
         test: /\.js$/,
         exclude: /(node_modules|bower_components)/,
         use: {
           loader: 'babel-loader',
         }
       },
       {
         test: /\.scss$/,
         use: ExtractTextPlugin.extract({
           fallback: 'style-loader',
           use: ['css-loader', 'sass-loader']
         })
       },
       {
         test: /\.(woff|woff2|eot|ttf|otf)$/,
         use: [
           'file-loader'
         ]
       }
     ]
   },
   plugins: [
     new ExtractTextPlugin({
       filename: '[name].css',
       disable: false,
       allChunks: true
     }),
     //new WebpackOpenBrowser({ url: 'http://localhost:3000' }),
    // more options
    // specify firefox to open
    //new WebpackOpenBrowser({ url: 'http://localhost:3000', browser: 'firefox' }),
    // delay 3 seconds
    new WebpackOpenBrowser({ url: 'index.html', delay: 3 * 1000 }),
    // By default, this plugin only works when no compile error
    //new WebpackOpenBrowser({ url: 'http://localhost:3000', ignoreErrors: true }),
    // You can set a group of option to open multiple urls in multiple browsers
    new WebpackOpenBrowser([
      { url: 'http://localhost:3000', browser: 'chrome' },
      { url: 'http://localhost:3000', browser: 'firefox' },
    ]),
   ]
}
