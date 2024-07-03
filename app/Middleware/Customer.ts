// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
// export default class AdminAuth {
//     public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
//         try {
//             const user = auth.user?.role
//             console.log('user------->', auth.user?.role)
//             if (!user || user !== 'customer') {
//                 return response.unauthorized({ error: 'Role Base Authorization Failed' });
//             }
//             await next();
//         } catch (error) {
//             return response.status(400).send(error);
//         }
//     }
// }
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Customer {
    public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
        const user = await auth.authenticate()
        console.log(user)
        if (user.role !== 'customer') {

            return response.unauthorized('Access denied')
        }
        await next()
    }
}
