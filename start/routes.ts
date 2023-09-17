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
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.on('/').render('index')

Route.get('/dashboard', ({ view }) => {
  return view.render('dashboard')
}).middleware('auth')

Route.get('/login', 'AuthController.create')
Route.post('/login', 'AuthController.store')

Route.get('/register', 'RegisterController.create')
Route.post('/register', 'RegisterController.store')

Route.get('/verification/new', 'EmailVerificationController.create')
Route.post('/verification', 'EmailVerificationController.store')
Route.get('/verification/:email', 'EmailVerificationController.verify').as('email.verify')

Route.get('/forgot-password', 'PasswordResetRequestController.create')
Route.post('/forgot-password', 'PasswordResetRequestController.store')

Route.get('/reset-password/:token', 'PasswordResetController.create')
Route.post('/reset-password', 'PasswordResetController.store')
