// database/seeders/SellerSeeder.ts
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Seller from 'App/Models/Seller'
import User from 'App/Models/User'

export default class SellerSeeder extends BaseSeeder {
  public async run() {
    const user = await User.create({
      name: 'Seller User',
      gender: 'non-binary',
      email: 'seller@example.com',
      password: 'password',
      role: 'seller',
      phone_number: '1122334455'
    })

    await Seller.create({
      userId: user.id
    })
  }
}
