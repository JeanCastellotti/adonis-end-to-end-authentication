import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import EmailValidator from 'App/Validators/EmailValidator'
import { string } from '@ioc:Adonis/Core/Helpers'
import Encryption from '@ioc:Adonis/Core/Encryption'
import PasswordResetRequest from 'App/Mailers/PasswordResetRequest'

export default class PasswordResetRequestController {
  public create({ view }: HttpContextContract) {
    return view.render('auth/forgot-password')
  }

  public async store({ request, session, response }: HttpContextContract) {
    const { email } = await request.validate(EmailValidator)

    const user = await User.findByOrFail('email', email)

    const token = Encryption.encrypt(string.generateRandom(32))

    user.passwordResetToken = token

    await user.save()

    await new PasswordResetRequest(user, token).sendLater()

    session.flash({
      alert: {
        type: 'success',
        message: 'A password reset link has been sent to your email address.',
      },
    })

    return response.redirect().back()
  }
}
