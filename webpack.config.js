// import path from "path";
// import webpack from "webpack";
// import HtmlWebpackPlugin from "html-webpack-plugin";
// import ESLintPlugin from "eslint-webpack-plugin";

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { EsbuildPlugin } = require('esbuild-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// import packageConfig from './package.json' assert { type: "json" };

// const __dirname = path.resolve();

const webpackConfig = (env) => ({
    entry: "./src/index.jsx",
    ...(env.production || !env.development ? {} : {devtool: "eval-source-map"}),
    resolve: {
        extensions: [".jsx", ".js"],
        plugins: []
    },
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "build.js"
    },
    module: {
        rules: [       
            {
                // Match js, jsx, ts & tsx files
                test: /\.[jt]sx?$/,
                loader: 'esbuild-loader',
                options: {
                    // JavaScript version to compile to
                    target: 'es2015'
                }                   
            },
            {
                test: /\.css$/i,
                use: [
                  MiniCssExtractPlugin.loader,
                  'css-loader',
                             {
                               loader: 'esbuild-loader',
                               options: {
                                 minify: true
                               }
                             }
                ]
              }
        ]
    },
    optimization: {
             minimizer: [
               new EsbuildPlugin({
                 target: 'es2015',  // Syntax to compile to (see options below for possible values)
                 css: true
               })
             ]
           },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),
        new webpack.DefinePlugin({
            "process.env.PRODUCTION": env.production || !env.development,
            "process.env.NAME": JSON.stringify(require('./package.json').name),
            "process.env.VERSION": JSON.stringify(require('./package.json').version)
        }),
        new ESLintPlugin({files: "./src/**/*.{js,jsx}"}),
        new MiniCssExtractPlugin()
    ]
});

export default webpackConfig;