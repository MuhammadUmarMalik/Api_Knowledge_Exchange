import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Seller {
    public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
        try {
            // Ensure user is authenticated
            await auth.use('api').authenticate()

            // Retrieve user's role from auth
            const userRole = auth.user!.role

            console.log('Authenticated User Role:', userRole)

            // Check if user has 'seller' role
            if (userRole !== 'seller') {
                return response.unauthorized({ error: 'Role based authorization failed' })
            }

            // Proceed to next middleware or controller action
            await next()
        } catch (error) {
            console.error('Error in AdminAuth middleware:', error.message)
            return response.unauthorized({ error: 'Unauthorized access' })
        }
    }
}
