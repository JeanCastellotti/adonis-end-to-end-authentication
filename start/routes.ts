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

Route.group(() => {
  Route.get('/login', 'LoginController.create').as('login.create')
  Route.get('/register', 'RegisterController.create').as('register.create')
  Route.post('/register', 'RegisterController.store').as('register.store')
  Route.get('/verification/new', 'EmailVerificationController.create').as('email.create')
  Route.post('/verification', 'EmailVerificationController.store').as('email.store')
  Route.get('/verification/:email', 'EmailVerificationController.verify').as('email.verify')
}).as('auth')
