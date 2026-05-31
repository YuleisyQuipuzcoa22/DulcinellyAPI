import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { TOKEN_SECRET } from '../config.js';
dotenv.config();

export const verifyToken = (req, res, next) => {
    const {token} = req.cookies;

    if (!token) {
        return res.status(403).json({ message: "Token requerido" });
    }

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido o expirado" });
        }
        req.user = user;
        next();
    });
};