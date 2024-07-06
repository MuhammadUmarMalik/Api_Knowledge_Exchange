import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Seller from 'App/Models/Seller'
import Tutor from 'App/Models/Tutor'
import UserRole from 'App/Models/UserRole'
import Role from 'App/Models/Role';
import Application from '@ioc:Adonis/Core/Application'
export default class RequestRolesController {

    public async applyAsSeller({ auth, request, response }: HttpContextContract) {
        const user = auth.user as User
        const { name, phoneNumber } = request.only(['name', 'phoneNumber'])

        // Assuming 'seller' role exists in the roles table with id 1
        const role = await Role.findByOrFail('name', 'seller')

        // Create user_role entry
        const userRole = new UserRole()
        userRole.userId = user.id
        userRole.roleId = role.id
        await userRole.save()

        // Save seller details
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
        const { subject, qualifications, fee, location } = request.only([
            'subject', 'qualifications', 'fee', 'location'
        ])


        // Handle profile picture upload
        const uploadedProfilePicture = request.file('profilePicture')

        if (!uploadedProfilePicture) {
            return response.badRequest('Profile picture is required')
        }

        // Generate a unique filename
        const fileName = `${new Date().getTime()}_${uploadedProfilePicture.clientName}`

        // Move the uploaded file to a specified directory
        await uploadedProfilePicture.move(Application.tmpPath('uploads'), {
            name: fileName,
        })

        if (!uploadedProfilePicture.isValid) {
            return response.badRequest(uploadedProfilePicture.errors)
        }
        const role = await Role.findByOrFail('name', 'tutor')
        const userRole = new UserRole()
        userRole.userId = user.id
        userRole.roleId = role.id
        await userRole.save()

        const tutor = new Tutor()
        tutor.userId = user.id
        tutor.subject = subject
        tutor.qualifications = qualifications
        tutor.fee = fee
        tutor.location = location
        tutor.profilePicture = `uploads/${fileName}`
        tutor.status = 'pending'
        await tutor.save()

        return response.ok({ message: 'Tutor application submitted' })
    }

    public async approve({ auth, params, response }: HttpContextContract) {
        const admin = auth.user as User
        await admin.load('roles')
        const isAdmin = admin.roles.some(role => role.name === 'admin')
        if (!isAdmin) {
            return response.unauthorized('Role based authorization failed')
        }

        const { role, userId } = params

        try {
            const user = await User.findOrFail(userId)
            await user.load('roles')
            const userHasRole = user.roles.some(r => r.name === role)

            // if (userHasRole) {
            //     return response.badRequest('User already has the specified role')
            // }
            if (role === 'seller') {
                const seller = await Seller.query().where('user_id', user.id).firstOrFail()
                seller.status = 'active'
                await seller.save()

                const defaultRole = await Role.findBy('name', 'seller')
                if (defaultRole) {
                    await user.related('roles').attach([defaultRole.id])
                }
            } else if (role === 'tutor') {
                const tutor = await Tutor.query().where('user_id', user.id).firstOrFail()
                tutor.status = 'active'
                await tutor.save()

                const defaultRole = await Role.findBy('name', 'tutor')
                if (defaultRole) {
                    await user.related('roles').attach([defaultRole.id])
                }
            } else {
                return response.badRequest('Invalid role')
            }

            return response.ok({ message: 'Role approved' })
        } catch (error) {
            console.error('Error approving role:', error.message)
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound('Resource not found')
            }
            return response.status(500).send({ error: 'Failed to approve role' })
        }
    }
    public async getPendingApplications({ response }: HttpContextContract) {
        try {
            const pendingSellers = await Seller.query().where('status', 'pending').preload('user')
            const pendingTutors = await Tutor.query().where('status', 'pending').preload('user')

            return response.send({ pendingSellers, pendingTutors })
        } catch (error) {
            console.log(error)
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
