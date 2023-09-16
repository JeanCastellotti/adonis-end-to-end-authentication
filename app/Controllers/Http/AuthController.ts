import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterValidator'
import Mail from '@ioc:Adonis/Addons/Mail'
import Route from '@ioc:Adonis/Core/Route'
import { DateTime } from 'luxon'

export default class AuthController {
  public showLogin({ view }: HttpContextContract) {
    return view.render('auth/login')
  }

  public showRegister({ view }: HttpContextContract) {
    return view.render('auth/register')
  }

  public async register({ request, session, response }: HttpContextContract) {
    const payload = await request.validate(RegisterValidator)

    const user = await User.create(payload)

    const url = Route.makeSignedUrl('auth.verify', { email: payload.email }, { expiresIn: '30m' })

    await Mail.sendLater((message) => {
      message
        .from('info@example.com')
        .to(user.name)
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

  public async verify({ request, params, session, response }: HttpContextContract) {
    if (!request.hasValidSignature()) {
      session.flash({
        alert: {
          type: 'error',
          message: 'Verification link is invalid or has expired.',
        },
      })

      return response.redirect('/login')
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
