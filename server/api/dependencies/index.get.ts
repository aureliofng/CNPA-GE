import { db } from '../../db/client'
import { dependencies } from '../../db/schema'
import { requireUser } from '../../utils/current-user'

export default defineEventHandler(async (event) => {
  await requireUser(event)
  return db.select().from(dependencies)
})
