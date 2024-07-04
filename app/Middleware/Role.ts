// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import User from 'App/Models/User'

// export default class RoleMiddleware {
//   public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>, roles: string[]) {
//     try {
//       await auth.use('api').authenticate()
//       const user = auth.user as User

//       // console.log('Authenticated user:', user)
//       // console.log('User email:', user?.email)

//       if (!user) {
//         return response.unauthorized('User not authenticated')
//       }

//       await user.load('roles')

//       const userRoles = user.roles.map(role => role.name)
//       const hasRole = roles.some(role => userRoles.includes(role))
//       console.log("============", userRoles)
//       console.log("============", hasRole)
//       if (!hasRole) {
//         return response.unauthorized('Role-based authorization failed')
//       }

//       await next()
//     } catch (error) {
//       console.error('Error in RoleMiddleware:', error)
//       return response.unauthorized('Authentication failed')
//     }
//   }
// }
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class RoleMiddleware {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>, roles: string[]) {
    await auth.use('api').authenticate()
    const user = auth.user as User

    // Ensure user is authenticated
    if (!user) {
      return response.unauthorized('User not authenticated')
    }

    // Load user's roles
    await user.load('roles')

    // Check if user has any of the required roles
    const userRoles = user.roles.map(role => role.name)
    const hasRole = roles.some(role => userRoles.includes(role))

    if (!hasRole) {
      return response.unauthorized('Role-based authorization failed')
    }

    // Call the next middleware or controller
    await next()
  }
}
