// NOTE: Pulled from Maptivist. ~ RM
// https://github.com/rmorantes/maptivist/blob/master/next.config.js
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const withCSS = require('@zeit/next-css')

const withOffline = moduleExists('next-offline')
  ? require('next-offline')
  : {}

const customWebpackConfig = config => {
  config.resolve.alias.src = path.join(__dirname, 'src')
  config.resolve.plugins = [new DirectoryNamedWebpackPlugin()]
  config.plugins.push(
    new webpack.ProvidePlugin({
      Component: ['react', 'Component'],
      css: ['styled-components', 'css'],
      forwardRef: ['react', 'forwardRef'],
      Fragment: ['react', 'Fragment'],
      keyframes: ['styled-components', 'keyframes'],
      styled: ['styled-components', 'default'],
      useCallback: ['react', 'useCallback'],
      useContext: ['react', 'useContext'],
      useEffect: ['react', 'useEffect'],
      useRef: ['react', 'useRef'],
      useState: ['react', 'useState']
    })
  )
  return config
}

// NOTE: `withCSS()` so `import 'mapbox-gl/dist/mapbox-gl.css'` works. ~ RM
const nextConfig = withCSS({
  devIndicators: {
    autoPrerender: false
  },
  target: 'serverless',
  webpack: customWebpackConfig,
  workboxOpts: {
    swDest: 'static/service-worker.js',
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'https-calls',
          networkTimeoutSeconds: 15,
          expiration: {
            maxEntries: 150,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 1 month
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }
    ]
  }
})

module.exports = moduleExists('next-offline')
  ? withOffline(nextConfig)
  : nextConfig

function moduleExists (name) {
  try {
    return require.resolve(name)
  } catch (error) {
    return false
  }
}
