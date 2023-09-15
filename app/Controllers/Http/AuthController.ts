import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterValidator'

export default class AuthController {
  public async create({ view }: HttpContextContract) {
    return view.render('auth/register')
  }

  public async store({ request, session, response }: HttpContextContract) {
    const payload = await request.validate(RegisterValidator)
    await User.create(payload)
    session.flash({
      alert: {
        type: 'success',
        message: 'Register successful.',
      },
    })

    return response.redirect().back()
  }
}
