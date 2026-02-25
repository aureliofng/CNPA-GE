export default defineNuxtRouteMiddleware(async (to) => {
  const { user, load } = useAuth()
  if (!user.value) await load()
  if (!user.value && to.path !== '/login') return navigateTo('/login')
})
