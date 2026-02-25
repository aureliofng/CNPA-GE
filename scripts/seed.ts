import { db } from '../server/db/client'
import { dependencies, gondolas, products, users } from '../server/db/schema'
import { hashPassword } from '../server/utils/auth'

await db.insert(users).values([
  { username: 'admin', password: hashPassword('admin123'), role: 'Administrador' },
  { username: 'operario', password: hashPassword('operario123'), role: 'Operario' }
]).onConflictDoNothing()

const [dep] = await db.insert(dependencies).values({ name: '45 - ÉXITO APARTADÓ' }).onConflictDoNothing().returning()

const dependencyId = dep?.id ?? (await db.select().from(dependencies))[0]?.id

if (dependencyId) {
  await db.insert(gondolas).values([
    { dependencyId, code: 'A' },
    { dependencyId, code: 'B' },
    { dependencyId, code: 'C' }
  ]).onConflictDoNothing()
}

await db.insert(products).values([
  { ean: '7701234567890', plu: '1001', description: 'Arroz 500g', sublinea: 'Granos', sales: 1200, iabc: 'I' },
  { ean: '7700987654321', plu: '1002', description: 'Aceite 1L', sublinea: 'Aceites', sales: 800, iabc: 'A' }
]).onConflictDoNothing()

console.log('Seed completado')
