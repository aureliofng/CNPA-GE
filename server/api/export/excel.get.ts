import ExcelJS from 'exceljs'
import { desc, eq } from 'drizzle-orm'
import { db } from '../../db/client'
import { dependencies, gondolas, locations, products } from '../../db/schema'
import { requireUser } from '../../utils/current-user'

export default defineEventHandler(async (event) => {
  await requireUser(event)

  const rows = await db
    .select({
      ean: products.ean,
      plu: products.plu,
      description: products.description,
      iabc: products.iabc,
      dependency: dependencies.name,
      gondola: gondolas.code,
      body: locations.body,
      c: locations.c,
      n: locations.n,
      p: locations.p,
      a: locations.a
    })
    .from(locations)
    .innerJoin(products, eq(products.id, locations.productId))
    .innerJoin(dependencies, eq(dependencies.id, locations.dependencyId))
    .innerJoin(gondolas, eq(gondolas.id, locations.gondolaId))
    .orderBy(desc(locations.id))

  const workbook = new ExcelJS.Workbook()
  const ws = workbook.addWorksheet('Etiquetas')
  ws.columns = [
    { header: 'EAN', key: 'ean', width: 18 },
    { header: 'PLU', key: 'plu', width: 12 },
    { header: 'Descripción', key: 'description', width: 35 },
    { header: 'Ubicación', key: 'ubicacion', width: 30 },
    { header: 'CNPA', key: 'cnpa', width: 15 },
    { header: 'IABC', key: 'iabc', width: 8 }
  ]

  for (const row of rows) {
    const copies = Math.max(1, Number(row.n))
    for (let i = 0; i < copies; i++) {
      ws.addRow({
        ean: row.ean,
        plu: row.plu,
        description: row.description,
        ubicacion: `${row.dependency} / ${row.gondola} / ${row.body}`,
        cnpa: `C${row.c} N${row.n} P${row.p} A${row.a}`,
        iabc: row.iabc
      })
    }
  }

  const buffer = await workbook.xlsx.writeBuffer()
  setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  setHeader(event, 'Content-Disposition', 'attachment; filename="etiquetas-cnpa.xlsx"')
  return buffer
})
