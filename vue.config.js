// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, on Mac: sudo npm run / sudo yarn
const devServerPort = 9527 // TODO: get this variable from setting.ts
const name = 'Vue Typescript Admin' // TODO: get this variable from setting.ts

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: devServerPort,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    progress: false
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/styles/_variables.scss'),
        path.resolve(__dirname, 'src/styles/_mixins.scss')
      ]
    }
  },
  chainWebpack(config) {
    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')
    config.plugins.delete('pwa')
    config.plugins.delete('workbox')

    config.plugin('inline-source')
      .use(require('html-webpack-inline-source-plugin'))
    config
      .plugin('html')
      .tap(args => {
        args[0].inlineSource = '(\.css|\.js$)'
        args[0].title = name
        return args
      })
  }
}
