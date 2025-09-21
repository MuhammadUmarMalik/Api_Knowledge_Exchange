import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Role from 'App/Models/Role'

export default class AdminSeeder extends BaseSeeder {
  public async run() {
    // Ensure admin role exists
    const [adminRole] = await Role.updateOrCreateMany('name', [
      { name: 'admin' },
    ])

    // Upsert admin user by email
    const adminUser = await User.firstOrCreate(
      { email: 'admin@example.com' },
      { name: 'User', gender: 'male', password: 'secret' }
    )

    // Attach role if not already
    await adminUser.load('roles')
    const alreadyHasRole = adminUser.roles.some((r) => r.id === adminRole.id)
    if (!alreadyHasRole) {
      await adminUser.related('roles').attach([adminRole.id])
    }
  }
}

