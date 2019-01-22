var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');


const config = {
    entry: ['webpack-hot-middleware/client?reload=true','./public/app/index.js'],
    output: {
        path: path.resolve(__dirname, 'public/dist'),
        filename: 'index_bundle.js',
        publicPath: '/'
      },
      module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            { test: /\.scss$/, use: [ 'style-loader', 'css-loader', 'sass-loader' ]}
        ]
      },
      devServer: {
          historyApiFallback: true
      },
      plugins: [
          new HtmlWebpackPlugin({
              template: 'public/app/index.html'
          }),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
      ],
      mode: "development"
}

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            } 
        }),
        new webpack.optimize.UglifyJsPlugin()
    )
}

module.exports = config;