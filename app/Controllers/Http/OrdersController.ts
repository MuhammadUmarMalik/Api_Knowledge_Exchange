import Mail from '@ioc:Adonis/Addons/Mail'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Book from 'App/Models/Book'
import Customer from 'App/Models/Customer'
import Order from 'App/Models/Order'
import OrderItem from 'App/Models/OrderItem'
import PaymentDetail from 'App/Models/PaymentDetail'
import { v4 as uuidv4 } from 'uuid'
import { Response } from 'App/Utils/ApiUtil'
export default class OrdersController {
    public async store({ auth, request, response }: HttpContextContract) {
        const { name, email, phone, address, books, offer } = request.only(['name', 'email', 'phone', 'address', 'books', 'offer'])

        if (!Array.isArray(books) || books.length === 0) {
            return response.status(400).json({ message: 'Books are required and must be an array' })
        }

        const user = auth.user
        await user?.load('roles')
        const isCustomer = user?.roles.some(role => role.name === 'customer')

        if (!isCustomer) {
            return response.status(401).send({ message: "Forbidden: Only customers can create orders" })
        }

        const customer = await Customer.findBy('user_id', user?.id)
        if (!customer) {
            return response.status(401).send({ message: "Forbidden: Only customers can create orders" })
        }

        try {
            const bookIds = books.map(b => b.bookId)
            const bookList = await Book.query().whereIn('id', bookIds)

            let totalPrice = 0
            for (let book of books) {
                const foundBook = bookList.find(b => b.id === book.bookId)
                if (!foundBook || foundBook.quantity < book.buyingQuantity) {
                    return response.status(400).json({ message: `Book ${book.name} is not available in the requested quantity` })
                }
                totalPrice += foundBook.price * book.buyingQuantity
            }

            for (let book of books) {
                const foundBook = bookList.find(b => b.id === book.bookId)
                if (foundBook) {
                    foundBook.quantity -= book.buyingQuantity
                    await foundBook.save()
                }
            }

            const orderNumber = uuidv4()
            const newOrder = await Order.create({
                customerId: customer.id,
                name,
                email,
                phone,
                address,
                order_number: orderNumber,
                total: totalPrice,
                status: 'pending',
                offer,
            })

            await PaymentDetail.create({
                orderId: newOrder.id,
                amount: totalPrice,
                type: 'card',
                status: 'pending'
            })

            for (const book of books) {
                const foundBook = bookList.find(b => b.id === book.bookId)
                if (foundBook) {
                    await OrderItem.create({
                        orderId: newOrder.id,
                        bookId: book.bookId,
                        book_name: foundBook.name,
                        quantity: book.buyingQuantity,
                    })
                }
            }

            await Mail.send((message) => {
                message
                    .to(email)
                    .from('no-reply@yourstore.com')
                    .subject('Order Confirmation')
                    .html(`
            <h1>Order Confirmation</h1>
            <p>Dear ${name},</p>
            <p>Thank you for your order. Your order number is <br> ${orderNumber}.</p>
            <p>We will notify you once your order is  ${newOrder.status}.</p>
            <p>Thank you for shopping with us!</p>
            <h3>Regards: Knowledge Exchange</h3>
          `)
            })

            return response.send(newOrder)
        } catch (error) {
            return response.status(500).json({ message: 'An error occurred while processing your order', error: error.message })
        }
    }


    public async updateOrderStatus({ request, params, response }: HttpContextContract) {
        const orderId = params.id
        const { status } = request.only(['status'])

        const order = await Order.find(orderId)
        if (!order) {
            return response.status(404).json({ message: 'Order not found' })
        }

        order.status = status
        await order.save()
        await Mail.send((message) => {
            message
                .to(order.email)
                .from('no-reply@yourstore.com')
                .subject('Order Confirmation')
                .html(`
            <h1>Order Confirmation</h1>
            <p>Dear ${order.name},</p>
            <p>Thank you for your order. Your order number is <br> ${order.order_number}.</p>
            <p>We will notify you once your order is ${order.status}.</p>
            <p>Thank you for shopping with us!</p>
            <h3>Regards: Knowledge Exchange</h3>
          `)
        })

        return response.status(200).json({ message: 'Order status updated successfully', order })
    }

    public async updatePaymentStatus({ request, params, response }: HttpContextContract) {
        const orderId = params.id
        const { status } = request.only(['status'])

        const paymentDetail = await PaymentDetail.findBy('order_id', orderId)
        if (!paymentDetail) {
            return response.status(404).json({ message: 'Payment details not found' })
        }

        paymentDetail.status = status
        await paymentDetail.save()

        return response.status(200).send(Response('Payment status updated successfully', paymentDetail))
    }

    public async getOrderDetails({ params, response }: HttpContextContract) {
        const orderNumber = params.order_number

        const order = await Order.query()
            .where('order_number', orderNumber)
            .preload('orderItems')
            .preload('paymentDetails')
            .first()

        if (!order) {
            return response.status(404).json({ message: 'Order not found' })
        }

        return response.status(200).json({ message: 'Order details fetched successfully', order })
    }
}
