import { pool } from "../database.js ";

//GET
export const getUsuarios = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM usuario ");
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getUniqueUsuario = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM usuario WHERE idUsuario = ?",
      [req.params.id]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUniqueUsuarioId = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Debe enviar el id" });
    }

    const [result] = await pool.query(
      "SELECT * FROM usuario WHERE estado= 'activo' AND idUsuario = ?",
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getClientes = async (req, res) => {
  try {
    const { nombre, apellido, correo, DNI, estado, tipo_usuario } = req.query;
    let query = `SELECT * FROM usuario `;
    let conditions = [];
    let values = [];

    /* if (!DNI) {
      return res.status(400).json({ message: "Debe enviar DNI" });
    } */

    if (nombre) {
      conditions.push("nombre LIKE ?");
      values.push(`%${nombre}%`);
    }
    if (DNI) {
      conditions.push("DNI LIKE ?");
      values.push(`%${DNI}%`);
    }
    if (apellido) {
      conditions.push("apellido LIKE ?");
      values.push(`%${apellido}%`);
    }
    if (correo) {
      conditions.push("correo LIKE ?");
      values.push(`%${correo}%`);
    }
    if (estado) {
      conditions.push("estado=?");
      values.push(estado);
    }
    if (tipo_usuario) {
      conditions.push("tipo_usuario=?");
      values.push(tipo_usuario);
    }

    // Agregar WHERE solo si hay filtros
    if (conditions.length > 0) {
      query += "WHERE " + conditions.join(" AND ");
    }

    const [result] = await pool.query(query, values);
    /* if (result.length === 0) {
      return res.status(404).json({ message: "Not found" });
    } */
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//POST
export const createUsuario = async (req, res) => {
  try {
    const {
      DNI,
      nombre,
      apellido,
      direccion,
      correo,
      contraseña,
      tipo_usuario,
      estado,
    } = req.body;

    // Validar que los campos obligatorios estén presentes
    if (!DNI || !nombre || !apellido || !direccion || !correo) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios.",
      });
    }

    // Buscar si existe usuario por DNI o correo
    const [usuarios] = await pool.query(
      "SELECT * FROM usuario WHERE DNI = ? OR correo = ?",
      [DNI, correo]
    );
    const usuario = usuarios[0];

    if (usuario) {
      // Si ya tiene todos los campos llenos, no permitir registro
      if (
        usuario.DNI &&
        usuario.nombre &&
        usuario.apellido &&
        usuario.direccion &&
        usuario.correo &&
        usuario.contraseña
      ) {
        return res.status(400).json({
          message: "Ya existe un usuario registrado con estos datos.",
        });
      }

      // Verificar si es el mismo correo pero diferente DNI (evitar conflictos)
      if (usuario.correo === correo && usuario.DNI !== DNI) {
        return res.status(400).json({
          error: "El correo electrónico ya está en uso por otro usuario.",
        });
      }

      // Si ya tiene todos los campos llenos, no permitir registro
      if (
        usuario.DNI &&
        usuario.nombre &&
        usuario.apellido &&
        usuario.direccion &&
        usuario.correo &&
        usuario.contraseña
      ) {
        return res.status(400).json({
          error: "Ya existe un usuario registrado con estos datos.",
        });
      }

      // Si le faltan datos, actualizar el registro
      await pool.query(
        "UPDATE usuario SET nombre = ?, apellido = ?, direccion = ?, correo = ?, contraseña = ? WHERE idUsuario = ?",
        [
          nombre || usuario.nombre,
          apellido || usuario.apellido,
          direccion || usuario.direccion,
          correo || usuario.correo,
          contraseña || usuario.contraseña,
          tipo_usuario || usuario.tipo_usuario,
          estado || usuario.estado,
          usuario.idUsuario,
        ]
      );
      return res
        .status(200)
        .json({ message: "Usuario actualizado correctamente." });
    }

    // Si no existe, crear nuevo usuario
    const [result] = await pool.query(
      "INSERT INTO usuario (DNI, nombre, apellido, direccion, correo, contraseña, tipo_usuario, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        DNI,
        nombre,
        apellido,
        direccion,
        correo,
        contraseña,
        tipo_usuario,
        estado,
      ]
    );
    return res
      .status(201)
      .json({ message: "Usuario registrado correctamente." });
  } catch (error) {
    console.error("Error en createUsuario:", error);
    return res.status(500).json({
      error: "Error interno del servidor. Intenta nuevamente.",
      success: false,
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

//UPDATE
export const updateUsuario = async (req, res) => {
  try {
    const [result] = await pool.query(
      "UPDATE usuario SET ? WHERE idUsuario=?",
      [req.body, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }
    return res.json({ success: true, message: "Usuario actualizado correctamente" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
//DELETE
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    //ELIMINA EL USUARIO DE LA BASE DE DATOS
    const [result] = await pool.query(
      "DELETE FROM usuario WHERE idUsuario = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }
    return res.status(200).json({ success: true, message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
