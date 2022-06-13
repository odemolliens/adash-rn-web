const fastify = require('fastify')({ logger: true })
const path = require('path')

fastify.register(import('@fastify/compress'))

fastify.register(require('fastify-cors'), {
  origin: (origin: any, cb: any) => {
    cb(null, true)
    return
  }
})

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'data'),
  prefix: '/data/',
})

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'allure'),
  prefix: '/allure/',
  decorateReply: false
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()