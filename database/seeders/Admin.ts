import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Role from 'App/Models/Role'

export default class AdminSeeder extends BaseSeeder {
  public async run() {
    // Check if the user already exists to avoid duplication
    const adminUser = await User.findBy('email', 'admin@example.com')

    if (!adminUser) {
      // Create the admin user
      const user = await User.create({
        name: 'Admin',
        gender: 'male',
        email: 'admin@example.com',
        password: 'adminpassword'
      })

      // Find the admin role (ensure this role exists in your Role table)
      const adminRole = await Role.findBy('name', 'admin')

      if (!adminRole) {
        throw new Error('Admin role not found')
      }

      // Assign the admin role to the user
      await user.related('roles').attach([adminRole.id])
    }
  }
}
