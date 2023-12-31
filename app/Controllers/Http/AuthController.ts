import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from 'App/Validators/LoginValidator'

export default class LoginController {
  public create({ view }: HttpContextContract) {
    return view.render('auth/login')
  }

  public async store({ request, session, response, auth }: HttpContextContract) {
    const { email, password, remember } = await request.validate(LoginValidator)

    try {
      await auth.attempt(email, password, remember)

      session.flash({
        alert: {
          type: 'info',
          message: "Welcome back, you're now signed in.",
        },
      })

      const intendedUrl = session.get('intended_url', false)

      if (intendedUrl) {
        const redirectToIntendedUrl = response.redirect(intendedUrl)

        session.forget('intended_url')

        return redirectToIntendedUrl
      }

      return response.redirect('/')
    } catch (err) {
      session.flash({
        alert: {
          type: 'error',
          message: "We couldn't verify your credentials",
        },
      })

      return response.redirect().back()
    }
  }

  public async destroy({ auth, response }: HttpContextContract) {
    await auth.logout()

    return response.redirect('/')
  }
}
