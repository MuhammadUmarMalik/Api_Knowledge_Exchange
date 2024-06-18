import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CreateTutor {
  public schema = schema.create({
    user_id: schema.number([
      rules.exists({ table: 'users', column: 'id' }),
    ]),
    subject: schema.string(),
    qualifications: schema.string(),
    fee: schema.number(),
    location: schema.string(),
    profilePicture: schema.string(),
  })

  public messages = {
    'user_id.exists': 'User does not exist',
  }
}
