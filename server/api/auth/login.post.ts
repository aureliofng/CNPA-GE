import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../db/client'
import { users } from '../../db/schema'
import { createSessionToken, hashPassword } from '../../utils/auth'

const bodySchema = z.object({ username: z.string().min(1), password: z.string().min(1) })

export default defineEventHandler(async (event) => {
  const body = bodySchema.parse(await readBody(event))
  const [user] = await db.select().from(users).where(eq(users.username, body.username)).limit(1)
  if (!user || user.password !== hashPassword(body.password)) {
    throw createError({ statusCode: 401, statusMessage: 'Credenciales inválidas' })
  }

  const secret = useRuntimeConfig(event).sessionSecret as string
  const token = createSessionToken(user.id, secret)
  setCookie(event, 'cnpa_session', token, { httpOnly: true, sameSite: 'lax', path: '/' })

  return { id: user.id, username: user.username, role: user.role }
})
