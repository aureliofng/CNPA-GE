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

> Importante: ejecuta siempre con **Bun**. Si lo corres con Node/NPM puede aparecer el error: `"bun:sqlite" ... could not be resolved`.

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

IABC es un campo **informativo/manual**. El comando existe para mantener compatibilidad operativa y solo muestra recordatorio; no recalcula valores.

Si quieres cambiar IABC, debes enviarlo explícitamente (`I`, `A`, `B`, `C`) desde la UI o payload API.

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

## Solución al error `bun:sqlite could not be resolved`

Ese mensaje aparece cuando el proyecto se intenta ejecutar con runtime distinto a Bun.

- Correcto: `bun install`, `bun dev`, `bun run db:seed`, `bun run recalc:iabc`
- Incorrecto: `npm run dev`, `pnpm dev`, `node ...`

El backend valida esto y mostrará un error explícito si detecta que no está corriendo en Bun.
