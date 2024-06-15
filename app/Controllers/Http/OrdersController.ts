import Mail from '@ioc:Adonis/Addons/Mail'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Book from 'App/Models/Book'
import Customer from 'App/Models/Customer'
import Order from 'App/Models/Order'
import OrderItem from 'App/Models/OrderItem'
import PaymentDetail from 'App/Models/PaymentDetail'
import { v4 as uuidv4 } from 'uuid'
export default class OrdersController {
    public async store({ auth, request, response }: HttpContextContract) {
        const { name, email, phone, address, books, offer } = request.only(['name', 'email', 'phone', 'address', 'books', 'offer'])

        if (!Array.isArray(books) || books.length === 0) {

            return response.status(400).json({ message: 'books are required and must be an array' })

        }
        const user = auth.user;
        if (user?.role !== 'customer') {
            return response.status(401).send({ message: "Forbidden: Only sellers can create books" });
        }

        const customer = await Customer.findBy('user_id', user?.id);

        if (!customer) {
            return response.status(401).send({ message: "Forbidden: Only sellers can create books" });
        }

        try {
            // Fetch products from the database
            const bookIds = books.map(b => b.bookId)
            const bookList = await Book.query().whereIn('id', bookIds)

            // Check if all requested products are available in sufficient quantity
            let totalPrice = 0
            for (let book of books) {
                const foundProduct = bookList.find(b => b.id === book.bookId)
                if (!foundProduct || foundProduct.quantity < book.buyingQuantity) {
                    return response.status(400).json({ message: `Product ${book.name} is not available in the requested quantity` })
                }
                // Calculate total price
                totalPrice += foundProduct.price * book.buyingQuantity
            }

            // Update product quantities
            for (let book of books) {
                const foundProduct = bookList.find(b => b.id === book.bookId)
                console.log(foundProduct);
                if (foundProduct) {
                    foundProduct.quantity -= book.buyingQuantity
                    await foundProduct.save()
                }
            }


            // Create the order
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
                status: 'pending' // Default status
            })
            // Create order items
            for (const book of books) {
                const foundProduct = bookList.find(p => p.id === book.bookId)
                if (foundProduct) {
                    await OrderItem.create({
                        orderId: newOrder.id,
                        bookId: book.bookId,
                        book_name: foundProduct.name, // Include the product name
                        quantity: book.buyingQuantity,
                    })
                }
            }

            // Send confirmation email
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
            return response.send(newOrder);
        } catch (error) {
            return response.status(500).json({ message: 'An error occurred while processing your order', error: error.message })
        }
    }

}
