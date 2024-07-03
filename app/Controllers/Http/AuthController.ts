import { Response } from 'App/Utils/ApiUtil';
// app/Controllers/Http/AuthController.ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import { LoginValidator } from 'App/Validators/AuthValidator';
export default class AuthController {
    public async register({ auth, request, response }: HttpContextContract) {
        try {
            const { name, gender, email, password } = request.only(['name', 'gender', 'email', 'password'])
            const user = new User()
            user.name = name
            user.gender= gender
            user.email = email
            user.password = password
            await user.save()


            return response.send(Response('User Register Successfully', { user }))
        } catch (error) {
            console.error(error)

        }
    }
    public async login({ request, response, auth }: HttpContextContract) {
        await request.validate({ schema: LoginValidator })
        const email = request.input('email')
        const password = request.input('password')
        try {
            const user = await User.findBy('email', email)
            if (!user || !(await Hash.verify(user.password, password))) {
                return response.status(401).json({ message: 'Invalid credentials' })
            }
            const token = await auth.use('api').attempt(email, password, {
                expiresIn: '5 days',
            })
            return response.send(Response('User Login Successfully', { user, token,role:user.role }))
        } catch (error) {
            console.log(error)
            return response.status(500).json({ error: { message: 'Internal server error' } })
        }
    }
    public async destroy({ params, response }: HttpContextContract) {
        const user = await User.find(params.id)
        if (!user) {
            return response.notFound({ message: 'User not found' })
        }
        await user.delete()
        return response.send(Response('User Deleted Successfully', user))
    }

    public async logout({ auth, response }: HttpContextContract) {
        await auth.logout()
        return response.status(200)
    }

    public async update({ request, response }: HttpContextContract) {
        try {
            const data = request.all()

        } catch (error) {

        }
    }
}
