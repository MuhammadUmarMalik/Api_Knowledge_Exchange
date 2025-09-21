// database/seeders/CustomerSeeder.ts
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Role from 'App/Models/Role'
import Customer from 'App/Models/Customer'

export default class CustomerSeeder extends BaseSeeder {
  public async run() {
    // Ensure customer role exists
    const [customerRole] = await Role.updateOrCreateMany('name', [
      { name: 'customer' },
    ])

    // Upsert customer user by email
    const customerUser = await User.firstOrCreate(
      { email: 'customer@example.com' },
      { name: 'Customer User', gender: 'male', password: 'secret' }
    )

    // Attach role if not already
    await customerUser.load('roles')
    const alreadyHasRole = customerUser.roles.some((r) => r.id === customerRole.id)
    if (!alreadyHasRole) {
      await customerUser.related('roles').attach([customerRole.id])
    }

    await Customer.firstOrCreate({ userId: customerUser.id }, { userId: customerUser.id })
  }
}
