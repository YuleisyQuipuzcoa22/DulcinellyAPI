import { pool } from "../database.js";

//GET
export const getProductos = async (req, res) => {
  try {
    const { nombre, categoria, estado } = req.query;
    let query = `
      SELECT      
        pr.idProducto,
        pr.nombre as nombre_producto,       
        pr.estado,
        cat.nombre as categoria      
        FROM producto pr
          LEFT JOIN categoria cat ON cat.idCategoria = pr.idCategoria
    `;
    let conditions = [];
    let values = [];
    if (nombre) {
      conditions.push("pr.nombre LIKE ?");
      values.push(`%${nombre}%`);
    }
    if (categoria) {
      conditions.push("cat.nombre = ?");
      values.push(categoria);
    }
    if (estado) {
      conditions.push("pr.estado = ?");
      values.push(estado);
    }

    // Agregar WHERE solo si hay filtros
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    const [result] = await pool.query(query, values);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }


};
export const getCategoria = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT idCategoria as id ,nombre FROM categoria ");
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUniqueProducto = async (req, res) => {
  try {
    const [result] = await pool.query(
      `
      SELECT 
        pr.idProducto,
        pr.nombre as nombre_producto,
        pr.descripcion,
        pr.estado,
        cat.nombre as categoria
      FROM producto pr
      LEFT JOIN categoria cat ON cat.idCategoria = pr.idCategoria
      WHERE pr.idProducto = ?
    `,
      [req.params.id]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    return res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//POST
export const createProducto = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const { idCategoria, nombre, descripcion, estado } = req.body;
    if (!idCategoria || !nombre || !descripcion || !estado) {
      return res.status(400).json({ message: "Datos son requeridos" });
    }

    const [result] = await pool.query(
      "INSERT INTO producto (idCategoria, nombre, descripcion, estado) VALUES (?, ?, ?, ?)",
      [idCategoria, nombre, descripcion, estado]
    );

    const newRegister = {
      idProducto: result.insertId,
      idCategoria,
      nombre,
      descripcion,
      estado
    };

    return res.status(201).json(newRegister);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};
export const createCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "Datos son requeridos" });
    }

    const [result] = await pool.query(
      "INSERT INTO categoria (nombre) VALUES (?)",
      [nombre]
    );

    const newRegister = {
      idCategoria: result.insertId,
      nombre,
    };

    return res.status(201).json(newRegister);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

//PUT

export const updateProducto = async (req, res) => {
  try {
    const { estado } = req.body;
    const { id } = req.params;
    console.log("Intentando actualizar producto:", req.body, id);

    // Actualiza el producto
    await pool.query("UPDATE producto SET ? WHERE idProducto=?", [req.body, id]);

    // Si el producto se inactiva, inactiva sus presentaciones
    if (estado === "inactivo") {
      await pool.query(
        "UPDATE presentacion_producto SET estado='inactivo' WHERE idProducto=?",
        [id]
      );
    }

    return res.json({ message: "Producto actualizado" });
  } catch (error) {
     console.error("Error en updateProducto:", error);
    return res.status(500).json({ message: error.message });
   

  }
  
};

export const updateCategoria = async (req, res) => {
  try {
    const [result] = await pool.query(
      "UPDATE categoria SET ? WHERE idCategoria=?",
      [req.body, req.params.id]
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//DELETE
export const deleteCategoria = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM categoria WHERE idCategoria = ? ",
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteProducto = async (req, res) => {
  try {

    
    const [result] = await pool.query(
      "DELETE FROM producto WHERE idProducto=?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.sendStatus(204);

  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    return res.status(500).json({ message: error.message });
  }
};
