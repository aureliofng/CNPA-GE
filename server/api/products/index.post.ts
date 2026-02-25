import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../db/client'
import { products } from '../../db/schema'
import { requireUser } from '../../utils/current-user'
import { recalculateIabc } from '../../utils/recalculate-iabc'

const schema = z.object({
  ean: z.string().min(8),
  plu: z.string().min(1),
  description: z.string().min(1),
  sublinea: z.string().min(1),
  sales: z.coerce.number().nonnegative().default(0)
})

export default defineEventHandler(async (event) => {
  await requireUser(event)
  const body = schema.parse(await readBody(event))
  const [existing] = await db.select().from(products).where(eq(products.ean, body.ean)).limit(1)
  if (existing) return existing
  const result = await db.insert(products).values({ ...body }).returning()
  await recalculateIabc()
  return result[0]
})
