const express = require('express')
const morgan = require('morgan-body');
const cors = require('cors')

const { getJewels, getFilteredJewels } = require('./queries.js')
const app = express();
morgan(app);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {

  const params = req.params
  const url = req.url

  console.log(` Request received to ${url} with params: ${JSON.stringify(params)}`)
  next();

});

const PORT = 3000;



app.get('/joyas', async (req, res) => {

  try {

    const filters = {
      limit: (req.query.limit || 0),
      page: (req.query.page || 0),
      order_by: (req.query.order_by || '')
    }


    const jewels = await getJewels(filters);
    res.status(200).json(jewels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }


});

app.get('/joyas/filtros', async (req, res) => {

  try {

    const filters = {
      max_price: (req.query.precio_max || undefined),
      min_price: (req.query.precio_min || undefined),
      category: (req.query.categoria || undefined),
      metal: (req.query.metal || undefined)
    }

    console.log(filters)

    const jewels = await getFilteredJewels(filters);
    res.status(200).json(jewels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }


});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
