import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Role from 'App/Models/Role'
import Seller from 'App/Models/Seller'

export default class SellerSeeder extends BaseSeeder {
  public async run() {
    const [sellerRole] = await Role.updateOrCreateMany('name', [
      { name: 'seller' },
    ])

    const user = await User.firstOrCreate(
      { email: 'seller@example.com' },
      { name: 'Sample Seller', gender: 'male', password: 'secret' }
    )

    await user.load('roles')
    if (!user.roles.some((r) => r.id === sellerRole.id)) {
      await user.related('roles').attach([sellerRole.id])
    }

    await Seller.firstOrCreate(
      { userId: user.id },
      { userId: user.id, name: 'Sample Seller', phoneNumber: '1234567890', status: 'active' }
    )
  }
}


