// database/seeders/CustomerSeeder.ts
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Customer from 'App/Models/Customer'
import User from 'App/Models/User'

export default class CustomerSeeder extends BaseSeeder {
  public async run() {
    const user = await User.create({
      name: 'Customer User',
      gender: 'female',
      email: 'customer@example.com',
      password: 'password',
      role: 'customer',
    })

    await Customer.create({
      userId: user.id
    })
  }
}
