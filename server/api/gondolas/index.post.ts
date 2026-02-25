import { z } from 'zod'
import { db } from '../../db/client'
import { gondolas } from '../../db/schema'
import { requireAdmin } from '../../utils/require-admin'

const schema = z.object({
  dependencyId: z.coerce.number().int().positive(),
  code: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = schema.parse(await readBody(event))
  const [row] = await db.insert(gondolas).values(body).onConflictDoNothing().returning()

  if (row) return row
  const existing = await db.select().from(gondolas)
  const match = existing.find((item) => item.dependencyId === body.dependencyId && item.code === body.code)
  if (!match) throw createError({ statusCode: 500, statusMessage: 'No fue posible crear góndola' })
  return match
})
