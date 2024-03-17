import { Router } from 'express';
import cartModel from '../models/cart.js';

const cartRouter = Router()


// //No tiene sentido al haber un solo carrito
// cartRouter.post('/', async (req, res) => {
//     try {
//         const id = crypto.randomBytes(10).toString('hex')
//         const cartManager = new CartManager('./src/data/cart.json', id)
//         return res.status(200).send(`Carrito creado correctamente con el id: ${id}`)

//     } catch (error) {
//         res.status(500).send(`Error al crear carrito: ${error}`)
//     }
// })



cartRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid
        //findOne busca por id porque es lo que le pasamos
        const cart = await cartModel.findOne({ _id: cartId })//.populate('products.prod_id')
        res.status(200).send(cart)
    } catch (error) {   
        res.status(500).send(`Error interno del servidor al consultar carrito: ${error}`)
    }
})

//Crea un carrito
cartRouter.post('/', async (req, res) => {
    try {
        const crearCart = await cartModel.create({products: []})
        res.status(201).send(crearCart)
    } catch (error) {
        res.status(500).send(`Error interno del servidor al crear carrito: ${error}`)
    }
})


cartRouter.post('/:cid/:pid', async (req, res) => {

    try {
        const cartId = req.params.cid
        const idProducto = req.params.pid
        const { quantity } = req.body
        const cart = await cartModel.findById(cartId)
        
        const indice = cart.products.findIndex(p => p.prod_id == idProducto)

        if (indice != -1) {
            //Si ya existe el producto, le sumo la nueva cantidad agregada
            cart.products[indice].quantity = quantity
        } else {
            //Si el prod no existe creo un objeto producto 
            cart.products.push({ id: idProducto, quantity: quantity })
        }      
        const mensaje = await cartModel.findByIdAndUpdate(cartId, cart)
        res.status(200).send(mensaje)

    } catch (error) {
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`)
    }
})
//HACER DELETE, esquema del productrouter, editar el cartmodel
// cartRouter.delete('/:cid/:pid', async (req, res) => {
/*/     try {
    const idProducto = req.params.idProd
    const mensaje = await productModel.findByIdAndDelete(idProducto)
    if (mensaje == 'Producto eliminado')
        res.status(200).send(mensaje)
    else
        res.status(404).send(mensaje)
} catch (error) {
    res.status(500).send(`Error interno del servidor al eliminar el producto: ${error}`)
}
*/ 
export default cartRouter 