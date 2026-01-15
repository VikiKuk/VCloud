const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.jsx",   
  output: {
    path: path.resolve(__dirname, "../backend/static/frontend"),
    filename: "bundle.js",
    publicPath: "/",
    clean: true
  },
  resolve: {
    extensions: [".js", ".jsx"] 
  },
  devServer: {
    historyApiFallback: true,
    proxy: [
      {
        context: ["/api", "/media"],
        target: "http://127.0.0.1:8000",
        changeOrigin: true
      }
    ],
    port: 3000
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,   
        use: {
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env", "@babel/preset-react"] }
        },
        exclude: /node_modules/
      },
      { test: /\.css$/i, use: ["style-loader", "css-loader"] }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html" 
    })
  ]
};