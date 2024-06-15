import { Response } from 'App/Utils/ApiUtil';
// app/Controllers/Http/AuthController.ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import { LoginValidator } from 'App/Validators/AuthValidator';
import Tutor from 'App/Models/Tutor';
import Seller from 'App/Models/Seller';
import Customer from 'App/Models/Customer';


export default class AuthController {
    public async register({ auth, request, response }: HttpContextContract) {
        try {

            // await request.validate({ schema: AuthValidator })

            const { name, gender, email, password, phone_number } = request.only(['name', 'gender', 'email', 'password', 'phone_number'])
            const user = new User()
            user.name = name
            user.gender= gender
            user.email = email
            user.password = password
            user.phone_number = phone_number

            await user.save()

            const token = await auth.use('api').generate(user)
            return response.send(Response('User Register Successfully', { user, token }))
        } catch (error) {
            console.error(error)

        }
    }
    public async login({ request, response, auth }: HttpContextContract) {
        await request.validate({ schema: LoginValidator })
        const email = request.input('email')
        const password = request.input('password')
        const role = request.input('role')
        try {
            const user = await User.findBy('email', email)
            if (!user || !(await Hash.verify(user.password, password))) {
                return response.status(401).json({ message: 'Invalid credentials' })
            }
            if (user.role !== role) {
                return response.status(403).json({ message: 'Access denied: incorrect role' })
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
    public async getAllExceptCurrent({ auth, response }: HttpContextContract) {
        try {
            const currentUser = auth.user
            if (!currentUser) {
                return {
                    message: 'User not authenticated',
                }
            }
            const users = await User.query().whereNot('id', currentUser.id)
            return response.send(Response('User Login Successfully', users))
        } catch (error) {
            return response.status(500).json({ error: { message: 'Internal server error' } })

        }
    }
    public async update({ params, request, response }: HttpContextContract) {
        const user = await User.find(params.id)
        if (!user) {
            return response.notFound({ message: 'User not found' })
        }
        const { name, password, role, location } = request.only(['name', 'password', 'role', 'location'])
        user.name = name
        if (password) {
            user.password = password
        } else if (role) {
            user.role = role
        }

        await user.save()

        if (role === 'tutor' && location) {
            const tutor = new Tutor()
            tutor.location = location
            tutor.userId = user.id
            await tutor.save()
        } else if (role === 'customer') {
            const customer = new Customer()
            customer.userId = user.id
            await customer.save()
        } else if (role === 'seller') {
            const seller = new Seller()
            seller.userId = user.id
            await seller.save()
        }


        return response.send(Response('User Updated Successfully', user))
    }
    public async destroy({ params, response }: HttpContextContract) {
        const user = await User.find(params.id)
        if (!user) {
            return response.notFound({ message: 'User not found' })
        }
        await user.delete()
        return response.send(Response('User Deleted Successfully', user))
    }
}
