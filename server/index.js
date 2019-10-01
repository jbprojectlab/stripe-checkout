const path = require('path')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const webpackConfig = require('../webpack.config')
const compiler = webpack(webpackConfig)
const dotenv = require('dotenv')
dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

app.listen(PORT, () => console.log(`Server Listening on ${PORT}`))

app.use(require("webpack-hot-middleware")(compiler, {
  'log': false,
  'path': '/__webpack_hmr',
  'heartbeat': 10 * 1000
}))

app.use(middleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
}))

app.use(morgan('dev'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(cors())

app.use(express.static(path.join(__dirname, '..', 'src')))

app.use('/api', require('./api'))

app.use((req, res, next) => {
  if (path.extname(req.path).length > 0) {
    res.status(404).end()
  } else {
    next()
  }
})

app.get('/*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'src', 'index.html'))
})

app.use((err, req, res, next) => {
  console.error(err, typeof next)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})


module.exports = app