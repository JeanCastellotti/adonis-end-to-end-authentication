import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginController {
  public create({ view }: HttpContextContract) {
    return view.render('auth/login')
  }

  public async store({ request, session, response, auth }: HttpContextContract) {
    const { email, password } = request.body()

    console.log(request.body())

    try {
      await auth.attempt(email, password)

      session.flash({
        alert: {
          type: 'info',
          message: "Welcome back, you're now signed in.",
        },
      })

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
}
