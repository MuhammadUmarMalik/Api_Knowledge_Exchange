import { DateTime } from 'luxon'
import { BaseModel, HasMany, HasOne, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Book from './Book'

export default class Seller extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @hasOne(() => User)
  public user: HasOne<typeof User>

  @hasMany(() => Book)
  public books: HasMany<typeof Book>
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
