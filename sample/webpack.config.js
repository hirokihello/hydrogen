const path = require('path');

module.exports = {
  entry: './index.tsx',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts[x]?$/,
        use: [
          // 下から順に処理される
          { loader: "babel-loader",
          options: {
            "presets": ["@hirokihello/babel-preset-hydrogen"]
          }
          },
          { loader: "ts-loader" }
        ],
      },
    ],
  },
  resolve: {
    extensions: [
      '.ts', '.js', '.tsx'
    ],
  },
  output: {
    path: path.resolve(__dirname, '.'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './',
    hot: true,
  }
};
