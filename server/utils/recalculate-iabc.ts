import { desc, eq } from 'drizzle-orm'
import { db } from '../db/client'
import { products } from '../db/schema'

export const recalculateIabc = async () => {
  const allProducts = await db.select().from(products).orderBy(desc(products.sales))
  const totalSales = allProducts.reduce((sum, p) => sum + Number(p.sales), 0)

  let cumulative = 0
  for (const product of allProducts) {
    cumulative += Number(product.sales)
    const ratio = totalSales === 0 ? 0 : (cumulative / totalSales) * 100

    let iabc: 'I' | 'A' | 'B' | 'C' = 'C'
    if (ratio <= 60) iabc = 'I'
    else if (ratio <= 85) iabc = 'A'
    else if (ratio <= 95) iabc = 'B'

    await db.update(products).set({ iabc }).where(eq(products.id, product.id))
  }

  return allProducts.length
}
