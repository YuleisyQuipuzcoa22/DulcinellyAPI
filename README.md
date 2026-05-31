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

3. **Configurar variables de entorno:**
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
# Puerto del servidor
PORT=3000

# Base de datos MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=dulcinelly_db
DB_PORT=3306

# JWT
JWT_SECRET=tu_secreto_jwt_muy_seguro
JWT_EXPIRATION=7d

# Entorno
NODE_ENV=development
```

4. **Crear la base de datos (opcional):**
```bash
mysql -u root -p < database/schema.sql
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
├── .env                   # Variables de entorno
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

## 📤 Subida de Archivos

Los archivos se manejan mediante **Multer**. Los archivos se guardan en la carpeta `/uploads`.

```bash
POST /api/upload
Content-Type: multipart/form-data
Body: archivo
```

## 🐛 Troubleshooting

### Error de conexión a BD
- Verifica que MySQL esté corriendo: `mysql -u root -p`
- Comprueba las credenciales en `.env`
- Asegúrate de que la base de datos existe

### Error de puerto en uso
```bash
# En Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# En Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Errores de JWT
- Verifica que `JWT_SECRET` esté configurado en `.env`
- Asegúrate de enviar el token en el header `Authorization`

## 📝 Ejemplo de Uso

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Acceder a recurso protegido
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer <token_aqui>"
```

## 🤝 Contribución

Si deseas contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature: `git checkout -b feature/AmazingFeature`
3. Commit tus cambios: `git commit -m 'Add some AmazingFeature'`
4. Push a la rama: `git push origin feature/AmazingFeature`
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia **ISC**.

## 👨‍💻 Autor

**Yuleisy Quipuzcoa** - [GitHub](https://github.com/YuleisyQuipuzcoa22)

## 📞 Soporte

Para reportar problemas o sugerencias, abre un [issue](https://github.com/YuleisyQuipuzcoa22/DulcinellyAPI/issues) en el repositorio.

---

**¡Gracias por usar DulcinellyAPI!** 🎉
