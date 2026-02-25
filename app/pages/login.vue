<script setup lang="ts">
const { login } = useAuth()
const toast = useToast()
const form = reactive({ username: '', password: '' })

const submit = async () => {
  try {
    await login(form.username, form.password)
    await navigateTo('/')
  } catch {
    toast.add({ title: 'Credenciales inválidas', color: 'error' })
  }
}
</script>

<template>
  <div class="min-h-screen p-4 flex items-center">
    <UCard class="w-full max-w-md mx-auto">
      <template #header>
        <h1 class="text-xl font-bold">CNPA-GE</h1>
      </template>
      <UForm :state="form" @submit="submit" class="space-y-4">
        <UFormField label="Usuario" name="username">
          <UInput v-model="form.username" size="xl" />
        </UFormField>
        <UFormField label="Contraseña" name="password">
          <UInput v-model="form.password" type="password" size="xl" />
        </UFormField>
        <UButton type="submit" block size="xl">Ingresar</UButton>
      </UForm>
    </UCard>
  </div>
</template>
