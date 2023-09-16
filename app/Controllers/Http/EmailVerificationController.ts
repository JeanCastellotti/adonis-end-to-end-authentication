import Mail from '@ioc:Adonis/Addons/Mail'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import EmailValidator from 'App/Validators/EmailValidator'
import { DateTime } from 'luxon'
import Route from '@ioc:Adonis/Core/Route'

export default class EmailVerificationController {
  public create({ view }: HttpContextContract) {
    return view.render('auth/resend-verification')
  }

  public async store({ request, session, response }: HttpContextContract) {
    const { email } = await request.validate(EmailValidator)

    const user = await User.findBy('email', email)

    if (user?.emailVerifiedAt) {
      session.flash({
        alert: {
          type: 'info',
          message: 'Email address already verified.',
        },
      })

      return response.redirect('/login')
    }

    if (user) {
      const url = Route.makeSignedUrl('auth.email.verify', { email }, { expiresIn: '30m' })

      await Mail.sendLater((message) => {
        message
          .from('info@example.com')
          .to(user.email)
          .subject('Verify your email address')
          .htmlView('emails/verify-email', { user, url: `http://localhost:3333${url}` })
      })
    }

    session.flash({
      alert: {
        type: 'success',
        message: `A verification link has been sent to ${email}, kindly follow the link to verify your email address.`,
      },
    })

    return response.redirect('/login')
  }

  public async verify({ request, params, session, response }: HttpContextContract) {
    if (!request.hasValidSignature()) {
      session.flash({
        alert: {
          type: 'error',
          message: 'Verification link is invalid or has expired.',
        },
      })

      return response.redirect('/verification/new')
    }

    const user = await User.findByOrFail('email', params.email)

    if (user.emailVerifiedAt) {
      session.flash({
        alert: {
          type: 'info',
          message: 'Email address already verified',
        },
      })

      return response.redirect('/login')
    }

    user.emailVerifiedAt = DateTime.now()

    await user.save()

    session.flash({
      alert: {
        type: 'success',
        message: 'Email address verified.',
      },
    })

    return response.redirect('/login')
  }
}
