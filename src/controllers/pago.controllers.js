import { pool } from "../database.js";

//GET
export const getPagos = async (req, res) => {
   try {
    const {
      nombre,
      apellido,
      dni,
      fecha_entrega,
      fecha_pedido,
      fecha_pago,
      metodo,
      estado,
    } = req.query;

    let query = `
      SELECT 
  pa.*,
  u.nombre AS nombre_cliente,
  u.apellido AS apellido_cliente,
  u.DNI AS dni_cliente,
  e.fecha_entrega,
  pa.estado,
  pa.fecha_pago,
  mp.metodo,
  CASE 
    WHEN p.idCotizacion IS NOT NULL THEN c.descripcion
    ELSE GROUP_CONCAT(
      CONCAT(
        pr.nombre, '-',
        tp.tipo, '-',
        um.medida, '-',
        dp.cantidad, '-',
        pp.valorUnidadMedida, '-',
        pp.precio
      ) SEPARATOR ' | '
    )
  END AS detalle_pedido,
  e.costo_entrega,
  p.sub_total

FROM pedido p
LEFT JOIN pago pa ON p.idPedido = pa.idPedido
LEFT JOIN entrega e ON p.idEntrega = e.idEntrega
LEFT JOIN metodo_pago mp ON mp.idMetodo_Pago = pa.idMetodo_Pago
LEFT JOIN cotizacion c ON p.idCotizacion = c.idCotizacion
LEFT JOIN usuario u ON p.idCliente = u.idUsuario
LEFT JOIN detalle_pedido dp ON p.idPedido = dp.idPedido
LEFT JOIN presentacion_producto pp ON dp.idPresentacion_Producto = pp.idPresentacion_Producto
LEFT JOIN producto pr ON pp.idProducto = pr.idProducto
LEFT JOIN tipo_presentacion tp ON pp.idTipo_Presentacion = tp.idTipo_Presentacion
LEFT JOIN unidad_medida um ON pp.idUnidad_Medida = um.idUnidad_Medida
      
    `;

    let conditions = [];
    let values = [];
    if (dni) {
      conditions.push("u.DNI = ?");
      values.push(dni);
    }
    if (nombre) {
      conditions.push("u.nombre = ?");
      values.push(nombre);
    }
    if (apellido) {
      conditions.push("u.apellido = ?");
      values.push(apellido);
    }
    if (fecha_pedido) {
      conditions.push("p.fecha = ?");
      values.push(fecha_pedido);
    }
   
    if (fecha_entrega) {
      conditions.push("e.fecha_entrega = ?");
      values.push(fecha_entrega);
    }
    if (estado) {
      conditions.push("pa.estado = ?");
      values.push(estado);
    }
    if (fecha_pago) {
      conditions.push("pa.fecha_pago = ?");
      values.push(fecha_pago);
    }
    if (metodo) {
      conditions.push("mp.metodo = ?");
      values.push(metodo);
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
export const getMetodoPago = async (req, res) => {
  try {
    const [result] = await pool.query(`
            SELECT * FROM metodo_pago;
        `);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//POST
export const createPago = async (req, res) => {
  try {
    const { idPedido, idMetodo_Pago, fecha_pago, estado } = req.body;

    if (!idPedido || !idMetodo_Pago  || !estado) {
      return res.status(400).json({ message: "Datos son requeridos" });
    }

    const [result] = await pool.query(
      "INSERT INTO pago (idPedido, idMetodo_Pago, fecha_pago, estado) VALUES (?, ?, ?, ?)",
      [idPedido, idMetodo_Pago, fecha_pago, estado]
    );

    const newPago = {
      idPago: result.insertId,
      idPedido,
      idMetodo_Pago,
      fecha_pago,
      estado,
    };

    return res.status(201).json(newPago);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};
export const createMetodoPago = async (req, res) => {
  try {
    const { metodo } = req.body;

    if (!metodo) {
      return res.status(400).json({ message: "Datos son requeridos" });
    }

    const [result] = await pool.query(
      "INSERT INTO metodo_pago (metodo) VALUES (?)",
      [metodo]
    );

    const newMetodo = {
      idMetodo_Pago: result.insertId,
      metodo,
    };

    return res.status(201).json(newMetodo);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};
//PUT
export const updatePago = async (req, res) => {
  try {
    const [result] = await pool.query("UPDATE pago SET ? WHERE idPago=?", [
      req.body,
      req.params.id,
    ]);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateMetodoPago = async (req, res) => {
  try {
    const [result] = await pool.query("UPDATE metodo_pago SET ? WHERE idMetodo_Pago=?", [
      req.body,
      req.params.id,
    ]);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//DELETE
export const deleteMetodoPago =async(req,res)=>{
    try {
        const [result]= await pool.query("DELETE FROM metodo_pago WHERE idMetodo_Pago = ? ",[req.params.id])
        if(result.affectedRows === 0){
        return res.status(404).json({message: "Not Found"})
        }
        return res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
    
};
//obtener el idPago del pedido
export const getPagoByPedido = async (req, res) => {
  try {
    const { idPedido } = req.params;
    const [result] = await pool.query(
      "SELECT * FROM pago WHERE idPedido = ?",
      [idPedido]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }
    return res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

