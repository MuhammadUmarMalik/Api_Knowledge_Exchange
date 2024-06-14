import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'reviews'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('customer_id').unsigned().references('id').inTable('customers').notNullable()
      table.integer('seller_id').unsigned().references('id').inTable('sellers').nullable()
      table.integer('tutor_id').unsigned().references('id').inTable('tutors').nullable()
      table.string('rating').notNullable()
      table.string('review').notNullable()
      table.string('name').notNullable()
      table.string('email').notNullable()
      table.string('status').defaultTo('pending')


      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
