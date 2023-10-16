const { Pool } = require('pg');
const format = require('pg-format');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'amazzon.pg',
  port: 5432,
  database: 'joyas',
  allowExitOnIdle: true
})

const getJewels = async ({ limit = 0, page = 0, order_by = '' }, res) => {

  let sql = `SELECT * FROM inventario`

  if (order_by != '') {
    const [field, sort] = order_by.split('_')
    sql += ` ORDER BY ${field} ${sort}`
  }

  if (limit != 0) {
    sql += ` limit ${limit}`
  }

  if (page != 0) {
    sql += ` OFFSET ${(page - 1 * limit)}`
  }

  const jewels = await pool.query(sql);

  const data = {}
  const totalStock = jewels.rows.reduce((acc, j) => acc + j.stock, 0)
  const results = jewels.rows.map((j) => {
    return {
      id: j.id,
      name: j.nombre,
      href: `/joyas/joya/${j.id}`,
    }
  })

  data.total = jewels.rows.length
  data.stock = totalStock
  data.results = results

  return data

}

const getFilteredJewels = async ({ max_price = undefined, min_price = undefined, category = undefined, metal = undefined }, res) => {

  let sql = `SELECT * FROM inventario where TRUE`

  if (max_price != undefined) {
    sql += ` AND precio >= ${max_price}`
  }

  if (min_price != undefined) {
    sql += ` AND precio <= ${min_price}`
  }

  if (category != undefined) {
    sql += ` AND categoria = '${category}'`
  }

  if (metal != undefined) {
    sql += ` AND metal = '${metal}'`
  }

  const jewels = await pool.query(sql);

  const data = {}

  const results = jewels.rows.map((j) => {
    return {
      id: j.id,
      name: j.nombre,
      href: `/joyas/joya/${j.id}`,
      price: j.precio,
      category: j.categoria,
      metal: j.metal
    }
  })

  const totalStock = jewels.rows.reduce((acc, j) => acc + j.stock, 0)

  data.total = jewels.rows.length
  data.results = results
  data.stock = totalStock

  return data

}


module.exports = { getJewels, getFilteredJewels }