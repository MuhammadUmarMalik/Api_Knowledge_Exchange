import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import OrderItem from './OrderItem'
import Customer from './Customer'
import PaymentDetail from './PaymentDetail'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public customerId: number

  @column()
  public order_number: string

  @column()
  public total: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public phone: string

  @column()
  public address: string

  @column()
  public status: string

  @column()
  public offer: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => OrderItem)
  public orderItems: HasMany<typeof OrderItem>

  @belongsTo(() => Customer)
  public customer: BelongsTo<typeof Customer>

  @hasMany(() => PaymentDetail)
  public paymentDetails: HasMany<typeof PaymentDetail>

}
