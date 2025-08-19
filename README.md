📘 Million -- Fullstack Technical Test

Aplicación full-stack desarrollada en .NET 8 (C#) para el backend y
Next.js 15 (TypeScript) para el frontend. Incluye arquitectura limpia,
MongoDB como base de datos, precarga automática de datos (24 propiedades
de ejemplo) y frontend moderno con Tailwind v4 + Flowbite + React Query.

## 🚀 Tecnologías usadas

### 🔙 Backend

- ASP.NET Core 8 (Web API)  
- MongoDB.Driver  
- Arquitectura limpia (Domain, Application, Infrastructure, WebApi)  
- Precarga automática de datos (`IHostedService`)  
- Swagger + Serilog  

### Frontend

-   Next.js 15 (App Router) con TypeScript
-   Tailwind CSS v4 + @tailwindcss/postcss
-   Flowbite React (UI components)
-   TanStack React Query v5
-   next/image con shimmer blur
-   Arquitectura por features

⚙️ Prerequisitos - Node.js v20+ - .NET SDK 8.0 - MongoDB (local o Atlas)

📂 Estructura del proyecto

    Million/
     ├── Million.Domain/         → Entidades de negocio
     ├── Million.Application/    → Casos de uso, DTOs, servicios
     ├── Million.Infrastructure/ → Persistencia Mongo + Repositorios
     ├── Million.WebApi/         → API ASP.NET Core
     ├── Million.UnitTests/      → Pruebas unitarias backend
     └── million-front/          → Frontend Next.js

🔧 Clonar repositorio

``` bash
git clone https://github.com/juansuarez16/million.git
cd million
```

🔧 Backend – API .NET 8  
1. Configuración  

Editar `appsettings.json` en **Million.WebApi**:


```json
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
```


2.  **Precarga de datos (Seed)**

    -   No es necesario ejecutar scripts manuales ni importar dumps.
    -   La aplicación incluye un servicio de seed automático
        (`SeedMongoHostedService`) que:
        -   Se ejecuta al iniciar la API.
        -   Verifica si la colección está vacía.
        -   Inserta 24 propiedades de ejemplo con:
            -   Datos de propietario.
            -   Dirección, precio base y año.
            -   Código interno único.
            -   1--2 imágenes (`PropertyImageDocument`).
            -   0--2 trazas históricas (`PropertyTraceDocument`).

    👉 En un entorno real este proceso se manejaría con scripts
    controlados por entorno, pero para efectos de esta prueba se dejó
    siempre habilitado.

3.  **Ejecutar API**

    ``` bash
    cd Million.WebApi
    dotnet run
    ```

    o abrir la solución y configurar arranque en `Million.WebApi`

    Por defecto: 👉 https://localhost:5001/swagger

🎨 Frontend -- Next.js 15 

1. **Instalar dependencias**
   ```
   bash    cd million-front    
    npm install
   ```
3.  **Configurar API** Crear `.env.local` en `million-front/`:

    ``` env
    NEXT_PUBLIC_API_BASE=http://localhost:5001
    ```

4.  **Ejecutar en desarrollo**

    ``` bash
    npm run dev
    ```

    El frontend corre por defecto en: 👉 http://localhost:3000

    ⚠️ Nota importante: La aplicación frontend no abre automáticamente
    el navegador. Debe abrirse manualmente y colocar: 👉
    http://localhost:3000/

5.  **Build & producción**

    ``` bash
    npm run build
    npm run start
    ```

✅ Pruebas \### Backend Ejecutar pruebas unitarias con NUnit/Moq:

``` bash
cd Million.UnitTests
dotnet test
```

### Frontend

Usamos Jest + Testing Library

``` bash
cd million-front
npm test
```

Incluye pruebas para: - FiltersBar (interacciones) - api.fetchProperties
(querystring correcto) - PropertyCard (render e imagen)

📸 Funcionalidades clave - Filtrar propiedades por nombre, dirección,
rango de precio, orden. - Paginación con Flowbite. - Navbar con logo y
links activos. - Landing page con Hero Section y CTA. - Imágenes
optimizadas con next/image y shimmer placeholder.

📝 Notas finales - Gracias al seed automático, no es necesario importar
scripts ni bases de datos manualmente. - En un entorno real, el seed se
gestionaría como migraciones controladas o scripts por entorno (Dev,
Staging, Prod). - La aplicación no abre automáticamente el navegador.
Debe abrirse manualmente: - Backend: 👉 https://localhost:5001/swagger -
Frontend: 👉 http://localhost:3000/ - El frontend está preparado para
conectarse a cualquier API que exponga el contrato definido en
`Million.WebApi`.
