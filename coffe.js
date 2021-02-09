const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pos = express();

// Routers
const users = require("./asset/routes/users");
const items = require("./asset/routes/items");
const categories = require("./asset/routes/categories");

const { PORT } = require('./asset/helpers/env')
pos.use(bodyParser.urlencoded({ extended: false }));
pos.use(bodyParser.json());
pos.use(cors());

// Access Image Path
pos.use('/image',express.static('./public/image'))

// use Routers
pos.use(users)
pos.use(items)
pos.use(categories)

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
