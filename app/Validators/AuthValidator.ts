import { schema, rules } from '@ioc:Adonis/Core/Validator'

export const AuthValidator = schema.create({
  name: schema.string([rules.required()]),
  email: schema.string([rules.required(), rules.email()]),
  password: schema.string([rules.minLength(8), rules.required()]),
  role: schema.string([rules.required()]),
  phone_number: schema.string([rules.required()]),
  // profilePicture: schema.string([rules.optional()])
})

export const LoginValidator = schema.create({
  email: schema.string([rules.required(), rules.email()]),
  password: schema.string([rules.minLength(4), rules.required()]),
})

