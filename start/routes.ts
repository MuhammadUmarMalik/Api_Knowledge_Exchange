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
Route.post('/register', 'AuthController.register')
Route.post('/login', 'AuthController.login')

Route.group(() => {
  //auth 
  Route.get('/users/exclude-current', 'AuthController.getAllExceptCurrent')
  Route.put('/users/:id', 'AuthController.update')
  Route.delete('/users/:id', 'AuthController.destroy')
  // Categories
  Route.post('/categories', 'CategoriesController.store')
  Route.get('/categories', 'CategoriesController.index')
  Route.put('/categories/:id', 'CategoriesController.update')
  Route.delete('/categories/:id', 'CategoriesController.destroy')
  //books
  Route.post('/admin/books', 'BooksController.store')
  Route.get('/admin/books', 'BooksController.index')
  Route.put('/admin/books/:id', 'BooksController.update')
  Route.delete('/admin/books/:id', 'BooksController.destroy')
  Route.delete('/admin/bookImages/:id', 'BooksController.deleteImage')
  //order
  Route.put('/admin/orders/:id', 'OrdersController.updateOrderStatus')
  Route.put('/admin/orders/:id/:payment-status', 'OrdersController.updatePaymentStatus')
  Route.post("/orders/pagination", "OrdersController.pagination")
}).prefix('api').middleware(['auth'])

// Categories
Route.get('/categories', 'CategoriesController.index')

//books endpoints
Route.post('/books', 'BooksController.store').middleware('seller')
Route.get('/books', 'BooksController.index').prefix('api')
Route.put('/books/:id', 'BooksController.update').prefix('api').middleware('seller')
Route.delete('/books/:id', 'BooksController.destroy').prefix('api').middleware('seller')
Route.delete('/bookImages/:id', 'BooksController.deleteImage').prefix('api').middleware('seller')

//order

Route.post('/orders', 'OrdersController.store').prefix('api').middleware('customer')