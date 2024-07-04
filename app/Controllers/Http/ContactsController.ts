import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Contact from 'App/Models/Contact'
import ContactValidator from 'App/Validators/ContactValidator'

export default class ContactController {
    public async store({ request, response }: HttpContextContract) {
        const data = await request.validate(ContactValidator)
        const contact = await Contact.create({
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
        })
        return response.created(contact)
    }
}
