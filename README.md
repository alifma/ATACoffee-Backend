# ATA Coffee-Backend
Backend for ATA Coffee Appliation

## API Documentation
> You can check Postman API Documentation [Here](https://documenter.getpostman.com/view/10242708/TW77gNyV#b118a2c5-6975-4e81-b280-55cba3fb2e98)

## Application Instalation
1. Make sure you already have Redis installed on your machine
2. Clone ATACoffee-Backend Repository
3. Install Required NPM Packages 
   > `npm install`
4. Create database named `coffee_shop` and import `coffee_shop.sql` from this project folder
5. Create `.env` files with this value
   > - PORT= (Your decided port number, ex:3000)
   > - DB_USERNAME= (Your Database User)
   > - DB_PASSWORD= (Your Database Password)
   > - DB_NAME=coffee_shop
   > - JWT_SECRET= (Your own JWT)
6. Start Redis Server
   > `redis-server`
7. Start Application
   > `npm start`

## Features
- JWT Authentication
- Multilevel Authorization (Admin and Customer)
- Upload Image Multer
- CRUD Items
- CRUD Categories
- CRUD Orders
- CRUD Users
- Redis Server

## Frontend
Backend dari aplikasi ini dapat dicek pada tautan berikut [ATA-Frontend](https://github.com/alifma/ATACoffee-Frontend/)

## NPM Packages Used
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Body-Parser](https://www.npmjs.com/package/body-parser)
- [Cors](https://www.npmjs.com/package/cors)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Express](https://www.npmjs.com/package/express)
- [JWT](https://www.npmjs.com/package/jsonwebtoken)
- [lodash](https://www.npmjs.com/package/lodash)
- [moment](https://www.npmjs.com/package/moment)
- [multer](https://www.npmjs.com/package/multer)
- [mysql2](https://www.npmjs.com/package/mysql2)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [redis](https://www.npmjs.com/package/redis)
