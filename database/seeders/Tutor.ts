// database/seeders/TutorSeeder.ts
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Tutor from 'App/Models/Tutor'
import User from 'App/Models/User'

export default class TutorSeeder extends BaseSeeder {
  public async run() {
    const user = await User.create({
      name: 'Tutor User',
      gender: 'male',
      email: 'tutor@example.com',
      password: 'password',
      role: 'tutor',
    })

    await Tutor.create({
      userId: user.id,
      subject: 'English',
      qualifications: 'M.A',
      fee: 10000,
      location: 'Johar Town',
      status: 'pending',
      profilePicture: 'default.png'
    })
  }
}
