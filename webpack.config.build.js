const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

//"glob": "^11.0.1",
//const glob = require("glob");
//entry: glob.sync("./src/**/*[^.d].{ts,tsx}").reduce((acc, file) => {
//  file = file.replace(/\\/g, "/");
//  acc[file.replace(/^src\//, "").replace(/.tsx?$/, "")] = "./" + file;
//  return acc;
//}, {}),

module.exports = [
  {
    target: ["web", "es2022"],
    entry: "./src/index.ts",
    module: {
      rules: [
        {
          test: /\.(tsx|ts)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-typescript"],
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
      filename: "index.js",
      path: path.resolve(__dirname, "lib/mjs"),
      library: {
        type: "module"
      }
    },
    externals: ["@etsoo/shared", "pica"],
    experiments: {
      outputModule: true
    },
    mode: "production"
  },
  {
    target: ["node", "es2022"],
    entry: "./src/index.ts",
    module: {
      rules: [
        {
          test: /\.(tsx|ts)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-typescript"],
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
      filename: "index.js",
      path: path.resolve(__dirname, "lib/cjs"),
      library: {
        type: "commonjs"
      }
    },
    externals: ["@etsoo/shared", "pica"],
    mode: "production"
  }
];
