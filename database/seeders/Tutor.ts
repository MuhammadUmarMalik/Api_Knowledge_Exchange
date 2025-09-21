import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Role from 'App/Models/Role'
import Tutor from 'App/Models/Tutor'

export default class TutorSeeder extends BaseSeeder {
  public async run() {
    const [tutorRole] = await Role.updateOrCreateMany('name', [
      { name: 'tutor' },
    ])

    const user = await User.firstOrCreate(
      { email: 'tutor@example.com' },
      { name: 'Sample Tutor', gender: 'female', password: 'secret' }
    )

    await user.load('roles')
    if (!user.roles.some((r) => r.id === tutorRole.id)) {
      await user.related('roles').attach([tutorRole.id])
    }

    await Tutor.firstOrCreate(
      { userId: user.id },
      {
        userId: user.id,
        subject: 'Mathematics',
        qualifications: 'MSc Mathematics',
        fee: 50,
        location: 'Remote',
        status: 'active',
        profilePicture: 'uploads/sample-tutor.png',
      }
    )
  }
}


