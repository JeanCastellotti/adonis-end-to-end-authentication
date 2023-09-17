import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'

export default class PasswordReset extends BaseMailer {
  constructor(
    private user: User,
    private token: string
  ) {
    super()
  }

  public prepare(message: MessageContract) {
    message
      .subject('Reset your password')
      .from('info@example.com')
      .to(this.user.email)
      .htmlView('emails/password-reset-request', { user: this.user, token: this.token })
  }
}
