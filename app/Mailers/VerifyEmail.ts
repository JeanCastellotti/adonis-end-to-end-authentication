import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import Route from '@ioc:Adonis/Core/Route'

export default class VerifyEmail extends BaseMailer {
  constructor(private user: User) {
    super()
  }

  public prepare(message: MessageContract) {
    const url = Route.makeSignedUrl(
      'auth.email.verify',
      { email: this.user.email },
      { expiresIn: '30m' }
    )

    message
      .subject('Verify your email address')
      .from('info@example.com')
      .to(this.user.email)
      .htmlView('emails/verify-email', { user: this.user, url: `${Env.get('APP_URL')}${url}` })
  }
}
