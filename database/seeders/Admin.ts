import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Role from 'App/Models/Role'

export default class AdminSeeder extends BaseSeeder {
  public async run() {
    const adminRole = await Role.findByOrFail('name', 'admin')
    const adminUser = await User.create({
      name: 'User',
      gender: 'male',
      email: 'admin@example.com',
      password: 'secret',
    })
    await adminUser.related('roles').attach([adminRole.id])

  }
}

