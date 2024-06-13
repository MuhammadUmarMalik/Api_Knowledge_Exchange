import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Book from "App/Models/Book";
import { Response } from "App/Utils/ApiUtil";
import BookValidator from "App/Validators/BookValidator";
import Application from "@ioc:Adonis/Core/Application";
import BookImage from "App/Models/BookImage";
import fs from 'fs/promises'
import Seller from "App/Models/Seller";

export default class booksController {
    public async store({ request, response, auth }: HttpContextContract) {
        try {
            const user = auth.user;
            if (user?.role !== 'seller') {
                return response.status(401).send({ message: "Forbidden: Only sellers can create books" });
            }
            const data = await request.validate(BookValidator);
            let book = new Book();
            book.name = data.name;
            book.categoryId = data.category_id;
            book.sellerId = user.id;
            book.author = data.author;
            book.condition = data.condition;
            book.price = data.price;
            book.quantity = data.quantity;
            await book.save();
            const images = request.files('path')
            let bookImages = []
            for (let image of images) {
                await image.move(Application.tmpPath("uploads"), {
                    name: `${Date.now()}-${image.clientName}`,
                });

                let bookImage = new BookImage();
                bookImage.bookId = book.id;
                bookImage.path = `uploads/${image.fileName}`;
                await bookImage.save();

                bookImages.push(bookImage);
            }

            return response.send(
                Response("book Created Successfully", { book, bookImages })
            );
        } catch (error) {
            return response.status(400).send(error);
        }
    }

    public async index({ response }: HttpContextContract) {
        try {
            const books = await Book.query().preload('images');
            const data = books.map((book) => {
                return {
                    id: book.id,
                    name: book.name,
                    category: book.categoryId,
                    author: book.author,
                    condition: book.condition,
                    price: book.price,
                    quantity: book.quantity,
                    images: book.images ? book.images.map((image) => image.path) : [],
                    created_at: book.createdAt,
                    updated_at: book.updatedAt,
                };
            });
            return response.send(Response("Get All books Successfully", data));
        } catch (error) {
            console.log(error)
            return response.status(400).send(error);
        }
    }

    public async show({ params, response }: HttpContextContract) {
        try {
            const book = await Book.query()
                .where('id', params.id)
                .preload('images')
                .firstOrFail();

            const data = {
                id: book.id,
                name: book.name,
                category: book.categoryId,
                author: book.author,
                condition: book.condition,
                price: book.price,
                quantity: book.quantity,
                images: book.images ? book.images.map((image) => image.path) : [],
                created_at: book.createdAt,
                updated_at: book.updatedAt,
            };

            return response.send(
                Response("Get Specified book Successfully", data)
            );
        } catch (error) {
            return response.status(400).send(error);
        }
    }
    public async update({ request, params, response }: HttpContextContract) {
        try {
            const book = await Book.findOrFail(params.id)
            const data = await request.validate(BookValidator)
            await book.merge({
                name: data.name,
                author: data.author,
                price: data.price,
            }).save()
            const image = request.file("path")
            let bookImages = new BookImage()
            if (image) {
                await image.move(Application.tmpPath('uploads'), {
                    name: `${Date.now()}-${image.clientName}`
                })
                const previousImage = Application.tmpPath(`uploads/${image.fileName}`)
                await fs.unlink(previousImage)
                await bookImages.merge({
                    path: image.fileName
                })
            }
            return response.send(Response('book Updated Successfully', { book, bookImages }))
        } catch (error) {
            return response.send(error);
        }
    }
    public async destroy({ params, response }: HttpContextContract) {
        try {
            const book = await Book.findOrFail(params.id);
            await book.delete();
            return response.send(Response("book Deleted Successfully", book));
        } catch (error) {
            return response.status(400).send(error);
        }
    }



    public async pagination({ request, response }: HttpContextContract) {
        try {
            const { date, name, categoryID } = request.qs()
            let query = Book.query().preload('images')

            if (date) {
                query = query.where('created_at', date)
            }

            if (name) {
                query = query.where('name', 'like', `%${name}%`)
            }

            if (categoryID) {
                query = query.where('category_id', categoryID)
            }

            const page = request.input('page', 1)
            const limit = request.input('limit', 10)
            const results = await query.paginate(page, limit)

            results.map((book) => {
                return {
                    id: book.id,
                    name: book.name,
                    category: book.categoryId,
                    author: book.author,
                    condition: book.condition,
                    price: book.price,
                    quantity: book.quantity,
                    images: book.images ? book.images.map((image) => image.path) : [], // Include image paths
                    created_at: book.createdAt,
                    updated_at: book.updatedAt,
                };
            });

            return response.send(Response('Get All books with Pagination', results))
        } catch (error) {
            console.log(error)
            return response.status(500).send(Response('internal server error', error))
        }
    }

    public async deleteImage({ params, response }: HttpContextContract) {
        try {
            const bookImage = await BookImage.findOrFail(params.id)
            const image = Application.tmpPath(`uploads/${bookImage.path}`)
            await fs.unlink(image)
            await bookImage.delete()
            return response.send(Response('book Image Deleted Successfully', bookImage))
        } catch (error) {
            console.log(error)
            return response.status(400).send(error)
        }
    }
    public async getSellerBooks({ params, response }: HttpContextContract) {
        try {
            const sellerId = params.sellerId
            const seller = await Seller.findOrFail(sellerId)

            const books = await Book.query()
                .where('sellerId', sellerId)
                .preload('images')

            const data = books.map((book) => {
                return {
                    id: book.id,
                    name: book.name,
                    category: book.categoryId,
                    author: book.author,
                    condition: book.condition,
                    price: book.price,
                    quantity: book.quantity,
                    images: book.images ? book.images.map((image) => image.path) : [],
                    created_at: book.createdAt,
                    updated_at: book.updatedAt,
                }
            })

            return response.send(Response("Get Seller's Books Successfully", { seller, books: data }))
        } catch (error) {
            console.log(error)
            return response.status(500).send(Response('Internal Server Error', error))
        }
    }
}


