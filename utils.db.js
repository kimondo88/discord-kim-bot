
const MongoClient = require('mongodb').MongoClient;
const config = require('./config.json');
const url = config['db-url']; 
const dbName = 'users';

function main(){

async function addUserToDb(author){
    const user = {
        id: author.id,
        username: author.username,
        bot: author.bot,
        discriminator: author.discriminator,
        credits: 2000
      }
    const textSuccess = `${user.username} with tag #${user.discriminator} was subscribed succesfully`;
    const textFailure = `${user.username} is already subscribed`;
    let text;
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(dbName)
    try{
        const checkForExist = await db.collection('enneagram').findOne( { id: user.id })
        if(checkForExist){
            text = textFailure;
        }else{
            await db.collection('enneagram').insertOne(user);
            text = textSuccess;
        }
    }catch(err){
        console.error(err);
    }finally{ 
        client.close(); 
        console.log("user added and client closed"); 
    }
    return text;
}

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

return { createCollection, addUserToDb}

}

module.exports = main();