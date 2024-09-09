const fs = require('fs/promises');
const crypto = require('crypto'); //módulo crypto proporciona funcionalidades criptográficas que permiten realizar operaciones relacionadas con la seguridad de datos.
class Users {
    path = '';
    
    constructor(path='data/users.json'){
        this.path = path;
    }

    // {id: 'dsdsds32d', name: 'Juan',  email: 'juan@mail.com' }
    async addUser( user ){
        const { name, email } = user;
        //es una manera mas prolija de hacer: const name = user.name; const email = user.email.
        const id = crypto.randomUUID();
        // Leo el JSON local
        const data = await fs.readFile(this.path, 'utf-8'); //await: espera hasta que js lea el archivo
        const array = JSON.parse(data);
        //const id = array.length + 1;
        array.push({
            id: id,
            name: name,
            email: email
        })
        const dataStr= JSON.stringify( array, null, 2);
        // Guardo el JSON
        await fs.writeFile( this.path, dataStr, null, 2 );

    }
    async getUsers(){
        const data = await fs.readFile(this.path, 'utf-8');
        const array = JSON.parse(data);
        return array;
    }
    async getUserById( id ){
        const data = await fs.readFile(this.path, 'utf-8');
        const array = JSON.parse(data);
        return array.find( user => user.id == id);
    }
    async deleteUserById( id ){
        //lee el array
        const data = await fs.readFile(this.path, 'utf-8');
        // Convierte el contenido del archivo JSON a un array
        const array = JSON.parse(data);
         // Filtra el array para eliminar el producto con el ID especificado
        array = array.filter(user => user.id !== id);
        // Convierte el array actualizado a una cadena JSON
        const dataStr = JSON.stringify(array, null, 2);
        // Guarda el array actualizado en el archivo JSON
        await fs.writeFile(this.path, dataStr, 'utf-8');
    }
}


module.exports = { Users }