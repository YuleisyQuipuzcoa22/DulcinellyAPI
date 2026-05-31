import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
export const PORT = 5000
export const TOKEN_SECRET = process.env.JWT_SECRET || "dulcinelly";

export function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, TOKEN_SECRET, { expiresIn: "8h" }, (err, token) => {
      if (err) {
        return reject(err);
      }
      resolve(token);
    });
  });
}
// Obtener __dirname en un módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Configuración del almacenamiento
const storageProducto = multer.diskStorage({
  destination: path.join(__dirname, '/public/productos')
  ,
  filename: function (req, file, cb) {
    const filePath = path.join(__dirname, '/public/productos', file.originalname);
    if (fs.existsSync(filePath)) {
      return cb(new Error('Ya existe esa imagen'));
    }
    cb(null, file.originalname);
  }
});

const storageCotizacion = multer.diskStorage({
  destination: path.join(__dirname, '/public/cotizacion')
  ,
  filename: function (req, file, cb) {
    const filePath = path.join(__dirname, '/public/cotizacion', file.originalname);
    if (fs.existsSync(filePath)) {
      return cb(new Error('Ya existe esa imagen'));
    }
    cb(null, file.originalname);
  }
});

// Filtro para aceptar solo imágenes JPG
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes JPG, PNG o WEBP"));
  }
};

export const uploadProducto = multer({ storage: storageProducto, fileFilter: fileFilter });
export const uploadCotizacion = multer({ storage: storageCotizacion, fileFilter: fileFilter });