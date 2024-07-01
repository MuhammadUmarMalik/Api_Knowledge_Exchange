// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import User from 'App/Models/User'
// import Seller from 'App/Models/Seller'
// import Tutor from 'App/Models/Tutor'

// export default class RoleRequestController {
//     public async requestRole({ request, auth, response }: HttpContextContract) {
//         const user = auth.user

//         if (!user) {
//             return response.unauthorized({ message: 'You must be logged in to request a role' })
//         }

//         const { role, name, phoneNumber, subject, qualifications, fee, location, profilePicture } = request.all()

//         if (role === 'seller') {
//             const existingRequest = await Seller.query().where('user_id', user.id).first()
//             if (existingRequest) {
//                 return response.badRequest({ message: 'You have already requested this role' })
//             }
//             await Seller.create({ userId: user.id, name, phoneNumber, status: 'pending' })
//         } else if (role === 'tutor') {
//             const existingRequest = await Tutor.query().where('user_id', user.id).first()
//             if (existingRequest) {
//                 return response.badRequest({ message: 'You have already requested this role' })
//             }
//             await Tutor.create({ userId: user.id, subject, qualifications, fee, location, profilePicture, })
//         } else {
//             return response.badRequest({ message: 'Invalid role requested' })
//         }

//         return response.status(201).json({ message: 'Request submitted successfully' })
//     }

//     public async approve({ params, response }: HttpContextContract) {
//         const { id, role } = params

//         let request
//         if (role === 'seller') {
//             request = await Seller.findOrFail(id)
//         } else if (role === 'tutor') {
//             request = await Tutor.findOrFail(id)
//         } else {
//             return response.badRequest({ message: 'Invalid role' })
//         }

//         request.status = 'approved'
//         await request.save()

//         const user = await User.findOrFail(request.userId)
//         user.role = role
//         await user.save()

//         return response.status(200).json({ message: 'Request approved' })
//     }

//     public async reject({ params, response }: HttpContextContract) {
//         const { id, role } = params

//         let request
//         if (role === 'seller') {
//             request = await Seller.findOrFail(id)
//         } else if (role === 'tutor') {
//             request = await Tutor.findOrFail(id)
//         } else {
//             return response.badRequest({ message: 'Invalid role' })
//         }

//         request.status = 'rejected'
//         await request.save()

//         return response.status(200).json({ message: 'Request rejected' })
//     }
// }
