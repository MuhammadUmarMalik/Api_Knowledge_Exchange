import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'
import Seller from './Seller'
import BookImage from './BookImage'
import OrderItem from './OrderItem'

export default class Book extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public categoryId: number

  @column()
  public sellerId: number

  @column()
  public name: string

  @column()
  public author: string

  @column()
  public price: number

  @column()
  public quantity: number

  @column()
  public condition: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>

  @belongsTo(() => Seller)
  public seller: BelongsTo<typeof Seller>

  @hasMany(() => BookImage)
  public images: HasMany<typeof BookImage>

  @hasMany(() => OrderItem)
  public orderItems: HasMany<typeof OrderItem>
}
