# Products App — MVC con Express + Handlebars + Prisma

Aplicación web CRUD de productos construida con el patrón MVC (Model-View-Controller), usando Express como framework HTTP, Handlebars como motor de plantillas, y Prisma 7 + SQLite para persistencia.

## Stack

| Herramienta | Versión | Rol |
|-------------|---------|-----|
| Node.js | 22+ | Entorno de ejecución |
| TypeScript | 6.x | Tipado estático |
| Express | 5.x | Framework HTTP |
| express-handlebars | 9.x | Motor de plantillas |
| Prisma | 7.x | ORM para base de datos |
| SQLite | — | Base de datos embebida |
| nodemon | 3.x | Hot reload en desarrollo |
| tsdown | 0.21.x | Bundler para producción |

## Requisitos

- Node.js 22 o superior
- Yarn clásico (`npm install -g yarn`)
- Git

## Cómo levantar el proyecto

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd express-mvc

# 2. Instalar dependencias
yarn install

# 3. Copiar variables de entorno
cp .env.example .env

# 4. Generar el cliente de Prisma y crear la BD
npx prisma migrate dev --name init

# 5. Poblar la base de datos con datos de ejemplo
yarn seed

# 6. Iniciar servidor de desarrollo (hot reload)
yarn dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Comandos

```bash
yarn dev      # Desarrollo con hot reload (nodemon)
yarn build    # Compilar para producción (tsdown)
yarn start    # Ejecutar build de producción
yarn seed     # Poblar BD con datos mock
```

## Uso

| Acción | Cómo |
|--------|------|
| Listar productos | `GET /products` |
| Ver detalle | Click en "Ver" en la tabla |
| Crear producto | Click en "+ Nuevo producto" |
| Editar producto | Click en "Editar" en el detalle |
| Eliminar producto | Click en "Eliminar" en el detalle |

## Estructura del proyecto

```
express-mvc/
├── prisma/
│   ├── schema.prisma          # Modelo de datos
│   ├── migrations/            # Historial de migraciones
│   └── seed.ts                # Script de datos de ejemplo
├── src/
│   ├── index.ts               # Punto de entrada
│   ├── app.ts                 # Configuración Express
│   ├── controllers/
│   │   └── product.controller.ts
│   ├── models/
│   │   └── product.model.ts
│   ├── routes/
│   │   └── product.routes.ts
│   ├── lib/
│   │   └── prisma.ts          # Cliente Prisma
│   └── generated/prisma/      # Cliente Prisma (generado)
├── views/
│   ├── layouts/
│   │   └── main.hbs           # Layout base con Bootstrap
│   ├── products/
│   │   ├── index.hbs          # Listado
│   │   ├── show.hbs           # Detalle
│   │   ├── create.hbs         # Formulario de creación
│   │   └── edit.hbs           # Formulario de edición
│   ├── home.hbs               # Página de inicio
│   └── 404.hbs                # Página no encontrada
├── package.json
├── tsconfig.json
├── tsdown.config.ts
├── nodemon.json
├── prisma.config.ts
└── .env
```

---

# Guía de construcción por fases

> Esta guía muestra cómo se construyó el proyecto paso a paso, usando los commits como fases. Cada fase introduce un concepto nuevo y culmina con código funcionando. Ideal para seguir en un video o tutorial.

---

## Fase 1 — Setup del proyecto

**Commit:** `chore: inicializa proyecto Express + Handlebars + Bootstrap`

**Qué hicimos:** Creamos la estructura de carpetas y archivos de configuración. Instalamos todas las dependencias necesarias: Express para el servidor, Handlebars para las vistas, TypeScript para tipos, nodemon para hot reload, y tsdown para el build de producción.

**Archivos creados:**
- `package.json` — define dependencias y scripts (`dev`, `build`, `start`)
- `tsconfig.json` — configura TypeScript con `strict`, `ES2020`, `commonjs`
- `tsdown.config.ts` — bundler que compila a CommonJS en `dist/`
- `nodemon.json` — vigila cambios en `src/` y reinicia el servidor
- `.gitignore` — excluye `node_modules/`, `dist/`, `.env`, `*.db`

**Dependencias instaladas:**
```bash
yarn add express express-handlebars
yarn add -D typescript nodemon ts-node @types/node @types/express @types/express-handlebars tsdown
```

**Para probar:**
```bash
yarn dev
```
Ver `Server running at http://localhost:3000`.

---

## Fase 2 — Servidor mínimo

**Commit:** Mismo commit inicial (incluido en el setup)

**Qué hicimos:** Configuramos Express con Handlebars como motor de plantillas, creamos el layout principal con Bootstrap 5, la página de inicio y la página de error 404.

**Archivos creados:**
- `src/index.ts` — punto de entrada, `app.listen(3000)`
- `src/app.ts` — configura Handlebars, `express.urlencoded()`, ruta raíz `/`
- `views/layouts/main.hbs` — layout con navbar Bootstrap y `{{{body}}}`
- `views/home.hbs` — página de bienvenida con Bootstrap
- `views/404.hbs` — página de error

**Conceptos clave:**
- `{{{body}}}` con tres llaves: Handlebars lo reemplaza con el contenido de cada vista sin escapar HTML
- `express.urlencoded()` debe ir ANTES de las rutas, o `req.body` llega `undefined`
- Bootstrap se carga vía CDN en el `<head>` del layout

**Para probar:**
```bash
yarn dev
# Abrir http://localhost:3000
```

---

## Fase 3 — Model con datos en memoria

**Commit:** `feat: agrega model Product con CRUD en memoria`

**Qué hicimos:** Creamos la capa Model con una interfaz `Product`, un array en memoria con 3 productos de ejemplo, y las 5 funciones CRUD. El Model no importa nada de Express — no sabe que existe HTTP.

**Archivo creado:** `src/models/product.model.ts`

```typescript
export interface Product {
  id: number
  name: string
  price: number
  description: string
}
```

**Funciones:**
| Función | Retorno | Descripción |
|---------|---------|-------------|
| `getAll()` | `Product[]` | Retorna todos los productos |
| `getById(id)` | `Product \| undefined` | Busca por id |
| `create(data)` | `Product` | Crea con id autoasignado |
| `update(id, data)` | `Product \| undefined` | Actualiza si existe |
| `remove(id)` | `boolean` | Elimina si existe |

**Conceptos TypeScript:**
- `Product | undefined`: el valor puede existir o no
- `Omit<Product, 'id'>`: TypeScript obliga a no pasar el id al crear
- `boolean`: indica éxito o fracaso de la operación

---

## Fase 4 — Controller

**Commit:** `feat: agrega controller Product con 7 acciones CRUD`

**Qué hicimos:** Creamos el Controller, que recibe `req`/`res`, llama al Model, y renderiza la vista o redirige. Cada función sigue el mismo patrón: extraer datos de `req`, convertir tipos, llamar al Model, manejar error 404 si no existe.

**Archivo creado:** `src/controllers/product.controller.ts`

**Acciones:**
| Controller | Método | Ruta | Qué hace |
|------------|--------|------|----------|
| `index` | GET | /products | Lista todos |
| `show` | GET | /products/:id | Detalle |
| `createForm` | GET | /products/create | Formulario vacío |
| `createAction` | POST | /products | Procesa creación |
| `editForm` | GET | /products/:id/edit | Formulario precargado |
| `editAction` | POST | /products/:id/edit | Procesa edición |
| `deleteAction` | POST | /products/:id/delete | Elimina |

**Regla:** El Controller nunca toca el array directamente. Siempre delega al Model.

**Detalle Express 5:** `req.params.id` es `string | string[]` en los tipos de Express 5. Usamos `req.params.id as string` para pasarlo a `parseInt()`.

---

## Fase 5 — Router

**Commit:** `feat: agrega router Product y conecta en app.ts`

**Qué hicimos:** Creamos el Router que mapea las 7 URLs a sus respectivos controllers. Lo registramos en `app.ts` con `app.use('/products', productRouter)`.

**Archivo creado:** `src/routes/product.routes.ts`

**Orden crítico:** `/create` debe registrarse ANTES de `/:id`. Si están al revés, Express interpreta "create" como un valor de `id` y nunca llega al formulario.

```typescript
router.get('/', ProductController.index)
router.get('/create', ProductController.createForm)  // ✅ antes que /:id
router.get('/:id', ProductController.show)
router.post('/', ProductController.createAction)
router.get('/:id/edit', ProductController.editForm)
router.post('/:id/edit', ProductController.editAction)
router.post('/:id/delete', ProductController.deleteAction)
```

**Concepto clave:** El Router solo mapea URLs. No tiene lógica de negocios. Si mañana agregamos usuarios, creamos un `user.routes.ts` separado.

---

## Fase 6 — Views con Bootstrap

**Commit:** `feat: agrega vistas Handlebars con Bootstrap para productos`

**Qué hicimos:** Creamos las 4 vistas de productos con Bootstrap, usando `{{#each}}` para listar, `{{#if}}` para estado vacío, y `value="{{...}}"` para precargar datos en los formularios.

**Archivos creados:**
- `views/products/index.hbs` — tabla con Bootstrap
- `views/products/show.hbs` — card con detalles y botones
- `views/products/create.hbs` — formulario de creación
- `views/products/edit.hbs` — formulario de edición con datos precargados

**Sintaxis Handlebars:**
| Sintaxis | Qué hace |
|----------|----------|
| `{{variable}}` | Muestra el valor escapando HTML |
| `{{{body}}}` | Muestra sin escapar (para HTML del layout) |
| `{{#each lista}}` | Itera sobre un array |
| `{{#if condicion}}` | Condicional |
| `{{else}}` | Rama alternativa del `#if` |

**Flujo datos:** Controller → `res.render('products/index', { products })` → Handlebars recibe `products` → genera HTML con `{{#each products}}` → Express envía la respuesta al navegador.

---

## Fase 7 — Prisma 7 + SQLite

**Commit:** `feat: migra persistencia a Prisma 7 + SQLite`

**Qué hicimos:** Reemplazamos el array en memoria por una base de datos SQLite usando Prisma 7. Las funciones del Model ahora son asíncronas y usan `prisma.product.findMany()`, `findUnique()`, `create()`, `update()`, `delete()`. El Controller agrega `async/await` y `try/catch` para manejar errores de Prisma.

**Instalación:**
```bash
yarn add @prisma/client @prisma/adapter-libsql @libsql/client dotenv
yarn add -D prisma
npx prisma init --datasource-provider sqlite
```

**Nuevos archivos:**
- `prisma/schema.prisma` — define el modelo `Product`
- `prisma.config.ts` — configuración de Prisma 7
- `.env` — contiene `DATABASE_URL`
- `src/lib/prisma.ts` — instancia única de `PrismaClient`

**Migración:**
```bash
npx prisma migrate dev --name init
```

**Cliente generado en:** `src/generated/prisma/`

**Particularidades de Prisma 7:**
- El `generator` usa `provider = "prisma-client"` (no `prisma-client-js`)
- El `output` es obligatorio — Prisma ya no genera en `node_modules`
- La URL de BD va en `prisma.config.ts`, no en el schema
- `PrismaClient` requiere un adapter (libSQL para SQLite)

**Lo que NO cambió:** Router, Views, `app.ts` — todo intacto. Eso es el valor de MVC.

---

## Fase 8 — Seed, build y cierre

**Commits:** `fix: corrige script start` + `feat: agrega seed con 8 productos mock`

**Qué hicimos:** Creamos un script para poblar la base de datos con datos de ejemplo. Corregimos el script `start` porque tsdown genera `dist/index.cjs`, no `dist/index.js`. Arreglamos el `tsconfig.json` para excluir archivos fuera de `rootDir`.

**Archivo creado:** `prisma/seed.ts`

```typescript
// Inserta 8 productos mock usando createMany
await prisma.product.createMany({ data: products })
```

**Comandos finales:**
```bash
yarn seed     # Poblar BD
yarn build    # Compilar a producción
yarn start    # Servir en producción
```

**Resumen de scripts:**
| Script | Qué hace |
|--------|----------|
| `yarn dev` | Desarrollo con hot reload |
| `yarn build` | Compila con tsdown a `dist/index.cjs` |
| `yarn start` | Ejecuta el build compilado (producción) |
| `yarn seed` | Puebla la BD con 8 productos mock |

---

## Historial de commits

```
0d9c2cf feat: agrega seed con 8 productos mock
d4dc1bd fix: corrige script start a dist/index.cjs
f9bad15 feat: migra persistencia a Prisma 7 + SQLite
91dd9bf feat: agrega vistas Handlebars con Bootstrap para productos
0b55b77 feat: agrega router Product y conecta en app.ts
43a3644 feat: agrega controller Product con 7 acciones CRUD
a7b7215 feat: agrega model Product con CRUD en memoria
7c466ae chore: inicializa proyecto Express + Handlebars + Bootstrap
```

Cada commit representa una fase completa y funcionando. Se pueden revisar individualmente con `git checkout <hash>` para ver el proyecto en ese punto específico.
