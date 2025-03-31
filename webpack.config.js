const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

//"glob": "^11.0.1",
//entry: glob.sync("./src/**/*[^.d].{ts,tsx}").reduce((acc, file) => {
//      file = file.replace(/\\/g, "/");
//      acc[file.replace(/^src\//, "").replace(/.tsx?$/, "")] = "./" + file;
//      return acc;
//    }, {})

module.exports = {
  entry: "./src/EOEditor.ts",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.(tsx|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", { modules: false, targets: "defaults" }],
              "@babel/preset-typescript"
            ],
            plugins: [
              "@babel/proposal-class-properties",
              "@babel/proposal-object-rest-spread"
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ["css-loader"]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false
      }),
      new CssMinimizerPlugin()
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"]
  },
  output: {
    filename: "eoeditor.js",
    path: path.resolve(__dirname, "dist")
  },
  mode: "development",
  devServer: {
    watchFiles: ["src/**/*", "public/**/*"],
    static: {
      directory: path.join(__dirname, "public")
    },
    hot: true,
    compress: true,
    open: {
      target: ["index.html"]
    },
    port: 9000
  }
};
