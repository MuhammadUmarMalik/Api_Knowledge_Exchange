import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class Seller {
    public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
        const user = await auth.authenticate()
        if (user.role !== 'seller') {
            return response.unauthorized('Access denied')
        }
        await next()
    }
}