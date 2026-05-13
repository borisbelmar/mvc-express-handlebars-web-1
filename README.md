# Products App — MVC con Express + Handlebars + Prisma

Aplicación web CRUD de productos con autenticación de usuarios, construida con el patrón MVC (Model-View-Controller), usando Express como framework HTTP, Handlebars como motor de plantillas, y Prisma 7 + PostgreSQL para persistencia.

## Stack

| Herramienta | Versión | Rol |
|-------------|---------|-----|
| Node.js | 22+ | Entorno de ejecución |
| TypeScript | 6.x | Tipado estático |
| Express | 5.x | Framework HTTP |
| express-handlebars | 9.x | Motor de plantillas |
| Prisma | 7.x | ORM para base de datos |
| PostgreSQL | 16 | Base de datos relacional |
| Zod | 4.x | Validación de esquemas |
| bcryptjs | 3.x | Hashing de contraseñas |
| express-session | 1.x | Sesiones HTTP |
| Docker | — | Contenedores |
| nodemon | 3.x | Hot reload en desarrollo |
| tsdown | 0.21.x | Bundler para producción |

## Requisitos

- Node.js 22 o superior
- Yarn clásico (`npm install -g yarn`)
- Docker y Docker Compose (para el entorno con PostgreSQL)
- Git

## Cómo levantar el proyecto

### Con Docker (recomendado)

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd express-mvc

# 2. Construir y levantar servicios (app + PostgreSQL)
docker compose up --build

# 3. Abrir http://localhost:3000
```

Usuarios de prueba: `alice@example.com` / `123456` y `bob@example.com` / `123456`.

### Sin Docker (desarrollo local)

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd express-mvc

# 2. Instalar dependencias
yarn install

# 3. Copiar variables de entorno
cp .env.example .env

# 4. Tener PostgreSQL corriendo en localhost:5432
#    y crear la base de datos products_db

# 5. Generar el cliente de Prisma y crear las tablas
npx prisma db push

# 6. Poblar la base de datos con datos de ejemplo
yarn seed

# 7. Iniciar servidor de desarrollo (hot reload)
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
| Registrarse | `/login/register` |
| Iniciar sesión | `/login` |
| Cerrar sesión | Click en "Cerrar sesión" en la navbar |
| Listar productos | `GET /products` (requiere sesión) |
| Ver detalle | Click en "Ver" en la tabla |
| Crear producto | Click en "+ Nuevo producto" |
| Editar producto | Click en "Editar" en el detalle |
| Eliminar producto | Click en "Eliminar" en el detalle |

Cada usuario solo ve y administra sus propios productos.

## Estructura del proyecto

```
express-mvc/
├── prisma/
│   ├── schema.prisma          # Modelo de datos (User, Product)
│   ├── migrations/            # Historial de migraciones
│   └── seed.ts                # Script de datos de ejemplo
├── src/
│   ├── index.ts               # Punto de entrada
│   ├── app.ts                 # Configuración Express
│   ├── controllers/
│   │   ├── product.controller.ts
│   │   └── auth.controller.ts
│   ├── models/
│   │   ├── product.model.ts
│   │   └── user.model.ts
│   ├── routes/
│   │   ├── product.routes.ts
│   │   └── auth.routes.ts
│   ├── middleware/
│   │   └── requireAuth.ts     # Protege rutas contra usuarios no autenticados
│   ├── schemas/
│   │   ├── product.schemas.ts  # Validación Zod para productos
│   │   └── auth.schemas.ts     # Validación Zod para auth
│   ├── lib/
│   │   ├── prisma.ts          # Cliente Prisma
│   │   └── parseError.ts      # Helper para errores Zod
│   ├── types/
│   │   └── session.d.ts       # Tipos extendidos de express-session
│   └── generated/prisma/      # Cliente Prisma (generado)
├── views/
│   ├── layouts/
│   │   └── main.hbs           # Layout base con Bootstrap y navbar
│   ├── products/
│   │   ├── index.hbs          # Listado
│   │   ├── show.hbs           # Detalle
│   │   ├── create.hbs         # Formulario de creación
│   │   └── edit.hbs           # Formulario de edición
│   ├── auth/
│   │   ├── login.hbs          # Inicio de sesión
│   │   └── register.hbs       # Registro de usuario
│   ├── home.hbs               # Página de inicio
│   └── 404.hbs                # Página no encontrada
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
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

---

## Fase 4 — Controller

**Commit:** `feat: agrega controller Product con 7 acciones CRUD`

**Qué hicimos:** Creamos el Controller, que recibe `req`/`res`, llama al Model, y renderiza la vista o redirige.

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

**Regla:** El Controller nunca toca el modelo directamente. Siempre delega al Model.

---

## Fase 5 — Router

**Commit:** `feat: agrega router Product y conecta en app.ts`

**Qué hicimos:** Creamos el Router que mapea las 7 URLs a sus respectivos controllers. Lo registramos en `app.ts` con `app.use('/products', productRouter)`.

**Archivo creado:** `src/routes/product.routes.ts`

**Orden crítico:** `/create` debe registrarse ANTES de `/:id`. Si están al revés, Express interpreta "create" como un valor de `id` y nunca llega al formulario.

---

## Fase 6 — Views con Bootstrap

**Commit:** `feat: agrega vistas Handlebars con Bootstrap para productos`

**Qué hicimos:** Creamos las 4 vistas de productos con Bootstrap.

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

---

## Fase 7 — Prisma 7 + SQLite

**Commit:** `feat: migra persistencia a Prisma 7 + SQLite`

**Qué hicimos:** Reemplazamos el array en memoria por SQLite usando Prisma 7. Las funciones del Model ahora son asíncronas.

**Instalación:**
```bash
yarn add @prisma/client @prisma/adapter-libsql @libsql/client dotenv
yarn add -D prisma
```

**Particularidades de Prisma 7:**
- El `generator` usa `provider = "prisma-client"` (no `prisma-client-js`)
- El `output` es obligatorio — Prisma ya no genera en `node_modules`
- La URL de BD va en `prisma.config.ts`, no en el schema
- `PrismaClient` requiere un adapter

---

## Fase 8 — Seed, build y cierre

**Commits:** `fix: corrige script start` + `feat: agrega seed con 8 productos mock`

**Qué hicimos:** Creamos un script para poblar la base de datos con datos de ejemplo. Corregimos el script `start` porque tsdown genera `dist/index.cjs`.

**Archivo creado:** `prisma/seed.ts`

```bash
yarn seed     # Poblar BD
yarn build    # Compilar a producción
yarn start    # Servir en producción
```

---

## Fase 9 — Validaciones con Zod

**Commits:** `feat: agrega validación Zod con display de errores en vistas`

**Qué hicimos:** Agregamos validación de formularios con Zod. Los datos se validan en el Controller antes de llegar al Model. Si hay errores, se renderiza la misma vista con los mensajes de error y los valores que el usuario ingresó.

**Instalación:**
```bash
yarn add zod
```

**Nuevos archivos:**
- `src/schemas/product.schemas.ts` — schema Zod para productos
- `src/lib/parseError.ts` — helper que convierte `ZodError` a `Record<string, string>`

**Archivos modificados:**
- `src/controllers/product.controller.ts` — agrega `safeParse` en `createAction` y `editAction`
- `views/products/create.hbs` — muestra errores con `is-invalid` e `invalid-feedback`
- `views/products/edit.hbs` — muestra errores con `is-invalid` e `invalid-feedback`

### Conceptos clave

**`z.coerce.number()`** — Los formularios HTML siempre envían texto. `.coerce` convierte el string a número automáticamente.

**`schema.safeParse()` vs `schema.parse()`** — En un controller de Express siempre se usa `safeParse`. Si usaras `parse` y falla, la excepción se propaga al error handler de Express en lugar de renderizar la vista con errores.

**`error.issues` en Zod v4** — En Zod v4 la propiedad se llama `issues`, no `errors`.

**`is-invalid` en Bootstrap** — La clase `invalid-feedback` es invisible a menos que el input tenga la clase `is-invalid`. Se agrega condicionalmente con `{{#if errors.name}} is-invalid{{/if}}`.

### Lo que cambió y lo que no

| Archivo | Cambio |
|---|---|
| `src/schemas/product.schemas.ts` | Nuevo |
| `src/lib/parseError.ts` | Nuevo |
| `src/controllers/product.controller.ts` | Modificado — agrega `safeParse` |
| `views/products/create.hbs` | Modificado — muestra errores |
| `views/products/edit.hbs` | Modificado — muestra errores |
| `src/models/product.model.ts` | Sin cambios |
| `src/routes/product.routes.ts` | Sin cambios |

---

## Fase 10 — Autenticación y productos por usuario

**Commits:** `WIP implementar sesiones (Unidad 3)`

**Qué hicimos:** Agregamos registro, inicio y cierre de sesión. Las contraseñas se guardan hasheadas con bcryptjs. Cada usuario ve y administra solo sus productos.

**Instalación:**
```bash
yarn add express-session bcryptjs
yarn add -D @types/express-session @types/bcryptjs
```

**Nuevos archivos:**
- `src/schemas/auth.schemas.ts` — schemas Zod para login y registro
- `src/models/user.model.ts` — `findByEmail()` y `create()`
- `src/controllers/auth.controller.ts` — login, registro, logout
- `src/routes/auth.routes.ts` — rutas de autenticación
- `src/middleware/requireAuth.ts` — protege rutas del CRUD
- `src/types/session.d.ts` — tipos para `req.session.userId`
- `views/auth/login.hbs` — formulario de inicio de sesión
- `views/auth/register.hbs` — formulario de registro

**Archivos modificados:**
- `src/app.ts` — registra session, auth routes, requireAuth en /products
- `src/controllers/product.controller.ts` — usa `req.session.userId!`
- `src/models/product.model.ts` — filtra productos por `userId`
- `views/layouts/main.hbs` — navbar con enlaces condicionales según sesión
- `prisma/schema.prisma` — agrega modelo `User` y relación con `Product`
- `prisma/seed.ts` — crea usuarios con contraseñas hasheadas

### Cómo funciona la sesión

```
1. POST /login con email + password
2. Servidor verifica credenciales con bcrypt.compare()
3. Si son correctas: req.session.userId = user.id
4. Servidor devuelve cookie connect.sid al navegador
5. En cada request siguiente, el navegador envía la cookie
6. requireAuth() verifica req.session.userId antes de cada ruta protegida
7. Logout: req.session.destroy() elimina la sesión
```

### Cómo funciona el aislamiento de datos

El `userId` **nunca viene del formulario** — siempre se lee de `req.session.userId`. El middleware `requireAuth` garantiza que existe antes de llegar al controller.

```typescript
// ❌ Nunca así — el usuario podría manipularlo
const userId = req.body.userId

// ✅ Siempre así — viene de la sesión, el usuario no puede manipularlo
const userId = req.session.userId!
```

`findFirst()` reemplaza a `findUnique()` cuando se busca por combinación de campos:
```typescript
prisma.product.findFirst({ where: { id, userId } })
// Si el producto existe pero es de otro usuario → null
```

### bcrypt y por qué no se usa en el Model

El Model tiene una sola responsabilidad: persistir datos. El hashing es lógica de negocio que pertenece al Controller:

```typescript
// Controller — hashea antes de persistir
const hash = await bcrypt.hash(password, 10)
const user = await UserModel.create({ email, password: hash })

// Model — solo persiste, no sabe qué es un hash
export const create = (data: { email: string; password: string }) =>
  prisma.user.create({ data })
```

### Lo que NO cambió

| Archivo | Estado |
|---|---|
| `src/routes/product.routes.ts` | Sin cambios |
| `views/products/*.hbs` | Sin cambios |
| `src/lib/parseError.ts` | Sin cambios |

---

## Fase 11 — Migración a PostgreSQL

**Qué hicimos:** Cambiamos la base de datos de SQLite a PostgreSQL. Solo tocamos la capa de infraestructura — la lógica de negocio, los modelos y las vistas no cambiaron.

```bash
# Remover adapter de SQLite
yarn remove @prisma/adapter-libsql @libsql/client

# Instalar adapter de PostgreSQL
yarn add @prisma/adapter-pg pg
yarn add -D @types/pg
```

**Archivos modificados:**
- `prisma/schema.prisma` — `provider = "postgresql"`
- `src/lib/prisma.ts` — usa `PrismaPg` en vez de `PrismaLibSql`
- `prisma/seed.ts` — usa `PrismaPg`
- `.env` — `DATABASE_URL` apunta a PostgreSQL
- `.env.example` — actualizado

**Cambia** | **No cambia**
---|---
`prisma/schema.prisma` | `src/models/*.ts`
`src/lib/prisma.ts` | `src/controllers/*.ts`
`.env` | `src/routes/*.ts`
`prisma/seed.ts` | `views/**/*.hbs`

Eso es exactamente el valor de usar un ORM: cambias el motor de base de datos y tu lógica de negocio no se entera.

---

## Fase 12 — Docker

**Qué hicimos:** Dockerizamos la aplicación con PostgreSQL. Creamos un Dockerfile multi-stage para mantener la imagen final pequeña, y un docker-compose.yml que orquesta app + base de datos.

**Archivos creados:**
- `Dockerfile` — build multi-stage (deps → build → runner)
- `docker-compose.yml` — define servicios `app` y `db`
- `.dockerignore` — excluye `node_modules`, `dist`, `.env`, `*.db`

### Dockerfile

Usamos tres etapas:

```
deps:    instala dependencias con yarn --frozen-lockfile
build:   compila TypeScript y genera Prisma Client
runner:  solo copia lo necesario para correr (dist, node_modules, prisma, views)
```

Las `views/` se copian explícitamente porque Handlebars las lee en runtime.

### docker-compose.yml

```yaml
services:
  db:
    image: postgres:16-alpine
    healthcheck: pg_isready -U postgres   # Espera a que Postgres esté listo
    volumes: postgres_data                # Datos persisten aunque el contenedor se reinicie

  app:
    build: .
    depends_on:
      db:
        condition: service_healthy        # App espera a que Postgres responda
    command: >
      sh -c "npx prisma db push && yarn seed && node dist/index.cjs"
```

**Comandos:**
```bash
docker compose up --build          # Construir y levantar
docker compose exec app yarn seed  # Cargar datos (primera vez)
docker compose logs app -f         # Ver logs en tiempo real
docker compose down                # Detener
docker compose down -v             # Detener y borrar la BD
```

---

## Resumen de scripts

| Script | Qué hace |
|--------|----------|
| `yarn dev` | Desarrollo con hot reload |
| `yarn build` | Compila con tsdown a `dist/index.cjs` |
| `yarn start` | Ejecuta el build compilado (producción) |
| `yarn seed` | Puebla la BD con datos mock |


