import { z } from 'zod'
import { db } from '../../db/client'
import { dependencies } from '../../db/schema'
import { requireAdmin } from '../../utils/require-admin'

const schema = z.object({ name: z.string().min(3) })

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = schema.parse(await readBody(event))
  const [row] = await db.insert(dependencies).values({ name: body.name }).onConflictDoNothing().returning()

  if (row) return row
  const existing = await db.select().from(dependencies)
  const match = existing.find((item) => item.name === body.name)
  if (!match) throw createError({ statusCode: 500, statusMessage: 'No fue posible crear dependencia' })
  return match
})
