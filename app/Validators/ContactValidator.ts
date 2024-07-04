import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class ContactValidator {
  public schema = schema.create({
    name: schema.string({}, [rules.required()]),
    email: schema.string({}, [rules.email(), rules.required()]),
    subject: schema.string({}, [rules.required()]),
    message: schema.string({}, [rules.required()]),
  })
}
