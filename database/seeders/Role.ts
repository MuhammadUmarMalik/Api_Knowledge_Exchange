// database/seeders/RoleSeeder.ts
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class RoleSeeder extends BaseSeeder {
  public async run() {
    const roles = ['admin', 'tutor', 'seller', 'customer']
    for (const name of roles) {
      await Role.firstOrCreate({ name }, { name })
    }
  }
}
