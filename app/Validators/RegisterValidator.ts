import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string(),
    email: schema.string({}, [
      rules.email(),
      rules.maxLength(255),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    password: schema.string({}, [rules.confirmed(), rules.minLength(8)]),
  })

  public messages: CustomMessages = {
    'name.required': 'Name is required',
    'email.required': 'Email is required',
    'email.unique': 'Email must be unique',
    'password.required': 'Password is required',
    'password.minLength': 'Password must be at least 8 characters',
    'confirmed': 'Passwords are not the same',
  }
}
