import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Seller from 'App/Models/Seller'
import Tutor from 'App/Models/Tutor'

export default class RequestRolesController {
    public async applyAsSeller({ auth, request, response }: HttpContextContract) {
        const user = auth.user as User
        const { name, phoneNumber } = request.only(['name', 'phoneNumber'])

        const seller = new Seller()
        seller.userId = user.id
        seller.name = name
        seller.phoneNumber = phoneNumber
        seller.status = 'pending'
        await seller.save()

        return response.ok({ message: 'Seller application submitted' })
    }

    public async applyAsTutor({ auth, request, response }: HttpContextContract) {
        const user = auth.user as User
        const { subject, qualifications, fee, location, profilePicture } = request.only([
            'subject', 'qualifications', 'fee', 'location', 'profilePicture'
        ])

        const tutor = new Tutor()
        tutor.userId = user.id
        tutor.subject = subject
        tutor.qualifications = qualifications
        tutor.fee = fee
        tutor.location = location
        tutor.profilePicture = profilePicture
        tutor.status = 'pending'
        await tutor.save()

        return response.ok({ message: 'Tutor application submitted' })
    }

    public async approve({ auth, params, response }: HttpContextContract) {
        const admin = auth.user as User

        if (admin.role !== 'admin') {
            return response.unauthorized('Role based authorization failed')
        }

        const { role, userId } = params
        const user = await User.findOrFail(userId)

        if (role === 'seller') {
            const seller = await Seller.query().where('user_id', user.id).first()
            if (!seller) {
                return response.badRequest('Seller not found')
            }
            seller.status = 'active'
            await seller.save()
            user.role = 'seller'
            await user.save()
        } else if (role === 'tutor') {
            const tutor = await Tutor.query().where('user_id', user.id).first()
            if (!tutor) {
                return response.badRequest('Tutor not found')
            }
            tutor.status = 'active'
            await tutor.save()
            user.role = 'tutor'
            await user.save()
        } else {
            return response.badRequest('Invalid role')
        }

        return response.ok({ message: 'Role approved' })
    }

    public async getPendingApplications({ response }: HttpContextContract) {
        try {
            const pendingSellers = await Seller.query().where('status', 'pending').preload('user')
            const pendingTutors = await Tutor.query().where('status', 'pending').preload('user')

            return response.ok({ pendingSellers, pendingTutors })
        } catch (error) {
            return response.status(500).send({ error: 'Internal server error' })
        }
    }

    public async getSellerStatus({ auth, response }: HttpContextContract) {
        try {
            const user = auth.user
            if (!user) {
                return response.unauthorized('User not authenticated')
            }

            let sellerStatus: string | null = null

            const sellerApplication = await Seller.query().where('user_id', user.id).first()
            if (sellerApplication) {
                sellerStatus = sellerApplication.status || null
            }

            return response.ok({ sellerStatus })
        } catch (error) {
            console.error('Error fetching seller status:', error)
            return response.status(500).send({ error: 'Internal server error' })
        }
    }

    public async getTutorStatus({ auth, response }: HttpContextContract) {
        try {
            const user = auth.user
            if (!user) {
                return response.unauthorized('User not authenticated')
            }

            let tutorStatus: string | null = null

            const tutorApplication = await Tutor.query().where('user_id', user.id).first()
            if (tutorApplication) {
                tutorStatus = tutorApplication.status || null
            }

            return response.ok({ tutorStatus })
        } catch (error) {
            console.error('Error fetching tutor status:', error)
            return response.status(500).send({ error: 'Internal server error' })
        }
    }
}
