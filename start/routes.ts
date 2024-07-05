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

// contact 
Route.post('/contact', 'ContactsController.store')

Route.group(() => {
//user endpoints
  Route.delete('/users/:id', 'AuthController.destroy').prefix('api')
  // Route.post('/logout', 'AuthController.logout').prefix('api')

  // Categories
  Route.post('/categories', 'CategoriesController.store')
  Route.get('/categories', 'CategoriesController.index')
  // Route.put('/categories/:id', 'CategoriesController.update')
  // Route.delete('/categories/:id', 'CategoriesController.destroy')

  //books endpoints
  Route.post('/books', 'BooksController.store')
  Route.get('/books', 'BooksController.index')
  Route.put('/books/:id', 'BooksController.update')
  Route.delete('/books/:id', 'BooksController.destroy')
  Route.delete('/bookImages/:id', 'BooksController.deleteImage')
  // order endpoints 
  Route.put('/orders/:id', 'OrdersController.updateOrderStatus')
  Route.put('/orders/:id/:payment-status', 'OrdersController.updatePaymentStatus')
  // Route.post("/orders/pagination", "OrdersController.pagination")
  //tutors endpoints
  Route.get('/tutors/:id', 'TutorsController.show')
  Route.put('/tutors/:id', 'TutorsController.update')
  Route.delete('/tutors/:id', 'TutorsController.destroy')
  Route.get('/location/:location', 'TutorsController.getByLocation')

  // status approve
  Route.post('/approve-role/:role/:userId', 'RequestRolesController.approve')
  Route.get('/pending-applications', 'RequestRolesController.getPendingApplications')
}).prefix('api').middleware('auth')

Route.group(() => {

  Route.post('/logout', 'AuthController.logout')
  Route.post('/seller/categories', 'CategoriesController.store')
  Route.get('/seller/categories', 'CategoriesController.index')
  //seller book
  Route.post('/seller/books', 'BooksController.store')
  Route.get('/seller/books', 'BooksController.index')
  Route.get('/seller/seller-book-list/:sellerId', 'BooksController.getSellerBooks')
  Route.put('/seller/books/:id', 'BooksController.update')
  Route.delete('/seller/books/:id', 'BooksController.destroy')
  Route.delete('/seller/bookImages/:id', 'BooksController.deleteImage')
  //

}).prefix('api').middleware('role:seller')

Route.group(() => {
  // Customer-specific routes
  Route.get('/customer', 'AuthController.getCustomer')
  Route.put('/customer/:id', 'AuthController.update')
  Route.post('/customer/orders', 'OrdersController.store')
  Route.get('/customer/books', 'BooksController.index')
  Route.get('/customer/tutors', 'TutorsController.index')
  Route.post('/apply-seller', 'RequestRolesController.applyAsSeller')
  Route.post('/apply-tutor', 'RequestRolesController.applyAsTutor')
  Route.get('/seller-status', 'RequestRolesController.getSellerStatus')
  Route.get('/tutor-status', 'RequestRolesController.getTutorStatus')
}).prefix('api').middleware('role:customer')

Route.put('/tutors/updateProfile/:id', 'TutorsController.update').prefix('api').middleware('role:tutor')