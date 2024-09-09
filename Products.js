const fs = require('fs/promises');
const crypto = require('crypto');

class Products {
    path = "";

    constructor(path='data/products.json'){
        this.path = path; //path de mi clase es igual al pasado como parametro.
    }

    async addProduct(producto){
        const {name, price} = producto;
        const id = crypto.randomUUID();
        const data = await fs.readFile(this.path, 'utf-8'); 
        const array = JSON.parse(data);
        array.push({
            id: id,
            name: name,
            price: price,
        })
        const dataStr= JSON.stringify(array, null, 2);
        // Guardo el JSON
        await fs.writeFile(this.path, dataStr, null, 2 );

    }
    async getProduct(){
        const data = await fs.readFile(this.path, 'utf-8');
        const array = JSON.parse(data);
        return array;
    }
    async getProductById( id ){
        const data = await fs.readFile(this.path, 'utf-8');
        const array = JSON.parse(data);
        return array.find( product => product.id == id);
    }

    async deleteProductById(id){
        // Lee el archivo JSON
        const data = await fs.readFile(this.path, 'utf-8');
        // Convierte el contenido del archivo JSON a un array
        let array = JSON.parse(data);
        // Filtra el array para eliminar el producto con el ID especificado
        array = array.filter(product => product.id !== id);
        // Convierte el array actualizado a una cadena JSON
        const dataStr = JSON.stringify(array, null, 2);
        // Guarda el array actualizado en el archivo JSON
        await fs.writeFile(this.path, dataStr, 'utf-8');
    }

    async updateProduct(id, updatedProduct) {
        // Lee el archivo JSON
        const data = await fs.readFile(this.path, 'utf-8');
        const array = JSON.parse(data);

        // Encuentra el índice del producto a actualizar
        const productIndex = array.findIndex(product => product.id === id);
        if (productIndex === -1) throw new Error('Producto no encontrado');

        // Actualiza el producto
        array[productIndex] = { ...array[productIndex], ...updatedProduct };

        // Guarda los productos actualizados en el archivo JSON
        const dataStr = JSON.stringify(array, null, 2);
        await fs.writeFile(this.path, dataStr, 'utf-8');
    }

    async saveProduct(array) {
        const dataStr = JSON.stringify(array, null, 2);
        await fs.writeFile(this.path, dataStr, 'utf-8');
    }
}

module.exports = { Products };