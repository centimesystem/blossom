const merge = require('webpack-merge')
const base = require('./webpack.base.js')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const ImageminPlugin = require('imagemin-webpack-plugin').default
const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = merge(base, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
               name: 'images/[name].[ext]'
           }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
               name: 'images/[name].[ext]'
           }
          }
        ]
      },
      {
        loader: 'img-loader',
        options: {
          plugins: [
            require('imagemin-gifsicle')({}),
            require('imagemin-mozjpeg')({}),
            require('imagemin-optipng')({}),
            require('imagemin-svgo')({})
          ]
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
       test: /\.css$/,
       use: [
         {
           loader: MiniCssExtractPlugin.loader,
           options: {
             publicPath: (resourcePath, context) => {
               return path.relative(path.dirname(resourcePath), context) + '/';
             },
           },
         },
         'css-loader',
       ],
     },
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {from: 'src/assets/images', to: 'assets/images'}
    ]),
    new OptimizeCssAssetsPlugin(),
    new ExtractTextPlugin({
      filename: 'assets/css/minify/[name].css',
      disable: false,
      allChunks: true
    }),
    new ImageminPlugin({
      test: /\.(jpeg|jpg|png|gif|svg)$/i,
      pngquant: ({quality: [0-1]}),
      plugins: [imageminMozjpeg({quality: 60})]
    }),
    new MiniCssExtractPlugin({
      ignoreOrder: true,
    })
  ]
})
