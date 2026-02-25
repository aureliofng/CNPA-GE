# CNPA-GE

Aplicación **mobile-first** para gestión de ubicaciones CNPA en supermercados (dependencias → góndolas → cuerpos), con escaneo EAN por cámara, clasificación IABC, exportación Excel/PDF y modo instalable PWA.

## Stack

- Nuxt 4 + TypeScript
- Nuxt UI
- SQLite (`bun:sqlite`)
- Drizzle ORM
- PWA (`@vite-pwa/nuxt`)
- Runtime objetivo: **Bun**

## Nota sobre archivos binarios

Este proyecto evita binarios para cumplir políticas de repositorio estrictas. Por eso los íconos PWA se publican como archivos **SVG de texto** (`public/icon.svg`, `public/icon-maskable.svg`) en lugar de PNG.

## Instalación

```bash
bun install
```

## Desarrollo

```bash
bun dev
```

La base de datos se crea automáticamente en `data/cnpa-ge.sqlite`.

## Seed de datos

```bash
bun run db:seed
```

Usuarios iniciales:
- `admin` / `admin123` (Administrador)
- `operario` / `operario123` (Operario)

## Recalcular IABC

```bash
bun run recalc:iabc
```

Reglas aplicadas por porcentaje acumulado de ventas:
- I: 0% - 60%
- A: 60% - 85%
- B: 85% - 95%
- C: 95% - 100%

> Nota: además del script manual, el backend recalcula IABC automáticamente cuando se crea/actualiza producto por los endpoints operativos.

## API

- `POST /api/products`
- `GET /api/products/:ean`
- `POST /api/locations`
- `POST /api/dependencies` (Administrador)
- `POST /api/gondolas` (Administrador)
- `GET /api/export/excel`
- `GET /api/export/pdf`

## Uso desde móvil

1. Conecta el móvil y servidor a la misma red.
2. Ejecuta `bun dev --host` si necesitas exponer red local.
3. Abre la URL en Chrome Android.
4. Instala la app usando “Agregar a pantalla de inicio”.
5. Inicia sesión y usa el botón grande “Escanear código” o ingresa EAN manualmente.

## Exportación

Desde la pantalla principal usa los botones:
- **Excel**: descarga `.xlsx`
- **PDF**: descarga `.pdf`

Ambos incluyen: EAN, PLU, descripción, ubicación, CNPA e IABC.
