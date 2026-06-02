# Portfolio Monorepo

Monorepo con **Frontend (Angular 19)** y **Backend (NestJS + PostgreSQL)**, ambos estructurados bajo **Arquitectura Hexagonal con Vertical Slicing**.

---

## Arquitectura

### Principio general

Cada aplicación organiza su código en tres capas hexagonales (`application`, `domain`, `infrastructure`) distribuidas en slices verticales (`public`, `private`) según el nivel de acceso requerido.

```
src/
├── environments/       # Variables de entorno tipadas
├── public/             # Slice sin autenticación (landing, auth)
│   ├── application/    # Casos de uso / vistas / routing
│   ├── domain/         # Entidades, interfaces, reglas de negocio
│   └── infrastructure/ # Controladores, repos, adapters, servicios externos
├── private/            # Slice protegido (requiere auth)
│   ├── application/
│   ├── domain/
│   └── infrastructure/
└── shared/             # Código transversal (guards, pipes, utils)
```

---

### Frontend — Angular 19

> Hexagonal orientado a UI: las capas son presentacionales, no de negocio complejo.

```
frontend/src/
├── environments/
├── public/
│   ├── application/
│   │   ├── landing/        # Vistas y componentes de la landing page
│   │   ├── login-signup/   # Vistas de autenticación
│   │   └── public.routes.ts
│   ├── domain/
│   │   ├── models/         # Interfaces TypeScript del modelo (solo tipos)
│   │   └── types/
│   └── infrastructure/
│       ├── adapters/       # Adaptadores para APIs externas
│       ├── http/           # Configuración del cliente HTTP (HttpClient)
│       ├── services/       # Servicios de llamada a API
│       └── state/          # Gestión de estado (NgRx / signals)
├── private/
│   ├── application/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   └── private.routes.ts
│   ├── domain/
│   │   ├── models/
│   │   └── types/
│   └── infrastructure/
│       ├── adapters/
│       ├── http/
│       ├── services/
│       └── state/
└── shared/
    ├── components/
    ├── directives/
    └── pipes/
```

---

### Backend — NestJS + PostgreSQL

> Hexagonal tradicional (Ports & Adapters): desacoplamiento total entre dominio e infraestructura.

```
backend/src/
├── environments/
├── application/
│   ├── dtos/           # DTOs de entrada con validación (class-validator)
│   ├── ports/
│   │   ├── input/      # Interfaces de casos de uso (command/query handlers)
│   │   └── output/     # Interfaces de repositorios y servicios externos
│   └── use-cases/      # Implementación de casos de uso
├── domain/
│   ├── exceptions/     # Excepciones de dominio
│   ├── models/         # Entidades de dominio puras (sin ORM)
│   ├── repositories/   # Interfaces (puertos) de repositorios
│   ├── services/       # Servicios de dominio
│   └── value-objects/  # Value objects inmutables
├── infrastructure/
│   ├── adapters/
│   │   ├── input/
│   │   │   └── http/
│   │   │       ├── controllers/    # Controladores NestJS
│   │   │       └── middlewares/
│   │   └── output/
│   │       └── persistence/
│   │           ├── entities/       # Entidades TypeORM
│   │           ├── mappers/        # Domain model ↔ ORM entity
│   │           └── repositories/  # Implementaciones de repositorios
│   ├── config/         # Configuración de módulos NestJS
│   └── modules/        # Módulos NestJS por feature
└── shared/
    ├── decorators/
    ├── filters/        # Exception filters globales
    ├── guards/         # Guards de autenticación/autorización
    ├── interceptors/
    └── pipes/
```

---

## Stack

| Capa       | Tecnología                                      |
|------------|-------------------------------------------------|
| Frontend   | Angular 19, TypeScript 5.6, RxJS 7             |
| Backend    | NestJS 10, TypeScript 5.1, TypeORM 0.3         |
| Base datos | PostgreSQL 15                                   |
| Auth       | JWT (Passport.js)                               |
| Docs API   | Swagger (@nestjs/swagger)                       |
| Deploy     | Docker Compose (dev)                            |

---

## Requisitos

- Node.js >= 20
- npm >= 10
- Docker >= 24 (para PostgreSQL en desarrollo)

---

## Instalación

```bash
# Clonar el repo
git clone git@github.com:Edwinggomez98/portfolio-monorepo.git
cd portfolio-monorepo

# Instalar todas las dependencias
npm run install:all

# Configurar variables de entorno
cp .env.example .env
cp backend/.env.example backend/.env
```

---

## Desarrollo

```bash
# Levantar PostgreSQL + ambas apps en paralelo
npm run start

# Solo base de datos
npm run db:up

# Solo frontend (http://localhost:4200)
npm run frontend

# Solo backend (http://localhost:3000)
npm run backend
```

---

## Scripts disponibles (raíz)

| Script              | Descripción                                  |
|---------------------|----------------------------------------------|
| `npm run install:all` | Instala dependencias de raíz, frontend y backend |
| `npm run start`       | Levanta DB + frontend + backend              |
| `npm run dev`         | Frontend + backend en paralelo (sin DB)      |
| `npm run frontend`    | Solo Angular                                 |
| `npm run backend`     | Solo NestJS en modo watch                    |
| `npm run build:all`   | Build de producción de ambos                 |
| `npm run db:up`       | Levanta PostgreSQL con Docker Compose        |
| `npm run db:down`     | Detiene los contenedores                     |
| `npm run db:reset`    | Elimina volúmenes y reinicia la DB           |
