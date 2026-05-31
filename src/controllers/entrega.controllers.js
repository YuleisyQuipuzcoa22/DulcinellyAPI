import { pool } from "../database.js";

//GET
export const getSedes = async (req, res) => {
  try {
    const [result] = await pool.query(`
            SELECT * FROM sede;
        `);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDistritos = async (req, res) => {
  try {
    const [result] = await pool.query(`
            SELECT * FROM distrito;
        `);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getEntregas = async (req, res) => {
  try {
    const { nombre,apellido, fecha_entrega, fecha_pedido, estado,tipo,sede,distrito } = req.query;

    let query = `
      SELECT 
  e.*,
  d.nombre AS nombre_distrito,
  s.direccion AS direccion_sede,
  u.nombre AS nombre_cliente,
  u.apellido AS apellido_cliente,
  u.DNI AS dni_cliente,
  p.fecha AS fecha_pedido,
  CASE 
    WHEN p.idCotizacion IS NULL THEN 'pedido de catálogo'
    ELSE 'pedido cotizado'
  END AS tipo_pedido
FROM entrega e
LEFT JOIN distrito d ON e.idDistrito = d.idDistrito
LEFT JOIN sede s ON e.idSede = s.idSede
LEFT JOIN pedido p ON e.idEntrega = p.idEntrega
LEFT JOIN usuario u ON p.idCliente = u.idUsuario
      
    `;

    let conditions = [];
    let values = [];
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
    if (distrito) {
      conditions.push("d.nombre = ?");
      values.push(distrito);
    }
    if (fecha_entrega) {
      conditions.push("e.fecha_entrega = ?");
      values.push(fecha_entrega);
    }
    if (estado) {
      conditions.push("e.estado = ?");
      values.push(estado);
    }

    if (tipo) {
      conditions.push("e.tipo_entrega = ?");
      values.push(tipo);
    }

    if (sede) {
      conditions.push("s.direccion = ?");
      values.push(sede);
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
//POST
export const createSede = async (req, res) => {
  try {
    const { direccion } = req.body;

    if (!direccion) {
      return res.status(400).json({ message: "Datos son requeridos" });
    }

    const [result] = await pool.query("INSERT INTO sede (direccion) VALUES (?)", [
      direccion,
    ]);

    const newSede = {
      idSede: result.insertId,
      direccion,
    };

    return res.status(201).json(newSede);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const createDistrito = async (req, res) => {
  try {
    const { nombre,costoDelivery } = req.body;

    if (!nombre ||costoDelivery) {
      return res.status(400).json({ message: "Datos son requeridos" });
    }
    

    const [result] = await pool.query(
      "INSERT INTO distrito (nombre,costoDelivery) VALUES (?)",
      [nombre,costoDelivery]
    );

    const newDistrito = {
      idDistrito: result.insertId,
      nombre,
      costoDelivery,
    };

    return res.status(201).json(newDistrito);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const createEntrega = async (req, res) => {
  try {
    const {
      idSede,
      idDistrito,
      fecha_entrega,
      direccion,
      referencia,
      estado,      
      tipo_entrega,
    } = req.body;

    if (!fecha_entrega || !tipo_entrega) {
      return res.status(400).json({ message: "Datos son requeridos" });
    }

    const [result] = await pool.query(
      "INSERT INTO entrega (idSede, idDistrito, fecha_entrega, direccion, referencia, estado, tipo_entrega) VALUES (?, ?, ?, ?,?,?,?)",
      [
        idSede,
        idDistrito,
        fecha_entrega,
        direccion,
        referencia,
        estado,
        
        tipo_entrega,
      ]
    );

    const newEntrega = {
      idEntrega: result.insertId,
      idSede,
      idDistrito,
      fecha_entrega,
      direccion,
      referencia,
      estado,
      
      tipo_entrega,
    };

    return res.status(201).json(newEntrega);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};
//PUT
export const updateEntrega = async (req, res) => {
  try {
    const [result] = await pool.query(
      "UPDATE entrega SET ? WHERE idEntrega=?",
      [req.body, req.params.id]
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const updateSede = async (req, res) => {
  try {
    const [result] = await pool.query(
      "UPDATE sede SET ? WHERE idSede=?",
      [req.body, req.params.id]
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const updateDistrito = async (req, res) => {
  try {
    const [result] = await pool.query(
      "UPDATE distrito SET ? WHERE idDistrito=?",
      [req.body, req.params.id]
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


//DELETE
export const deleteSede =async(req,res)=>{
    try {
        const [result]= await pool.query("DELETE FROM sede WHERE idSede = ? ",[req.params.id])
        if(result.affectedRows === 0){
        return res.status(404).json({message: "Not Found"})
        }
        return res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
    
}
export const deleteDistrito =async(req,res)=>{
    try {
        const [result]= await pool.query("DELETE FROM distrito WHERE idDistrito = ? ",[req.params.id])
        if(result.affectedRows === 0){
        return res.status(404).json({message: "Not Found"})
        }
        return res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
    
}
