// database/seeders/RoleSeeder.ts
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class RoleSeeder extends BaseSeeder {
  // static findByOrFail(arg0: string, arg1: string) {
  //   throw new Error('Method not implemented.')
  // }
  public async run() {
    await Role.createMany([
      { name: 'admin' },
      { name: 'tutor' },
      { name: 'seller' },
      { name: 'customer' },
    ])
  }
}
