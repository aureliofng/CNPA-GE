import { requireUser } from './current-user'

export const requireAdmin = async (event: any) => {
  const user = await requireUser(event)
  if (user.role !== 'Administrador') {
    throw createError({ statusCode: 403, statusMessage: 'Permisos insuficientes' })
  }
  return user
}
