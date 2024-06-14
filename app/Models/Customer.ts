import { DateTime } from 'luxon'
import { BaseModel, HasMany, HasOne, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Order from './Order'

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @hasOne(() => User)
  public user: HasOne<typeof User>
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Order)
  public orders: HasMany<typeof Order>
}
