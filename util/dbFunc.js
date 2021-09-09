const { addUserToDb } = require('../utils.db');

function dbFunc(){
    async function addToDb(msg){
        const text = await addUserToDb(msg.author)
        return msg.channel.send(text);
    }
    return { addToDb }
}

module.exports = dbFunc(); 