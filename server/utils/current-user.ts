import { eq } from 'drizzle-orm'
import { db } from '../db/client'
import { users } from '../db/schema'
import { parseSessionToken } from './auth'

export const requireUser = async (event: any) => {
  const token = getCookie(event, 'cnpa_session')
  const secret = useRuntimeConfig(event).sessionSecret as string
  if (!token) throw createError({ statusCode: 401, statusMessage: 'No autorizado' })
  const userId = parseSessionToken(token, secret)
  if (!userId) throw createError({ statusCode: 401, statusMessage: 'Sesión inválida' })
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Usuario no encontrado' })
  return user
}
