import { sql } from 'drizzle-orm'
import { integer, real, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull().$type<'Administrador' | 'Operario'>()
})

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ean: text('ean').notNull().unique(),
  plu: text('plu').notNull(),
  description: text('description').notNull(),
  sublinea: text('sublinea').notNull(),
  sales: real('sales').notNull().default(0),
  iabc: text('iabc').notNull().default('C')
})

export const dependencies = sqliteTable('dependencies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique()
})

export const gondolas = sqliteTable('gondolas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  dependencyId: integer('dependency_id').notNull().references(() => dependencies.id),
  code: text('code').notNull()
}, (table) => ({
  dependencyCodeUnique: unique('gondolas_dependency_code_unique').on(table.dependencyId, table.code)
}))

export const locations = sqliteTable('locations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull().references(() => products.id),
  dependencyId: integer('dependency_id').notNull().references(() => dependencies.id),
  gondolaId: integer('gondola_id').notNull().references(() => gondolas.id),
  body: text('body').notNull(),
  c: integer('c').notNull(),
  n: integer('n').notNull(),
  p: integer('p').notNull(),
  a: integer('a').notNull(),
  username: text('username').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})
