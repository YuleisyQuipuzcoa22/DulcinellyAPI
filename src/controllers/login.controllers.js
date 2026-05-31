import {pool} from "../database.js";
import {createAccessToken} from '../config.js'
import dotenv from "dotenv";

dotenv.config();

// Función para iniciar sesión
export const login = async (req, res) => {
    try {
        const { correo, contraseña } = req.body;

        if (!correo || !contraseña) {
            return res.status(400).json({ message: "Correo y contraseña son requeridos" });
        }

        const [rows] = await pool.query("SELECT * FROM usuario WHERE correo = ?", [correo]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        const user = rows[0];
        
        if (contraseña !== user.contraseña) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }
        
        const token = await createAccessToken({id:user.idUsuario,nombre:user.nombre,apellido:user.apellido ,tipo_usuario:user.tipo_usuario})

        res.cookie("token",token)

        res.json({ success: true , user: {id:user.idUsuario,nombre:user.nombre,apellido:user.apellido ,tipo_usuario:user.tipo_usuario} });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const logout = async (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0), 
        httpOnly: true,        
        sameSite: "None",
        secure: true 
    });

    return res.status(200).json({ message: "Cierre de sesión exitoso" });
};

