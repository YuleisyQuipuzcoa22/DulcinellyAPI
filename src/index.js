import express from "express";
import {PORT} from './config.js';     
import path from 'path'; 
import { fileURLToPath } from 'url';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import login from './routes/login.routes.js'
import usuario from './routes/usuario.routes.js'
import entrega from './routes/entrega.routes.js'
import pago from './routes/pago.routes.js'
import pedido from './routes/pedido.routes.js'
import presentacion from './routes/presentacion.routes.js'
import producto from './routes/producto.routes.js'
import dashboard from './routes/dashboard.routes.js';

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors({origin:true, credentials:true}))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname,'public')))
app.use(login)
app.use(usuario)
app.use(entrega)
app.use(pago)
app.use(pedido)
app.use(presentacion)
app.use(producto)
app.use(dashboard);
app.listen(PORT)
console.log(`Server on port ${PORT}` )
