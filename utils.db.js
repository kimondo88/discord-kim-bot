
const MongoClient = require('mongodb').MongoClient;
const config = require('./config.json');
const url = config['db-url']; 
const dbName = 'users';
const collName = 'enneagram';

function main(){

async function addUserToDb(author){
    const user = {
        id: author.id,
        username: author.username,
        bot: author.bot,
        discriminator: author.discriminator,
        credits: 2000,
        common: 0, 
        rare: 0,
        epic: 0,
        legendary: 0,
        divine: 0
      }
    const textSuccess = `${user.username} with tag #${user.discriminator} was subscribed succesfully`;
    const textFailure = `${user.username} is already subscribed`;
    let text;
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(dbName)
    try{
        const checkForExist = await db.collection(collName).findOne( { id: user.id })
        if(checkForExist){
            text = textFailure;
        }else{
            await db.collection(collName).insertOne(user);
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
          const checkForExist = await db.collection(collName).findOne({ id: author.id})
          if(checkForExist){
            await db.collection(collName)
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
async function addDrop(author, drop){
    let text;
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(dbName)
    try{
        if(drop){
            switch(drop){
                case 'Divine':
                await db.collection(collName)
                    .updateOne({ id: author.id}, {$inc: { divine: +1 }})
                break;
                case 'Legendary':
                await db.collection(collName)
                    .updateOne({ id: author.id}, {$inc: { legendary: +1 }})
                break;
                case 'Epic':
                await db.collection(collName)
                    .updateOne({ id: author.id}, {$inc: { epic: +1 }})
                break;
                case 'Rare':
                await db.collection(collName)
                    .updateOne({ id: author.id}, {$inc: { rare: +1 }})
                rarity = 'rare';
                break;
                case 'Common':
                await db.collection(collName)
                    .updateOne({ id: author.id}, {$inc: { common: +1 }})
                rarity = 'common';
                break;
            }
          text = `Drop added, rarity:  ${drop}`; 
        }else{
          text =  'Not enough credits';
        }
    }catch(err){
        console.error(err);
    }finally{ 
        client.close(); 
        console.log(text); 
    }
    return text;
}

async function checkBalance(author){
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(dbName)
    let text;
    try{
        const checkForExist = await db.collection(collName).findOne({ id: author.id})
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
        const checkForExist = await db.collection(collName).findOne({ id: author.id })
        if(checkForExist.credits > 199){
        bool = true;
        }else{
        bool = false;
        }
    }catch(err){
        console.error(err);
    }finally{ 
        client.close(); 
        console.log(bool, 'balance checked'); 
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
        isSubscribed,
        addDrop
    };

}

module.exports = main();