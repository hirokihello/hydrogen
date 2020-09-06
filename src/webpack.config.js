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
              "plugins": [
                [
                  "@babel/transform-react-jsx",
                  {
                    "pragma": "H2.h"
                  }
                ]
              ]
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
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist',
    hot: true,
  }
};
