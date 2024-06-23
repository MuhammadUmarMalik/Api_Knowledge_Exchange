/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

//user register and login endpoints
Route.post('/register', 'AuthController.register').prefix('api')
Route.post('/login', 'AuthController.login').prefix('api')
Route.delete('/users/:id', 'AuthController.destroy').prefix('api')
Route.post('/logout', 'AuthController.logout').prefix('api')

// Categories
Route.post('/categories', 'CategoriesController.store').prefix('api').middleware('seller')
Route.get('/categories', 'CategoriesController.index').prefix('api').middleware('seller')
Route.put('/categories/:id', 'CategoriesController.update').prefix('api').middleware('seller')
Route.delete('/categories/:id', 'CategoriesController.destroy').prefix('api').middleware('seller')
Route.get('/categories', 'CategoriesController.index').prefix('api') // get categories for users
//books endpoints
Route.post('/books', 'BooksController.store').middleware('seller')
Route.get('/books', 'BooksController.index').prefix('api').middleware('seller')
Route.put('/books/:id', 'BooksController.update').prefix('api').middleware('seller')
Route.delete('/books/:id', 'BooksController.destroy').prefix('api').middleware('seller')
Route.delete('/bookImages/:id', 'BooksController.deleteImage').prefix('api').middleware('seller')
// order endpoints for seller

Route.put('/seller/orders/:id', 'OrdersController.updateOrderStatus').prefix('api').middleware('seller')
Route.put('/seller/orders/:id/:payment-status', 'OrdersController.updatePaymentStatus').prefix('api').middleware('seller')
Route.post("/seller/orders/pagination", "OrdersController.pagination").prefix('api').middleware('seller')

//all customer endpoints
Route.post('/orders', 'OrdersController.store').prefix('api').middleware('customer')
Route.get('/books', 'BooksController.index').prefix('api').middleware('customer')
Route.get('/tutors', 'TutorsController.index').prefix('api')

//tutors endpoints


Route.post('/tutors', 'TutorsController.store').prefix('api')
Route.get('/tutors/:id', 'TutorsController.show').prefix('api')
Route.put('/tutors/:id', 'TutorsController.update').prefix('api').middleware('tutor')
Route.delete('/tutors/:id', 'TutorsController.destroy').prefix('api').middleware('tutor')
Route.get('/location/:location', 'TutorsController.getByLocation').prefix('api')