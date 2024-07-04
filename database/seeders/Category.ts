import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Category from 'App/Models/Category'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    // await Category.createMany([
    //   {
    //     name: 'Course Books'
    //   },
    //   {
    //     name: 'Novels'
    //   },
    //   {
    //     name: 'Peotry'
    //   },
    //   {
    //     name: 'Fantasy'
    //   }
    // ])
    const categories = ['Course Books', 'Novels', 'Peotry', 'Fantasy']

    for (const name of categories) {
      await Category.firstOrCreate({ name })
    }
  }
}
