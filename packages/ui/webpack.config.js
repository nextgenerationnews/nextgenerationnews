const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const PostCssScss = require('postcss-scss');
const ESLintPlugin = require('eslint-webpack-plugin');
const SveltePreprocess = require('svelte-preprocess');
const Autoprefixer = require('autoprefixer');
const Tailwindcss = require('tailwindcss');
const { resolve } = require('path');
const { readFileSync, readdirSync, statSync } = require('fs');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyPlugin = require('copy-webpack-plugin');
const PrettierPlugin = require('prettier-webpack-plugin');

const prod = process.env.NODE_ENV === 'production';

const config = {
  entry: {
    bundle: [resolve(__dirname, './src/index.ts')],
    editor: { import: resolve(__dirname, './src/lazy-loaded/Editor.ts'), dependOn: 'bundle' },
    ethers: { import: resolve(__dirname, './src/lazy-loaded/Ethers.ts'), dependOn: 'bundle' },
  },
  resolve: {
    alias: {
      svelte: resolve('node_modules', 'svelte'),
      ...readdirSync(resolve(__dirname, './src'))
        .filter(dir => statSync(resolve(__dirname, './src', dir)).isDirectory())
        .reduce((acc, dir) => {
          acc[dir] = resolve(__dirname, `./src/${dir}`);
          return acc;
        }, {}),
      'bn.js': resolve('node_modules', 'bn.js'),
    },
    extensions: ['.mjs', '.js', '.ts', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },
  output: {
    path: resolve(__dirname, 'public/build'),
    publicPath: '/build/',
    filename: '[name].js',
    chunkFilename: '[name].[id].js',
  },
  module: {
    rules: [
      {
        test: [/\.mp4/, /\.svg/, /\.png/, /\.pdf/],
        type: 'asset/resource',
      },
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            compilerOptions: {
              dev: !prod,
              hydratable: true,
            },
            emitCss: prod,
            hotReload: !prod,
            hotOptions: {
              noPreserveState: false,
              optimistic: true,
            },
            preprocess: SveltePreprocess({
              sourceMap: !prod,
              scss: true,
              typescript: {
                tsconfigDirectory: resolve('./'),
              },
              sass: true,
              postcss: {
                syntax: PostCssScss,
                plugins: [Tailwindcss, Autoprefixer],
              },
            }),
          },
        },
      },
      {
        test: /node_modules\/svelte\/.*\.mjs$/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                syntax: PostCssScss,
                plugins: [Tailwindcss, Autoprefixer],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: prod ? 'production' : 'development',
  plugins: [
    // new PrettierPlugin(),
    new ESLintPlugin({
      extensions: ['js', 'ts', 'svelte'],
      lintDirtyModulesOnly: true,
      threads: true,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: resolve('node_modules', 'flag-icon-css/flags'),
          to: './flags',
        },
      ],
    }),
    new NodePolyfillPlugin(),
    process.env.ANALYZER && new BundleAnalyzerPlugin(),
  ].filter(Boolean),
  devtool: prod ? 'hidden-source-map' : 'source-map',
  devServer: {
    hot: true,
    useLocalIp: true,
    disableHostCheck: true,
    host: '0.0.0.0',
    contentBase: ['/build/flags', 'public'],
    contentBasePublicPath: [resolve('node_modules', 'flag-icon-css/flags'), '/'],
    watchContentBase: true,
    ...(process.env.HTTP === '1'
      ? {}
      : {
          https: {
            cert: readFileSync(resolve(__dirname, './cert/cert.pem')),
            key: readFileSync(resolve(__dirname, './cert/key.pem')),
          },
        }),
    historyApiFallback: {
      index: 'index.html',
    },
    proxy: {
      '/ganache-provider': {
        target: 'http://localhost:8545',
        ws: true,
        onError(err) {
          console.error('Suppressing WDS proxy upgrade error:', err);
        },
      },
    },
  },
  target: 'web',
  stats: {
    chunks: prod,
    chunkModules: prod,
    modules: prod,
    assets: prod,
    entrypoints: prod,
  },
  optimization: {
    removeAvailableModules: prod,
  },
  ignoreWarnings: [/unused export property '((currentRoute)|(params))'/],
};

module.exports = config;
