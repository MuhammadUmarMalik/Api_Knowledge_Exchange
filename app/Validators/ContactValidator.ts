import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class ContactValidator {
  public schema = schema.create({
    first_name: schema.string({}, [rules.required()]),
    last_name: schema.string({}, [rules.required()]),
    email: schema.string({}, [rules.email(), rules.required()]),
    phone_number: schema.string({}, [rules.required()]),
    message: schema.string({}, [rules.required()]),
  })
}
