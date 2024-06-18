import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Tutor from 'App/Models/Tutor'
import User from 'App/Models/User'

export default class TutorsController {
    public async index({ response }: HttpContextContract) {
        const tutors = await Tutor.all()
        return response.json(tutors)
    }

    public async store({ request, response }: HttpContextContract) {
        const data = request.only(['user_id', 'subject', 'qualifications', 'fee', 'location', 'profilePicture'])

        // Check if user exists
        const user = await User.find(data.user_id)
        if (!user) {
            return response.status(404).json({ message: 'User not found' })
        }

        // Create tutor if user exists
        const tutor = await Tutor.create(data)
        return response.status(201).json(tutor)
    }

    public async show({ params, response }: HttpContextContract) {
        const tutor = await Tutor.findOrFail(params.id)
        return response.json(tutor)
    }

    public async update({ params, request, response }: HttpContextContract) {
        const data = request.only(['subject', 'qualifications', 'fee', 'location', 'profilePicture'])
        const tutor = await Tutor.findOrFail(params.id)
        tutor.merge(data)
        await tutor.save()
        return response.json(tutor)
    }

    public async destroy({ params, response }: HttpContextContract) {
        const tutor = await Tutor.findOrFail(params.id)
        await tutor.delete()
        return response.status(204).json(null)
    }

    public async getByLocation({ params, response }: HttpContextContract) {
        const location = params.location
        const tutors = await Tutor.query().where('location', location)
        return response.json(tutors)
    }
}
