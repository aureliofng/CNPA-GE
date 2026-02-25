import { eq } from 'drizzle-orm'
import { db } from '../../db/client'
import { gondolas } from '../../db/schema'
import { requireUser } from '../../utils/current-user'

export default defineEventHandler(async (event) => {
  await requireUser(event)
  const dependencyId = Number(getQuery(event).dependencyId)
  if (!dependencyId) return []
  return db.select().from(gondolas).where(eq(gondolas.dependencyId, dependencyId))
})
