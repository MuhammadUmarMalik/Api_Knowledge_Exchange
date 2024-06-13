import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BookValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    name: schema.string([
      rules.required(),
    ]),
    category_id: schema.number([rules.required()]),
    author: schema.string([rules.required()]),
    condition: schema.string([rules.required()]),
    price: schema.number([rules.required()]),
    quantity: schema.number([rules.required()]),

  })

  /**
   * Custom messages for validation failures. You can make use of dot notation (.)
   * for targeting nested fields and array expressions (*) for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'name.required': 'The name cannot be empty.',
    'category_id.required': 'The category_id cannot be empty.',
    'author.required': 'The author cannot be empty',
    'images.required': 'The image cannot be empty',
    'price.required': 'The price cannot be empty.',
    'quantity.required': 'The quantity cannot be empty.',
    'condition.required': 'The condition cannot be empty.',
  }
}