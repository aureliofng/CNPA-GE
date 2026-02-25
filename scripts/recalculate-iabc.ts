import { recalculateIabc } from '../server/utils/recalculate-iabc'

const count = await recalculateIabc()
console.log('IABC recalculado para', count, 'productos')
