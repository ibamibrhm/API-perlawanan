require('dotenv').config();
const fastify = require('fastify')({
  logger: true,
});
const cors = require('@fastify/cors');

const port = process.env.PORT || 3000;

fastify.register(cors);
fastify.register(require('@fastify/mongodb'), {
  forceClose: true,
  url: process.env.DB_CONNECTION,
});

fastify.get('/', async function (req, reply) {
  try {
    const quotes = this.mongo.db.collection('quotes');
    const [quote] = await quotes.aggregate([{ $project: { author: 1, quote: 1, _id: 0 } }, { $sample: { size: 1 } }]).toArray();
    return reply.send(quote);      
  } catch (error) {
    return reply.send(error)
  }
});

fastify.listen({ port, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`Server is now listening on ${address}`)
})

module.exports = fastify;
