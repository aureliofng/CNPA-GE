import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../db/client'
import { locations, products } from '../../db/schema'
import { requireUser } from '../../utils/current-user'

const schema = z.object({
  ean: z.string().min(8),
  plu: z.string().min(1),
  description: z.string().min(1),
  sublinea: z.string().min(1),
  sales: z.coerce.number().nonnegative(),
  iabc: z.enum(['I', 'A', 'B', 'C']).default('C'),
  dependencyId: z.coerce.number().int().positive(),
  gondolaId: z.coerce.number().int().positive(),
  body: z.string().min(1),
  c: z.coerce.number().int().positive(),
  n: z.coerce.number().int().positive(),
  p: z.coerce.number().int().positive(),
  a: z.coerce.number().int().positive(),
  username: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  await requireUser(event)
  const body = schema.parse(await readBody(event))
  let [product] = await db.select().from(products).where(eq(products.ean, body.ean)).limit(1)

  if (!product) {
    ;[product] = await db.insert(products).values({
      ean: body.ean,
      plu: body.plu,
      description: body.description,
      sublinea: body.sublinea,
      sales: body.sales,
      iabc: body.iabc
    }).returning()
  } else {
    ;[product] = await db
      .update(products)
      .set({
        plu: body.plu,
        description: body.description,
        sublinea: body.sublinea,
        sales: body.sales,
        iabc: body.iabc
      })
      .where(eq(products.id, product.id))
      .returning()
  }

  const [location] = await db.insert(locations).values({
    productId: product.id,
    dependencyId: body.dependencyId,
    gondolaId: body.gondolaId,
    body: body.body,
    c: body.c,
    n: body.n,
    p: body.p,
    a: body.a,
    username: body.username
  }).returning()

  return location
})
