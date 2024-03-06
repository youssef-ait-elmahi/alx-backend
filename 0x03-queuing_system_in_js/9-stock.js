import { createClient } from 'redis';
import express from 'express';
import { promisify } from 'util';

const app = express();

const redisClient = createClient();

redisClient.on('connect', function() {
  console.log('Redis client connected to the server');
});

redisClient.on('error', function (err) {
  console.log(`Redis client not connected to the server: ${err}`);
});

const promisifiedGet = promisify(redisClient.get).bind(redisClient);

const listProducts = [
  { 'id': 1, 'name': 'Suitcase 250', 'price': 50, 'stock': 4},
  { 'id': 2, 'name': 'Suitcase 450', 'price': 100, 'stock': 10},
  { 'id': 3, 'name': 'Suitcase 650', 'price': 350, 'stock': 2},
  { 'id': 4, 'name': 'Suitcase 1050', 'price': 550, 'stock': 5}
];

//retrieve item by id
function getItemById(id) {
  return listProducts.filter((item) => item.id === id)[0];
}

function reserveStockById(id, stock) {
  redisClient.set(id, stock);
}

async function getCurrentReservedStockById(id) {
  const stock = await promisifiedGet(id);
  return stock;
}

//express routes
app.get('/list_products', function (req, res) {
  res.json(listProducts);
});

app.get('/list_products/:id', async function (req, res) {
  const { id } = req.params;
  const item = getItemById(parseInt(id));

  if (item) {
    const stock = await getCurrentReservedStockById(id);
    const itemData = {
      itemId: item.id,
      itemName: item.name,
      price: item.price,
      initialAvailableQuantity: item.stock,
      currentQuantity: stock !== null ? parseInt(stock) : item.stock,
    };
    res.json(itemData);
  } else {
    res.json({"status": "Product not found"});
  }
});

app.get('/reserve_product/:id', async function (req, res) {
  const { id } = req.params;
  const item = getItemById(parseInt(id));

  if (!item) {
    res.json({"status": "Product not found"});
    return;
  }

  let currentStock = await getCurrentReservedStockById(id);
  if (currentStock !== null) {
    currentStock = parseInt(currentStock);
    if (currentStock > 0) {
      reserveStockById(id, currentStock - 1);
      res.json({"status": "Reservation confirmed", "id": id});
    } else res.json({"status": "Not enough stock available", "id": id});

  } else {
    reserveStockById(id, item.stock - 1);
    res.json({"status": "Reservation confirmed", "id": id});
  }
});

const port = 1245;

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
