import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginController {
  public create({ view }: HttpContextContract) {
    return view.render('auth/login')
  }
}
