import { DateTime } from 'luxon'
import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Tutor extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public subject: string

  @column()
  public qualifications: string

  @column()
  public fee: number

  @column()
  public location: string

  @column()
  public status: string

  @column()
  public profilePicture: string

  @hasOne(() => User)
  public user: HasOne<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
