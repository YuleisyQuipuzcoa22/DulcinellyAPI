# DulcinellyAPI 🚀

Una API REST desarrollada con **Node.js** y **Express** para gestionar funcionalidades de autenticación, usuarios, y más.

## 📋 Características

- ✅ Autenticación con JWT (JSON Web Tokens)
- ✅ Gestión de cookies
- ✅ Control de CORS
- ✅ Base de datos MySQL
- ✅ Carga de archivos con Multer
- ✅ Variables de entorno con dotenv

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Descripción |
|-----------|---------|-------------|
| Node.js | - | Runtime de JavaScript |
| Express | 5.1.0 | Framework web minimalista |
| MySQL2 | 3.14.1 | Driver MySQL para Node.js |
| JWT | 9.0.2 | Autenticación basada en tokens |
| Multer | 2.0.0 | Middleware para subida de archivos |
| CORS | 2.8.5 | Gestión de CORS |
| dotenv | 16.5.0 | Variables de entorno |
| Cookie Parser | 1.4.7 | Parseador de cookies |

## 📦 Instalación

### Requisitos Previos
- **Node.js** (v14 o superior)
- **npm** o **yarn**
- **MySQL** (v5.7 o superior)

### Pasos de Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/YuleisyQuipuzcoa22/DulcinellyAPI.git
cd DulcinellyAPI
```

2. **Instalar dependencias:**
```bash
npm install
```

## ▶️ Ejecución

### Modo Desarrollo (con hot reload)
```bash
npm run dev
```
El servidor se reiniciará automáticamente cuando hagas cambios en el código. Accede a la API en `http://localhost:3000`

### Modo Producción
```bash
node src/index.js
```

## 📁 Estructura del Proyecto

```
DulcinellyAPI/
├── src/
│   ├── index.js           # Punto de entrada de la aplicación
│   ├── routes/            # Rutas de la API
│   ├── controllers/       # Lógica de controladores
│   ├── models/            # Modelos de datos
│   ├── middleware/        # Middleware personalizado
│   └── config/            # Configuraciones (BD, JWT, etc)                
├── .gitignore             # Archivos ignorados por git
├── package.json           # Dependencias del proyecto
└── README.md              # Este archivo
```

## 🔌 Endpoints Principales

> Reemplaza con los endpoints reales de tu API

```
POST   /api/auth/register      - Registrar nuevo usuario
POST   /api/auth/login         - Iniciar sesión
GET    /api/users              - Obtener lista de usuarios
GET    /api/users/:id          - Obtener usuario por ID
PUT    /api/users/:id          - Actualizar usuario
DELETE /api/users/:id          - Eliminar usuario
```

## 🔐 Autenticación

La API utiliza **JWT (JSON Web Tokens)** para autenticación. Después de login, incluye el token en el header:

```
Authorization: Bearer <tu_token_jwt>
```
