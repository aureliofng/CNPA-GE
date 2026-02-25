<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const { user, logout } = useAuth()
const toast = useToast()

const ean = ref('')
const product = ref<any>(null)
const dependencies = ref<any[]>([])
const gondolas = ref<any[]>([])
const scannerOpen = ref(false)
const dependencyForm = reactive({ name: '' })
const gondolaForm = reactive({ dependencyId: undefined as number | undefined, code: '' })
const form = reactive({
  plu: '',
  description: '',
  sublinea: '',
  sales: 0,
  iabc: 'C',
  dependencyId: undefined as number | undefined,
  gondolaId: undefined as number | undefined,
  body: '',
  c: 1,
  n: 1,
  p: 1,
  a: 1,
  username: ''
})

onMounted(async () => {
  dependencies.value = await $fetch('/api/dependencies')
  form.username = user.value?.username || ''
})

watch(() => form.dependencyId, async (id) => {
  if (!id) return
  gondolas.value = await $fetch(`/api/gondolas?dependencyId=${id}`)
})

const findProduct = async () => {
  if (!ean.value) return
  try {
    product.value = await $fetch(`/api/products/${ean.value}`)
    Object.assign(form, {
      plu: product.value.plu,
      description: product.value.description,
      sublinea: product.value.sublinea,
      sales: product.value.sales,
      iabc: product.value.iabc || 'C'
    })
  } catch {
    product.value = null
    form.plu = ''
    form.description = ''
    form.sublinea = ''
    form.sales = 0
    form.iabc = 'C'
    toast.add({ title: 'Producto no existe, crea uno nuevo', color: 'warning' })
  }
}

const detectBarcode = async () => {
  scannerOpen.value = true
}

const onBarcodeDetected = async (code: string) => {
  ean.value = code
  toast.add({ title: `Código detectado: ${code}`, color: 'success' })
  await findProduct()
}

const saveLocation = async () => {
  try {
    await $fetch('/api/locations', {
      method: 'POST',
      body: {
        ean: ean.value,
        plu: form.plu,
        description: form.description,
        sublinea: form.sublinea,
        sales: Number(form.sales),
        iabc: form.iabc,
        dependencyId: form.dependencyId,
        gondolaId: form.gondolaId,
        body: form.body,
        c: Number(form.c),
        n: Number(form.n),
        p: Number(form.p),
        a: Number(form.a),
        username: form.username
      }
    })
    toast.add({ title: 'Ubicación guardada', color: 'success' })
  } catch (error: any) {
    toast.add({ title: error?.data?.statusMessage || 'Error guardando', color: 'error' })
  }
}

const createDependency = async () => {
  if (!dependencyForm.name) return
  await $fetch('/api/dependencies', { method: 'POST', body: dependencyForm })
  dependencies.value = await $fetch('/api/dependencies')
  dependencyForm.name = ''
  toast.add({ title: 'Dependencia creada', color: 'success' })
}

const createGondola = async () => {
  if (!gondolaForm.dependencyId || !gondolaForm.code) return
  await $fetch('/api/gondolas', { method: 'POST', body: gondolaForm })
  if (form.dependencyId === gondolaForm.dependencyId) {
    gondolas.value = await $fetch(`/api/gondolas?dependencyId=${gondolaForm.dependencyId}`)
  }
  gondolaForm.code = ''
  toast.add({ title: 'Góndola creada', color: 'success' })
}
</script>

<template>
  <div class="p-4 space-y-4 max-w-2xl mx-auto">
    <BarcodeScannerModal
      :open="scannerOpen"
      @close="scannerOpen = false"
      @detected="onBarcodeDetected"
    />

    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">CNPA-GE</h1>
      <div class="flex gap-2">
        <UButton to="/api/export/excel" external>Excel</UButton>
        <UButton to="/api/export/pdf" external color="neutral">PDF</UButton>
        <UButton @click="logout" color="error">Salir</UButton>
      </div>
    </div>

    <UCard>
      <div class="space-y-3">
        <UFormField label="EAN">
          <div class="flex gap-2">
            <UInput v-model="ean" size="xl" class="flex-1" placeholder="Escanea o ingresa EAN" />
            <UButton size="xl" @click="findProduct">Buscar</UButton>
          </div>
        </UFormField>
        <UButton block size="xl" icon="i-lucide-scan-line" @click="detectBarcode">Escanear código</UButton>
      </div>
    </UCard>

    <UCard>
      <UForm :state="form" @submit="saveLocation" class="grid grid-cols-1 gap-3">
        <UFormField label="PLU"><UInput v-model="form.plu" size="xl" /></UFormField>
        <UFormField label="Descripción"><UInput v-model="form.description" size="xl" /></UFormField>
        <UFormField label="Sublinea"><UInput v-model="form.sublinea" size="xl" /></UFormField>
        <UFormField label="Ventas acumuladas"><UInput v-model="form.sales" type="number" size="xl" /></UFormField>
        <UFormField label="IABC">
          <USelectMenu v-model="form.iabc" :items="['I', 'A', 'B', 'C']" />
        </UFormField>
        <UFormField label="Dependencia">
          <USelectMenu v-model="form.dependencyId" :items="dependencies.map(d => ({ label: d.name, value: d.id }))" />
        </UFormField>
        <UFormField label="Góndola">
          <USelectMenu v-model="form.gondolaId" :items="gondolas.map(g => ({ label: g.code, value: g.id }))" />
        </UFormField>
        <UFormField label="Cuerpo"><UInput v-model="form.body" size="xl" /></UFormField>

        <div class="grid grid-cols-4 gap-2">
          <UFormField label="C"><UInput v-model="form.c" type="number" /></UFormField>
          <UFormField label="N"><UInput v-model="form.n" type="number" /></UFormField>
          <UFormField label="P"><UInput v-model="form.p" type="number" /></UFormField>
          <UFormField label="A"><UInput v-model="form.a" type="number" /></UFormField>
        </div>

        <UFormField label="Usuario"><UInput v-model="form.username" size="xl" /></UFormField>
        <UButton type="submit" block size="xl" color="primary">Guardar ubicación</UButton>
      </UForm>
    </UCard>

    <UCard v-if="user?.role === 'Administrador'">
      <template #header>
        <h2 class="font-semibold">Configuración de estructura</h2>
      </template>
      <div class="space-y-4">
        <div class="flex gap-2">
          <UInput v-model="dependencyForm.name" class="flex-1" placeholder="Nueva dependencia" />
          <UButton @click="createDependency">Crear</UButton>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <USelectMenu v-model="gondolaForm.dependencyId" :items="dependencies.map(d => ({ label: d.name, value: d.id }))" />
          <UInput v-model="gondolaForm.code" placeholder="Código góndola" />
          <UButton @click="createGondola">Crear góndola</UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
