import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Category from 'App/Models/Category'
import Seller from 'App/Models/Seller'
import Book from 'App/Models/Book'
import BookImage from 'App/Models/BookImage'

export default class BookSeeder extends BaseSeeder {
  public async run() {
    const category = await Category.firstOrCreate({ name: 'Course Books' })
    const seller = await Seller.first()

    if (!seller) {
      // Cannot seed books without a seller; exit silently
      return
    }

    const books = await Book.createMany([
      {
        name: 'Algebra Essentials',
        author: 'J. Smith',
        categoryId: category.id,
        sellerId: seller.id,
        condition: 'new',
        price: 25,
        quantity: 10,
      },
      {
        name: 'Introduction to Physics',
        author: 'A. Brown',
        categoryId: category.id,
        sellerId: seller.id,
        condition: 'used-good',
        price: 18,
        quantity: 7,
      },
    ])

    for (const book of books) {
      await BookImage.create({
        bookId: book.id,
        path: 'uploads/sample-book.png',
      })
    }
  }
}


