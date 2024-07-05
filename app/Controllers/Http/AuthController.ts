// app/Controllers/Http/AuthController.ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Role from 'App/Models/Role'
import Hash from '@ioc:Adonis/Core/Hash'
import { LoginValidator } from 'App/Validators/AuthValidator'
import { Response } from 'App/Utils/ApiUtil'
import Customer from 'App/Models/Customer'

export default class AuthController {
    public async register({ request, response }: HttpContextContract) {
        try {
            const { name, gender, email, password } = request.only(['name', 'gender', 'email', 'password',])
            const user = new User()
            user.name = name
            user.gender = gender
            user.email = email
            user.password = password
            // user.roles = roles
            await user.save()

            const defaultRole = await Role.findBy('name', 'customer')
            if (defaultRole) {
                await user.related('roles').attach([defaultRole.id])
            }
            const customer = new Customer()
            customer.userId = user.id
            await customer.save()


            return response.send(Response('User Registered Successfully', { user }))
        } catch (error) {
            console.error(error)
            return response.status(500).json({ error: { message: 'Internal server error' } })
        }
    }

    public async login({ request, response, auth }: HttpContextContract) {
        await request.validate({ schema: LoginValidator })
        const email = request.input('email')
        const password = request.input('password')

        try {
            const user = await User.query().where('email', email).preload('roles').first()
            if (!user || !(await Hash.verify(user.password, password))) {
                return response.status(401).json({ message: 'Invalid credentials' })
            }
            const token = await auth.use('api').attempt(email, password, {
                expiresIn: '5 days',
            })
            const roles = user.roles.map(role => role.name)
            return response.send(Response('User Logged In Successfully', {
                user,
                token,
                roles
            }))
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
        return response.status(200).json({ message: 'Logged out successfully' })
    }

    public async update({ request, response }: HttpContextContract) {
        try {
            const data = request.all()
            // Your update logic here
            return response.status(200).json({ message: 'Update successful', data })
        } catch (error) {
            console.error(error)
            return response.status(500).json({ error: { message: 'Internal server error' } })
        }
    }

    public async getCustomer({ auth, response }: HttpContextContract) {
        try {
            const user = auth.user!
            const customer = await Customer.findBy('userId', user.id)

            if (!customer) {
                return response.status(404).json({ message: 'Customer not found' })
            }
            return response.send(Response('Customer Details Retrieved Successfully', { customer }))
        } catch (error) {
            console.error(error)
            return response.status(500).json({ error: { message: 'Internal server error' } })
        }
    }
}
