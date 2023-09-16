import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterValidator'
import Route from '@ioc:Adonis/Core/Route'
import Mail from '@ioc:Adonis/Addons/Mail'

export default class RegisterController {
  public create({ view }: HttpContextContract) {
    return view.render('auth/register')
  }

  public async store({ request, session, response }: HttpContextContract) {
    const payload = await request.validate(RegisterValidator)

    const user = await User.create(payload)

    const url = Route.makeSignedUrl(
      'auth.email.verify',
      { email: payload.email },
      { expiresIn: '30m' }
    )

    await Mail.sendLater((message) => {
      message
        .from('info@example.com')
        .to(user.email)
        .subject('Verify your email address')
        .htmlView('emails/verify-email', { user, url: `http://localhost:3333${url}` })
    })

    session.flash({
      alert: {
        type: 'success',
        message: `Register successful! A verification link has been sent to ${payload.email}, kindly follow the link to verify your email address.`,
      },
    })

    return response.redirect().back()
  }
}
