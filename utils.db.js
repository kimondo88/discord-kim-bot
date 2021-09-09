
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
async function subtractCredits(author, howMuch){
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName)
      try{
          const checkForExist = await db.collection('enneagram').findOne({ id: author.id})
          if(checkForExist){
            await db.collection('enneagram')
            .updateOne({ id: author.id}, {$inc: { credits: -howMuch}})
            text = `Credits subtracted, amount:  ${howMuch}`; 
          }else{
            text =  'Not enough credits';
          }
      }catch(err){
          console.error(err);
      }finally{ 
          client.close(); 
          console.log("credits subtracted and connection closed"); 
      }
      return text;
}
async function checkBalance(author){
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(dbName)
    let text;
    try{
        const checkForExist = await db.collection('enneagram').findOne({ id: author.id})
        if(checkForExist){
        text = `Your balance is ${checkForExist.credits}`
        }else{
        text =  'Not a subscribed user';
        }
    }catch(err){
        console.error(err);
    }finally{ 
        client.close(); 
        console.log('balance checked'); 
    }
    return text;
}
async function isSubscribed(author){
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(dbName)
    let bool; 
    try{
        const checkForExist = await db.collection('enneagram').findOne({ id: author.id, credits: { $gt: 199 }})
        if(checkForExist){
        bool = true;
        }else{
        bool = false;
        }
    }catch(err){
        console.error(err);
    }finally{ 
        client.close(); 
        console.log('balance checked'); 
    }
    return bool; 
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
    return { 
        createCollection, 
        addUserToDb, 
        subtractCredits,
        checkBalance,
        isSubscribed
    };

}

module.exports = main();