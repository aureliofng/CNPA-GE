export const useAuth = () => {
  const user = useState<{ id: number; username: string; role: string } | null>('user', () => null)

  const load = async () => {
    try {
      user.value = await $fetch('/api/auth/me')
    } catch {
      user.value = null
    }
  }

  const login = async (username: string, password: string) => {
    user.value = await $fetch('/api/auth/login', { method: 'POST', body: { username, password } })
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/login')
  }

  return { user, load, login, logout }
}
