<script setup lang="ts">
const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  close: []
  detected: [code: string]
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const streamRef = ref<MediaStream | null>(null)
const running = ref(false)
const errorMessage = ref('')
let timer: ReturnType<typeof setInterval> | null = null

const stop = () => {
  running.value = false
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  streamRef.value?.getTracks().forEach((track) => track.stop())
  streamRef.value = null
}

const start = async () => {
  errorMessage.value = ''
  if (!('BarcodeDetector' in window)) {
    errorMessage.value = 'BarcodeDetector no disponible en este navegador.'
    return
  }

  try {
    streamRef.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false
    })

    if (videoRef.value) {
      videoRef.value.srcObject = streamRef.value
      await videoRef.value.play()
    }

    const detector = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] as any })
    running.value = true

    timer = setInterval(async () => {
      if (!videoRef.value || !running.value) return
      try {
        const barcodes = await detector.detect(videoRef.value)
        const first = barcodes[0]?.rawValue
        if (first) {
          emit('detected', first)
          emit('close')
          stop()
        }
      } catch {
        // Ignorar frames inválidos.
      }
    }, 500)
  } catch {
    errorMessage.value = 'No fue posible acceder a la cámara.'
  }
}

watch(
  () => props.open,
  async (value) => {
    if (value) await start()
    else stop()
  }
)

onBeforeUnmount(() => stop())
</script>

<template>
  <UModal :open="open" @update:open="(v) => !v && emit('close')">
    <template #content>
      <div class="p-4 space-y-3">
        <h3 class="text-lg font-semibold">Escanear código de barras</h3>
        <p class="text-sm text-gray-500">Apunta al EAN y mantén estable el teléfono.</p>

        <video ref="videoRef" class="w-full rounded-md bg-black min-h-64" playsinline muted />

        <UAlert v-if="errorMessage" color="warning" :title="errorMessage" />

        <UButton block color="neutral" @click="emit('close')">Cerrar</UButton>
      </div>
    </template>
  </UModal>
</template>
