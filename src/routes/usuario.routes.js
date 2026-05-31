import {Router} from 'express'
import {verifyToken} from '../middleware/authMiddleware.js'
import {getUsuarios,createUsuario,updateUsuario,getClientes,getUniqueUsuario,getUniqueUsuarioId, deleteUsuario} from '../controllers/usuario.controllers.js'
const router = Router()
//GET
router.get('/usuarios',verifyToken,getUsuarios)
router.get('/clientes',verifyToken,getClientes)
router.get('/usuario',getUniqueUsuario)
router.get('/profile/usuario',verifyToken,getUniqueUsuarioId)

router.get('/usuario/:id', getUniqueUsuario);


//POST
router.post('/usuario', createUsuario);

//PUT
router.put('/usuario/:id',verifyToken,updateUsuario)

//DELETE 
router.delete('/usuario/:id', verifyToken, deleteUsuario) // <-- AGREGA ESTA LÍNEA


export default router;