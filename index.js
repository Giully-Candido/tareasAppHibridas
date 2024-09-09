const express = require('express'); //require express,  biblioteca que facilita la creación de servidores web y el manejo de rutas en Node.js.
const { Users } = require('./Users');  
const { Products } = require('./Products');  
const app = express(); //a instancia de una app Express, que usaremos para configurar y manejar las rutas y middleware de tu aplicación web.
//"middleware" se refiere a funciones que se ejecutan durante el ciclo de vida de una solicitud HTTP. Estas funciones pueden modificar la solicitud (req), la respuesta (res) o finalizar la solicitud y respuesta. 
const port = 3000; //definimos el número del puerto en el que el servidor escuchará las solicitudes.
app.use(express.json()); //middleware: que permite que spress lea archivos json, // Para parsear el cuerpo de las solicitudes JSON

// Rutas creo las rutas
app.get('/', (req, res) => {
    res.send('Home');
    console.log('Cliente en el HOME')
});
//USUARIOS
// Retorna la lisa de usuarios
app.get('/users', async (req, res) => {
    const users = new Users();
    const data = await users.getUsers();
    console.table(data);
    res.status(200).send(data); //.status() es un método que se usa para establecer el código de estado HTTP de la respuesta
})

// Retorna el usuario por id
app.get('/users/:id', async ( req, res) => {
    const id = req.params.id;
    const users = new Users();
    const data = await users.getUserById(id);
    if( data ){
        res.status(200).json( data)
    } else {
        res.status(404).json({ mensaje: 'Usuario no econtrado'})
    }
})

// Guarda un usuario
app.post('/users', async( req, res) => {
    console.log( req.body );
    const { name, email } = req.body;
    if( !email || !name ){
        res.status(400).json({ mensaje: 'Faltan parametros'})
    }
    const users = new Users();
    await users.addUser({
        name,
        email
    })
    res.status(202).json({ mensaje: 'Usuario Guardado'})
})

// Ruta products
app.get('/products', (req, res) =>{
    res.send('Products');
    console.log('Cliente en la ruta /products')
});

// Retorna la lista de productos
app.get('/products', async (req, res) => {
    const products = new Products();
    const data = await products.getProduct();
    console.table(data);
    res.status(200).send(data); //.status() es un método que se usa para establecer el código de estado HTTP de la respuesta
})

// Guarda un producto
app.post('/products', async( req, res) => {
    console.log( req.body );
    const { name, price } = req.body;
    if( !price || !name ){
        res.status(400).json({ mensaje: 'Faltan parametros'})
    }
    const products = new Products();
    await products.addProduct({
        name,
        price
    })
    res.status(202).json({ mensaje: 'Producto Guardado'})
})
// POST errores
app.post('/products', (req, res) =>{
    const product = req.body;
    console.log('Cliente en la ruta POST: /products')
    console.log(product)
    if( product.name && product.price){
        res.status(202).json({ mensaje: 'Producto Guardado'});

    } else {
        res.status(400).json({ mensaje: 'Producto Invalido'});
    }
})
// Altera un producto
app.put('/products/:id', async (req, res) => {
    console.log(req.body);
    const id = req.params.id;
    const { name, price } = req.body;
    if (!price || !name) {
        return res.status(400).json({ mensaje: 'Faltan parámetros' });
    }
    const products = new Products();
    const existingProduct = await products.getProductById(id);
    if (!existingProduct) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    // Actualiza el producto
    await products.updateProduct(id, { name, price });

    res.status(200).json({ mensaje: 'Producto Actualizado' });
});

app.delete('/products/:id', async (req, res)=>{
    //guardo ID
    const id = req.params.id;
    const {name, price} = req.body;
    if(!id){
        return res.status(404).json({mensaje: 'Producto no encontrado'});
    }
    const product = new Products();
    const deleteProductById = await product.deleteProductById(id);
    res.status(200).json({mensaje: 'Porducto eliminado'})
})


const findById =  (req, res) =>{
    const id = req.params.id;
    res.send(`Products con el Id ${id} `);
    console.log(`Cliente en la ruta /products/${id}`);
}

// Ruta products con Parámetros
app.get('/products/:id', findById );


app.listen( port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
}); //hace que el servidor comience a escuchar en el puerto especificado