export default defineEventHandler(async (event) => {
  deleteCookie(event, 'cnpa_session', { path: '/' })
  return { ok: true }
})
