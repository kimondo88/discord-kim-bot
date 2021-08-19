
const MongoClient = require('mongodb').MongoClient;
const config = require('./config.json');
const url = config['db-url']; 
const dbName = 'users';

const dotenv = require('dotenv').config();

function main(){

// function addUserToDb(user){
//     const client = new MongoClient(url);
//     await client.connect();
//     try{
//         client.db().createCollection
//     }catch(err){
//         console.error(err);
//     }
// }

function createCollection(name){
    return new Promise(async (resolve, reject) =>{
        const client = new MongoClient(url);
        try{
            await client.connect();
            const create = await client.db(dbName).createCollection(name);
            resolve(create);  
        }catch(err){
            reject(err);
        }finally{
            client.close();
        }
    })
}

return {createCollection}

}

module.exports = main();