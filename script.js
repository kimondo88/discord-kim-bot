const utility = require('./utils.db');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config.json');
const url = config['db-url']; 

const dotenv = require('dotenv').config();

// script for creating collections inside database, change const collectionToCreate to do so.
const collectionToCreate = ''

async function main(){
    const client = new MongoClient(url); 
    await client.connect();
    try{
        await utility.createCollection(collectionToCreate); 
    }catch(err){
        console.error(err);
    }finally{
        client.close();
    }
    
}

main();