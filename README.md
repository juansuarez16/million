📘 Million – Fullstack Technical Test

Aplicación full-stack desarrollada en .NET 8 (C#) para el backend y Next.js 15 (TypeScript) para el frontend.
Incluye arquitectura limpia, MongoDB como base de datos, precarga automática de datos (24 propiedades de ejemplo) y frontend moderno con Tailwind v4 + Flowbite + React Query.

🚀 Tecnologías usadas
Backend

ASP.NET Core 8 (Web API)

MongoDB.Driver

Arquitectura limpia (Domain, Application, Infrastructure, WebApi)

Precarga automática de datos (IHostedService)

Swagger + Serilog

Frontend

Next.js 15 (App Router) con TypeScript

Tailwind CSS v4 + @tailwindcss/postcss

Flowbite React (UI components)

TanStack React Query v5

next/image con shimmer blur

Arquitectura por features

⚙️ Prerequisitos

Node.js v20+

.NET SDK 8.0

MongoDB (local o Atlas)

📂 Estructura del proyecto
Million/
 ├── Million.Domain/         → Entidades de negocio
 ├── Million.Application/    → Casos de uso, DTOs, servicios
 ├── Million.Infrastructure/ → Persistencia Mongo + Repositorios
 ├── Million.WebApi/         → API ASP.NET Core
 ├── Million.UnitTests/      → Pruebas unitarias backend
 └── million-front/          → Frontend Next.js

🔧 Backend – API .NET 8
1. Configuración

Editar appsettings.json en Million.WebApi:

{
  "Mongo": {
    "ConnectionString": "mongodb://localhost:27017",
    "Database": "MillionDb",
    "PropertiesCollection": "Properties"
  },
  "Serilog": {
    "MinimumLevel": "Information"
  }
}

2. Precarga de datos (Seed)

No es necesario ejecutar scripts manuales ni importar dumps.
La aplicación incluye un servicio de seed automático (SeedMongoHostedService) que:

Se ejecuta al iniciar la API.

Verifica si la colección está vacía.

Inserta 24 propiedades de ejemplo con:

Datos de propietario.

Dirección, precio base y año.

Código interno único.

1–2 imágenes (PropertyImageDocument).

0–2 trazas históricas (PropertyTraceDocument).

De esta forma, al ejecutar la aplicación por primera vez ya se tienen datos listos para consultar desde el frontend.
👉 En un entorno real este proceso se manejaría con scripts controlados por entorno, pero para efectos de esta prueba se dejó siempre habilitado.

3. Ejecutar API
cd Million.WebApi
dotnet run


Por defecto: 👉 https://localhost:5001/swagger

🎨 Frontend – Next.js 15
1. Instalar dependencias
cd million-front
npm install

2. Configurar API

Crear .env.local en million-front/:

NEXT_PUBLIC_API_BASE=http://localhost:5001

3. Ejecutar en desarrollo
npm run dev


Abrir 👉 http://localhost:3000

4. Build & producción
npm run build
npm run start

✅ Pruebas
Backend

Ejecutar pruebas unitarias con xUnit/Moq:

cd Million.UnitTests
dotnet test

Frontend

Usamos Jest + Testing Library + MSW.

cd million-front
npm test


Incluye pruebas para:

FiltersBar (interacciones)

api.fetchProperties (querystring correcto)

PropertyCard (render e imagen)

(Opcional) página /properties con MSW

📸 Funcionalidades clave

Filtrar propiedades por nombre, dirección, rango de precio, orden.

Paginación con Flowbite.

Navbar con logo y links activos.

Landing page con Hero Section y CTA.

Imágenes optimizadas con next/image y shimmer placeholder.

🧭 Arquitectura (alto nivel)
flowchart LR
    subgraph Client["Cliente (Browser)"]
      UI["Next.js 15 (App Router)"]
      UI --> RQ["React Query v5"]
      UI --> FB["Flowbite React (UI)"]
    end

    subgraph Frontend["million-front"]
      APIFE["features/properties/api.ts\nfetchProperties / fetchPropertyById"]
      VM["features/properties/vm\n(usePropertiesVM)"]
      CMP["features/properties/components\n(FiltersBar, PropertyCard, Pagination)"]
      UI --- VM
      VM --- APIFE
      CMP --- UI
    end

    subgraph Backend["Million.WebApi (ASP.NET Core 8)"]
      CTRL["PropertiesController\n(ActionResult<PropertyDto>)"]
      APP["Million.Application\n(PropertyService, DTOs, Ports)"]
      DOM["Million.Domain\n(Entities: Property)"]
      INF["Million.Infrastructure\n(Mongo Repos, Mappers)"]
    end

    subgraph Data["MongoDB"]
      COL["Database: MillionDb\nCollection: Properties"]
    end

    RQ -->|"HTTP (JSON)"| CTRL
    CTRL --> APP
    APP --> INF
    INF -->|"MongoDB.Driver"| COL
    APP --- DOM

    subgraph Bootstrap["Bootstrap & Utilidades"]
      SEED["SeedMongoHostedService\n(24 propiedades de ejemplo)"]
      SWAG["Swagger / OpenAPI"]
      IMG["next/image + shimmer placeholder"]
    end

    SEED -.-> COL
    SWAG -.-> CTRL
    IMG -.-> UI

🔁 Flujo de petición (búsqueda y listado)
sequenceDiagram
    autonumber
    participant U as Usuario (Browser)
    participant UI as Next.js Page (/properties)
    participant VM as usePropertiesVM
    participant FE as api.ts (fetchProperties)
    participant API as WebApi (GET /api/properties)
    participant APP as PropertyService
    participant INF as PropertyReadRepository
    participant DB as MongoDB

    U->>UI: Escribe filtros / cambia orden
    UI->>VM: setFilters (debounce)
    VM->>FE: fetchProperties(filters)
    FE->>API: GET /api/properties?name=&address=&minPrice=...
    API->>APP: ListAsync(filters)
    APP->>INF: ListAsync(filters)
    INF->>DB: Find + Sort + Skip/Limit
    DB-->>INF: Docs (PropertyDocument[])
    INF->>APP: (Items, Total)
    APP-->>API: PagedResult<PropertyDto>
    API-->>FE: 200 OK (JSON)
    FE-->>UI: items, total, page, pageSize
    UI-->>U: Render cards (next/image) + paginación

🧱 Capas (backend – Clean Architecture)
flowchart TB
    UI["WebApi (Controllers)"] --> APP["Application\n(Use Cases / Services / DTOs / Ports)"]
    APP --> DOM["Domain\n(Entities, Rules)"]
    APP --> INF["Infrastructure\n(Mongo Repos, Mappers)"]
    INF --> DB["MongoDB"]

🗄️ Modelo de datos (MongoDB)
erDiagram
    PROPERTY {
      string Id PK
      string IdOwner
      string Name
      string Address
      decimal Price
      string CodeInternal
      int Year
    }
    PROPERTY ||--o{ PROPERTYIMAGE : has
    PROPERTY ||--o{ PROPERTYTRACE : has

    PROPERTYIMAGE {
      string Id
      string File
      bool Enabled
    }

    PROPERTYTRACE {
      string Id
      string Name
      datetime DateSale
      decimal Value
      decimal Tax
    }

📝 Notas finales

Gracias al seed automático, no es necesario importar scripts ni bases de datos manualmente.

En un entorno real, el seed se gestionaría como migraciones controladas o scripts por entorno (Dev, Staging, Prod).

El frontend está preparado para conectarse a cualquier API que exponga el contrato definido en Million.WebApi.
