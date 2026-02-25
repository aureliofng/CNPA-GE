import { requireUser } from '../../utils/current-user'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  return { id: user.id, username: user.username, role: user.role }
})
