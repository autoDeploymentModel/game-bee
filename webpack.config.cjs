const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'server', 'public'),
    clean: true,
    publicPath: ''
  },
  plugins: [
    {
      apply(compiler) {
        compiler.hooks.afterEmit.tap('CopyIndexHtml', (compilation) => {
          const src = path.resolve(__dirname, 'index.html');
          const dest = path.resolve(__dirname, 'server', 'public', 'index.html');
          if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
          }
        });
      }
    }
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|mp3|wav|ogg|mp4|webm|woff|woff2|eot|ttf|svg)$/,
        type: 'asset/resource'
      }
    ]
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname),
      publicPath: '/'
    },
    hot: true,
    port: 8080,
    open: true,
    historyApiFallback: {
      index: '/index.html'
    }
  },
  resolve: {
    extensions: ['.js', '.json']
  }
};