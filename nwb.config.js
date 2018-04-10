module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'AccessibleReactTable',
      externals: {
        react: 'React',
      },
    },
  },
  babel: {
    presets: ['env', 'react'],
    plugins: ['transform-class-properties', 'transform-object-rest-spread'],
  },
  webpack: {
    extra: {
      module: {
        rules: [
          {
            test: /\.js$/,
            enforce: 'pre',
            loader: 'eslint-loader',
            exclude: /node_modules/,
          },
        ],
      },
    },
  },
};