import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Customer from './Customer'
import Seller from './Seller'
import Tutor from './Tutor'

export default class Review extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public customerId: number

  @column()
  public sellerId: number

  @column()
  public tutorId: number

  @column()
  public rating: number

  @column()
  public review: string

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Customer)
  public customer: BelongsTo<typeof Customer>

  @belongsTo(() => Seller)
  public seller: BelongsTo<typeof Seller>

  @belongsTo(() => Tutor)
  public tutor: BelongsTo<typeof Tutor>
}
