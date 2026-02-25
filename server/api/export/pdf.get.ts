import PDFDocument from 'pdfkit'
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

  const doc = new PDFDocument({ margin: 24 })
  const chunks: Buffer[] = []
  doc.on('data', (c) => chunks.push(c))

  doc.fontSize(18).text('Etiquetas CNPA-GE')
  doc.moveDown()

  for (const row of rows) {
    const copies = Math.max(1, Number(row.n))
    for (let i = 0; i < copies; i++) {
      doc.fontSize(10).text(`EAN: ${row.ean} | PLU: ${row.plu} | IABC: ${row.iabc}`)
      doc.text(`Descripción: ${row.description}`)
      doc.text(`Ubicación: ${row.dependency} / ${row.gondola} / ${row.body}`)
      doc.text(`CNPA: C${row.c} N${row.n} P${row.p} A${row.a}`)
      doc.moveDown(0.7)
    }
  }

  doc.end()

  const buffer = await new Promise<Buffer>((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))))
  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', 'attachment; filename="etiquetas-cnpa.pdf"')
  return buffer
})
