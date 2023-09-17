import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PasswordReset from 'App/Mailers/PasswordReset'
import User from 'App/Models/User'
import PasswordResetValidator from 'App/Validators/PasswordResetValidator'

export default class PasswordResetController {
  public async create({ params, view, session, response }: HttpContextContract) {
    try {
      const user = await User.findByOrFail('password_reset_token', decodeURIComponent(params.token))

      return view.render('auth/reset-password', {
        token: user.passwordResetToken,
        email: user.email,
      })
    } catch (error) {
      session.flash({
        alert: {
          type: 'error',
          message: 'Invalid password reset token',
        },
      })

      return response.redirect('/forgot-password')
    }
  }

  public async store({ request, session, response }: HttpContextContract) {
    const payload = await request.validate(PasswordResetValidator)

    try {
      const user = await User.findByOrFail('password_reset_token', payload.token)

      user.password = payload.password

      user.passwordResetToken = null

      await user.save()

      await new PasswordReset(user).sendLater()

      session.flash({
        alert: {
          type: 'success',
          message: 'Password reset successful.',
        },
      })

      return response.redirect('/login')
    } catch (error) {
      session.flash({
        alert: {
          type: 'error',
          message: 'Invalid password reset token',
        },
      })

      return response.redirect().back()
    }
  }
}
