// database/seeders/AdminSeeder.ts
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class AdminSeeder extends BaseSeeder {
  public async run() {
    await User.create({
      name: 'Admin User',
      gender: 'male',
      email: 'admin@example.com',
      password: 'adminpassword',
      role: 'admin',
      phone_number: '0001112223',
    })
  }
}
