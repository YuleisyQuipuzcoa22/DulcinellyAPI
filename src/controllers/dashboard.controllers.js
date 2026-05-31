import { pool } from "../database.js";

export const getDashboardResumen = async (req, res) => {
  try {
    // Total de pedidos
    const [totalPedidos] = await pool.query(
      "SELECT COUNT(*) AS total FROM pedido"
    );
    // Total de ventas
    const [totalVentas] = await pool.query(
      "SELECT IFNULL(SUM(sub_total),0) AS total FROM pedido"
    );
    // Pedidos pendientes
    const [pendientes] = await pool.query(
      "SELECT COUNT(*) AS total FROM pedido WHERE estado = 'pendiente'"
    );
    // Cotizados
    const [cotizados] = await pool.query(
      "SELECT COUNT(*) AS total FROM pedido WHERE idCotizacion IS NOT NULL"
    );
    // Catálogo
    const [catalogo] = await pool.query(
      "SELECT COUNT(*) AS total FROM pedido WHERE idCotizacion IS NULL"
    );

    res.json({
      totalPedidos: totalPedidos[0].total,
      totalVentas: totalVentas[0].total,
      pedidosPendientes: pendientes[0].total,
      cotizados: cotizados[0].total,
      catalogo: catalogo[0].total,
    });
  } catch (error) {
    console.error("Error en /dashboard/resumen:", error);
    res.status(500).json({ message: "Error al obtener el resumen", error });
  }
};

export const getProductosMasVendidos = async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT p.nombre, SUM(dp.cantidad) as total_vendidos
      FROM detalle_pedido dp
      JOIN presentacion_producto pp ON dp.idPresentacion_Producto = pp.idPresentacion_Producto
      JOIN producto p ON pp.idProducto = p.idProducto
      GROUP BY p.idProducto
      ORDER BY total_vendidos DESC
      LIMIT 5
    `);
    res.json(result);
  } catch (error) {
    console.error("Error en /dashboard/productos-mas-vendidos:", error);
    res.status(500).json({ message: "Error al obtener los productos más vendidos", error });
  }
};