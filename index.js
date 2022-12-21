require('dotenv').config();
const port = process.env.PORT || 3000;
const app = require('fastify')();
app.register(require('fastify-cors'));
app.register(require('fastify-mongodb'), {
  forceClose: true,
  url: process.env.DB_CONNECTION
});

app.get('/', function (_, reply) {
  const db = this.mongo.db;
  db.collection('quotes', onCollection);

  async function onCollection(err, col) {
    if (err) return reply.send(err);

    const [quote] = await col.aggregate([{ $project: { author: 1, quote: 1, _id: 0 } }, { $sample: { size: 1 } }]).toArray();
    reply.send(quote);
  }
});

app.listen(port, '0.0.0.0', () => console.log('app running on port:', port));

module.exports = app;
