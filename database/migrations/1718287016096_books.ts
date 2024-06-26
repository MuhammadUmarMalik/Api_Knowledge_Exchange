import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'books'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('category_id')
        .unsigned()
        .references('categories.id')
        .onDelete('CASCADE')
      table
        .integer('seller_id')
        .unsigned()
        .references('sellers.id')
        .onDelete('CASCADE')
      table.string('name', 255).notNullable()
      table.string('author').notNullable()
      table.decimal('price').notNullable()
      table.integer('quantity').notNullable()
      table.string('condition').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
