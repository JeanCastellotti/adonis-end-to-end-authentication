import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import EmailValidator from 'App/Validators/EmailValidator'
import { string } from '@ioc:Adonis/Core/Helpers'
import Encryption from '@ioc:Adonis/Core/Encryption'
import PasswordReset from 'App/Mailers/PasswordReset'

export default class PasswordResetController {
  public create({ view }: HttpContextContract) {
    return view.render('auth/forgot-password')
  }

  public async store({ request, session, response }: HttpContextContract) {
    const { email } = await request.validate(EmailValidator)

    const user = await User.findByOrFail('email', email)

    const token = Encryption.encrypt(string.generateRandom(32))

    user.passwordResetToken = token

    user.save()

    await new PasswordReset(user, token).sendLater()

    session.flash({
      alert: {
        type: 'success',
        message: 'A password reset link has been sent to your email address.',
      },
    })

    return response.redirect().back()
  }
}
