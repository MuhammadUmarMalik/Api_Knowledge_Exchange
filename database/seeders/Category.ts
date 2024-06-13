import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Category from 'App/Models/Category'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await Category.createMany([
      {
        name:'Math'
      },
      {
        name:'Science'
      },
      {
        name:'Arts'
      }
    ])
  }
}
