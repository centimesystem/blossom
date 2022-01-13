const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')


module.exports = {
  entry: {
    //stylesheets
    ensyspace: './src/scss/stylesheets/ensyspace.scss',

    // Individual Components
    //'downloads/components/css/base': './src/scss/stylesheets/base.scss',
    //'downloads/components/css/buttons': './src/scss/stylesheets/individuals/buttons.scss',
    //'downloads/components/css/ratings': './src/scss/stylesheets/individuals/ratings.scss',
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
   }
}
