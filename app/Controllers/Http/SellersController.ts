import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Seller from 'App/Models/Seller'
// import User from 'App/Models/User'

export default class SellersController {
    public async index({ response }: HttpContextContract) {

        const tutors = await Seller.all()

        return response.json(tutors)
    }

    public async show({ params, response }: HttpContextContract) {
        const tutor = await Seller.findOrFail(params.id)
        return response.json(tutor)
    }

    public async update({ params, request, response }: HttpContextContract) {
        const data = request.only(['name', 'phone_number'])
        const tutor = await Seller.findOrFail(params.id)
        tutor.merge(data)
        await tutor.save()
        return response.json(tutor)
    }

    public async destroy({ params, response }: HttpContextContract) {
        const tutor = await Seller.findOrFail(params.id)
        await tutor.delete()
        return response.status(204).json(null)
    }

}
