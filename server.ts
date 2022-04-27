const fastify = require('fastify')({ logger: true })
const path = require('path')

fastify.register(require('fastify-cors'), {
  origin: (origin: any, cb: any) => {
    const hostname = new URL(origin).hostname
    if (hostname === "localhost") {
      //  Request from localhost will pass
      cb(null, true)
      return
    }
    // Generate an error on other origins, disabling access
    cb(new Error("Not allowed"))
  }
})

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'data'),
  prefix: '/data/',
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