const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pos = express();

// Routers
const users = require("./asset/routes/users");
const items = require("./asset/routes/items");
const categories = require("./asset/routes/categories");
const orders = require("./asset/routes/orders");

// History Router
const history = require('connect-history-api-fallback')

const { PORT } = require('./asset/helpers/env')
pos.use(bodyParser.urlencoded({ extended: false }));
pos.use(bodyParser.json());
pos.use(cors());

// Access Image Path
pos.use('/image',express.static('./public/image'))
pos.use('/dist',express.static('./public/dist'))

// use Routers
pos.use(users)
pos.use(items)
pos.use(categories)
pos.use(orders)

// API History
pos.use(history({
  verbose: true
}))

// Deploy FrontEndPath
pos.use('/', express.static('./public/dist'))

// Route yang Tidak Terdaftar
pos.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
});
pos.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

pos.listen(PORT || 3000, () => {
  console.log(`Service running on PORT ${PORT || 3000}`);
})
