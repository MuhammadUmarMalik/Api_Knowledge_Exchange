// database/seeders/CustomerSeeder.ts
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Role from 'App/Models/Role'
import Customer from 'App/Models/Customer'

export default class CustomerSeeder extends BaseSeeder {
  public async run() {
    const customerRole = await Role.findByOrFail('name', 'customer')
    const customerUser = await User.create({
      name: 'Customer User',
      gender: 'male',
      email: 'customer@example.com',
      password: 'secret',
    })
    await customerUser.related('roles').attach([customerRole.id])

    await Customer.create({
      userId: customerUser.id,
    })
  }
}
