import { pool } from "../database.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//GET
export const getPresentacionProductos = async (req, res) => {
  try {
    const {nombre, medida, categoria, tipo, estado,idProducto } = req.query;

    let query = `
      SELECT 
      pp.idPresentacion_Producto,
        pr.idProducto,
        pr.nombre as nombre_producto,
        pr.descripcion,
        pp.imagen,
        pp.estado,
        cat.nombre as categoria,
        um.medida as unidad_medida,
        tp.tipo as tipo_presentacion,
        tp.valor,
        pp.precio,
        pp.valorUnidadMedida

       FROM presentacion_producto pp
        LEFT JOIN producto pr ON pp.idProducto = pr.idProducto
        LEFT JOIN tipo_presentacion tp ON pp.idTipo_Presentacion = tp.idTipo_Presentacion
        LEFT JOIN unidad_medida um ON pp.idUnidad_Medida = um.idUnidad_Medida
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
    if (medida) {
      conditions.push("um.medida = ?");
      values.push(medida);
    }
    if (tipo) {
      conditions.push("tp.tipo = ?");
      values.push(tipo);
    }
    if (estado) {
      conditions.push("pp.estado = ?");
      values.push(estado);
    }
    if(idProducto){
      conditions.push("pp.idProducto = ?");
      values.push(idProducto);
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
export const getUniquePresentacionProducto = async (req, res) => {
  try {
    const [result] = await pool.query(
      `
      SELECT 
        pp.idPresentacion_Producto,
        tp.idTipo_Presentacion,
        um.idUnidad_Medida,
        pr.idProducto,
        pr.nombre as nombre_producto,
        pr.descripcion,
        pp.imagen,
        pp.estado,
        cat.nombre as categoria,
        um.medida as unidad_medida,
        tp.tipo as tipo_presentacion,
        tp.valor as valor_tipo_presentacion,
        pp.precio,
        pp.valorUnidadMedida

       FROM presentacion_producto pp
        LEFT JOIN producto pr ON pp.idProducto = pr.idProducto
        LEFT JOIN tipo_presentacion tp ON pp.idTipo_Presentacion = tp.idTipo_Presentacion
        LEFT JOIN unidad_medida um ON pp.idUnidad_Medida = um.idUnidad_Medida
        LEFT JOIN categoria cat ON cat.idCategoria = pr.idCategoria
        WHERE pp.idPresentacion_Producto = ?
    `,
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
export const getTipoPresentacion = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT idTipo_Presentacion as id , tipo as nombre ,valor FROM tipo_presentacion "
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getUnidadMedida = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT idUnidad_Medida as id , medida as nombre FROM unidad_medida "
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//POST
export const createPresentacionProducto = async (req, res) => {
  try {
    const {
      idProducto,
      idUnidad_Medida,
      idTipo_Presentacion,
      precio,
      valorUnidadMedida,
      estado
    } = req.body;
    const imagen = req.file ? req.file.originalname : null;
    if (
      !idProducto ||
      !idUnidad_Medida ||
      !idTipo_Presentacion ||
      !precio ||
      !valorUnidadMedida ||
      !imagen
    ) {
      return res.status(400).json({ message: "Datos son requeridos" });
    }

    const [result] = await pool.query(
      "INSERT INTO presentacion_producto (idProducto, idUnidad_Medida, idTipo_Presentacion, precio, valorUnidadMedida,imagen,estado) VALUES (?, ?, ?, ?,?,?,?)",
      [
        idProducto,
        idUnidad_Medida,
        idTipo_Presentacion,
        precio,
        valorUnidadMedida,
        imagen,
        estado || 'activo' 
      ]
    );

    const newRegister = {
      idPresentacion_Producto: result.insertId,
      idProducto,
      idUnidad_Medida,
      idTipo_Presentacion,
      precio,
      valorUnidadMedida,
      imagen,
    };

    return res.status(201).json(newRegister);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const createTipoPresentacion = async (req, res) => {
  try {
    const { tipo, valor } = req.body;

    if (!tipo || !valor) {
      //corrección de signo
      return res.status(400).json({ message: "Datos son requeridos" });
    }

    const [result] = await pool.query(
      "INSERT INTO tipo_presentacion (tipo,valor) VALUES (?,?)",
      [tipo, valor]
    );

    const newRegister = {
      idTipo_Presentacion: result.insertId,
      tipo,
      valor,
    };

    return res.status(201).json(newRegister);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};
export const createUnidadMedida = async (req, res) => {
  try {
    const { medida } = req.body;

    if (!medida) {
      return res.status(400).json({ message: "Datos son requeridos" });
    }

    const [result] = await pool.query(
      "INSERT INTO unidad_medida (medida) VALUES (?)",
      [medida]
    );

    const newRegister = {
      idUnidad_Medida: result.insertId,
      medida,
    };

    return res.status(201).json(newRegister);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};
//PUT
export const updatePresentacion = async (req, res) => {
  try {
     
    const [presentRows] = await pool.query(
      "SELECT idProducto FROM presentacion_producto WHERE idPresentacion_Producto = ?",
      [req.params.id]
    );
    if (presentRows.length === 0) {
      return res.status(404).json({ message: "Presentación no encontrada" });
    }
    const idProducto = presentRows[0].idProducto;

    //Si se intenta activar la presentación, verifica el estado del producto
    if (req.body.estado === "activo") {
      const [prodRows] = await pool.query(
        "SELECT estado FROM producto WHERE idProducto = ?",
        [idProducto]
      );
      const estadoProducto = prodRows[0]?.estado;
      if (estadoProducto !== "activo") {
        return res.status(400).json({ message: "No se puede activar la presentación porque el producto está inactivo. Pdta: puedes editar los demás campos pero no el estado :)" });
      }
    }

    // Obtener el nombre del archivo actual desde la BD    
    const [rows] = await pool.query(
      "SELECT imagen FROM presentacion_producto WHERE idPresentacion_Producto = ?",
      [req.params.id]
    );
    const oldImg = rows[0]?.imagen;

    if (req.file) {
      // Borrar imagen anterior del servidor
      if (oldImg) {
        const oldPath = path.join(__dirname, '../public/productos', oldImg);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // Actualizar imagen a nuevo filename
      req.body.imagen = req.file.originalname;
    }

    const [result] = await pool.query(
      "UPDATE presentacion_producto SET ? WHERE idPresentacion_Producto = ?",
      [req.body, req.params.id]
    );

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTipoPresentacion = async (req, res) => {
  try {
    const [result] = await pool.query(
      "UPDATE tipo_presentacion SET ? WHERE idTipo_Presentacion=?",
      [req.body, req.params.id]
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//corregir el id de unidad medida
export const updateUnidadMedida = async (req, res) => {
  try {
    const [result] = await pool.query(
      "UPDATE unidad_medida SET ? WHERE idUnidad_Medida=?",
      [req.body, req.params.id]
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//DELETE
export const deleteTipoPresentacion = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM tipo_presentacion WHERE idTipo_Presentacion = ? ",
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
export const deleteUnidadMedida = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM unidad_medida WHERE idUnidad_Medida = ? ",
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
export const deletePresentacion = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT imagen FROM presentacion_producto WHERE idPresentacion_Producto = ?",
      [req.params.id]
    );
    const img = rows[0]?.imagen;

    if (img) {
      const filePath = path.join(__dirname, '../public/productos', img);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const [result] = await pool.query(
      "DELETE FROM presentacion_producto WHERE idPresentacion_Producto = ?",
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
// GET - Presentaciones más vendidas
export const getMasVendidos = async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT  
        dp.idPresentacion_Producto,
        pro.nombre as nombre_producto,
        tp.tipo as tipo_presentacion,
        um.medida as unidad_medida,
        pp.valorUnidadMedida,
        pp.precio,
        pp.imagen,
        COUNT(*) AS cantidadVendidos
      FROM detalle_pedido dp
      INNER JOIN presentacion_producto pp ON dp.idPresentacion_Producto = pp.idPresentacion_Producto
      INNER JOIN producto pro ON pp.idProducto = pro.idProducto
      INNER JOIN tipo_presentacion tp ON pp.idTipo_Presentacion = tp.idTipo_Presentacion
      INNER JOIN unidad_medida um ON pp.idUnidad_Medida = um.idUnidad_Medida
      GROUP BY dp.idPresentacion_Producto
      ORDER BY cantidadVendidos DESC
      LIMIT 4;
    `);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

