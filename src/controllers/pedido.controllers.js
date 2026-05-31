import { pool } from "../database.js";

//GET
export const getPedidos = async (req, res) => {

  try {
    const {
      id,
      nombre,
      apellido,
      dni,
      fecha_entrega,
      fecha_pedido,
      estado,
      tipoEntrega,
      tipoPedido,
    } = req.query;

    const tipoEntregaFiltro = tipoEntrega;
    const tipoPedidoFiltro = tipoPedido;

    let query = `
      SELECT 
        p.*,
        u.nombre AS nombre_cliente,
        u.apellido AS apellido_cliente,
        u.DNI AS dni_cliente,
        e.fecha_entrega,
        e.tipo_entrega AS tipo_entrega,
        p.estado,
        MAX(mp.metodo) AS medio_pago,
        MAX(pa.estado) AS estado_pago,
        MAX(e.estado) AS estado_entrega,
        c.imgURL AS imagen_cotizacion,
        c.fechaEntregaTentativa,
        c.descripcion,

        CASE 
          WHEN p.idCotizacion IS NOT NULL THEN c.descripcion
         ELSE GROUP_CONCAT(
        JSON_OBJECT(
          'nombre', pr.nombre,
          'tipo', tp.tipo,
          'medida', um.medida,
          'cantidad', dp.cantidad,
          'unidad', pp.valorUnidadMedida,
          'precio', pp.precio,
          'imagen', pp.imagen,
          'idPresentacion_Producto', pp.idPresentacion_Producto
  )
)
        END AS detalle_pedido,
        p.sub_total,
        dis.costoDelivery
      FROM pedido p
      LEFT JOIN entrega e ON p.idEntrega = e.idEntrega
      LEFT JOIN cotizacion c ON p.idCotizacion = c.idCotizacion
      LEFT JOIN usuario u ON p.idCliente = u.idUsuario 
      LEFT JOIN detalle_pedido dp ON p.idPedido = dp.idPedido
      LEFT JOIN presentacion_producto pp ON dp.idPresentacion_Producto = pp.idPresentacion_Producto
      LEFT JOIN producto pr ON pp.idProducto = pr.idProducto
      LEFT JOIN tipo_presentacion tp ON pp.idTipo_Presentacion = tp.idTipo_Presentacion
      LEFT JOIN unidad_medida um ON pp.idUnidad_Medida = um.idUnidad_Medida
      LEFT JOIN distrito dis ON e.idDistrito = dis.idDistrito
      LEFT JOIN pago pa ON pa.idPedido = p.idPedido
      LEFT JOIN metodo_pago mp ON pa.idMetodo_Pago = mp.idMetodo_Pago

    `;

    let conditions = [];
    let values = [];
    if (id) {
      conditions.push("u.idUsuario = ?");
      values.push(id);
    }
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
      conditions.push("p.estado = ?");
      values.push(estado);
    }


    if (tipoEntregaFiltro) {
      if (tipoEntregaFiltro === "recojo") {
        conditions.push("e.tipo_entrega = 'recojo en sede'");
      } else if (tipoEntregaFiltro === "delivery") {
        conditions.push("e.tipo_entrega = 'delivery'");
      }
    }
    if (tipoPedidoFiltro) {
      if (tipoPedidoFiltro === "catalogo") {
        conditions.push("p.idCotizacion IS NULL");
      } else if (tipoPedidoFiltro === "cotizado") {
        conditions.push("p.idCotizacion IS NOT NULL");
      }
    }

    // Agregar WHERE solo si hay filtros
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    query += " GROUP BY p.idPedido";
    const [rows] = await pool.query(query, values);

    // Convertimos los JSONs de detalle_pedido a arrays reales en JS
    const pedidos = rows.map(pedido => {
      if (pedido.idCotizacion === null && typeof pedido.detalle_pedido === 'string') {
        try {
          // Agregamos corchetes para convertirlo en array de objetos
          pedido.productosCatalogo = JSON.parse(`[${pedido.detalle_pedido}]`);
        } catch (error) {
          console.error("❌ Error al parsear detalle_pedido:", error);
          pedido.productosCatalogo = [];
        }
      }
      return pedido;
    });

    return res.json(pedidos);

  } catch (error) {
    console.error("❌ Error en getPedidos:", error);
    return res.status(500).json({ message: error.message });
  }
};

//POST
export const createPedido = async (req, res) => {
  try {
    const {
      idAsistente,
      idCliente,
      idCotizacion,
      idEntrega,
      sub_total,
      estado,
    } = req.body;
    const fecha = new Date();
    const [result] = await pool.query(
      "INSERT INTO pedido (idAsistente, idCliente, idCotizacion, idEntrega, fecha, sub_total, estado) VALUES (?, ?, ?, ?,?,?,?)",
      [
        idAsistente,
        idCliente,
        idCotizacion,
        idEntrega,
        fecha,
        sub_total,
        estado,
      ]
    );

    const newRegister = {
      idPedido: result.insertId,
      idAsistente,
      idCliente,
      idCotizacion,
      idEntrega,
      fecha,
      sub_total,
      estado,
    };

    return res.status(201).json(newRegister);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const createDetallePedido = async (req, res) => {
  try {
    const { idPedido, idPresentacion_Producto, cantidad, sub_total } = req.body;

    if (
      !idPedido ||
      !idPresentacion_Producto ||
      !cantidad ||
      !sub_total
    ) {
      return res.status(400).json({ message: "Datos son requeridos" });
    }

    const [result] = await pool.query(
      "INSERT INTO detalle_pedido (idPedido, idPresentacion_Producto, cantidad, sub_total) VALUES (?, ?, ?, ?)",
      [idPedido, idPresentacion_Producto, cantidad, sub_total]
    );

    const newRegister = {
      idDetalle_Pedido: result.insertId,
      idPedido,
      idPresentacion_Producto,
      cantidad,
      sub_total,
    };

    return res.status(201).json(newRegister);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

//PUT
export const updatePedido = async (req, res) => {
  try {
    const [result] = await pool.query("UPDATE pedido SET ? WHERE idPedido=?", [
      req.body,
      req.params.id,
    ]);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
