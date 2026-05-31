import { pool } from "../database.js";

//GET
export const getCotizacion = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM cotizacion ");
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//POST
export const createCotizacion = async (req, res) => {
   try {
    const { descripcion, fechaEntregaTentativa } = req.body;
    const imgURL = req.file ? req.file.originalname : null;

    if (!descripcion  || !imgURL) {
      return res.status(400).json({ message: "Datos son requeridos" });
    }

    const [result] = await pool.query(
      "INSERT INTO cotizacion (descripcion, imgURL, fechaEntregaTentativa) VALUES (?, ?, ?)",
      [descripcion,  imgURL, fechaEntregaTentativa]
    );

    const newRegister = {
      idCotizacion: result.insertId,
      descripcion,
      imgURL,
      fechaEntregaTentativa,
    };

    return res.status(201).json(newRegister);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

//UPDATE
export const updateCotizacion = async (req, res) => {
  try {
    const [result] = await pool.query("UPDATE cotizacion SET ? WHERE idCotizacion=?", [
      req.body,
      req.params.id,
    ]);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//DELETE
export const deleteCotizacion =async(req,res)=>{
    try {
        const [result]= await pool.query("DELETE FROM cotizacion WHERE idCotizacion = ? ",[req.params.id])
        if(result.affectedRows === 0){
        return res.status(404).json({message: "Not Found"})
        }
        return res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
    
}
