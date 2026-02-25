import { eq } from 'drizzle-orm'
import { db } from '../../db/client'
import { products } from '../../db/schema'
import { requireUser } from '../../utils/current-user'

export default defineEventHandler(async (event) => {
  await requireUser(event)
  const ean = getRouterParam(event, 'ean')
  if (!ean) throw createError({ statusCode: 400, statusMessage: 'EAN requerido' })
  const [product] = await db.select().from(products).where(eq(products.ean, ean)).limit(1)
  if (!product) throw createError({ statusCode: 404, statusMessage: 'Producto no encontrado' })
  return product
})
