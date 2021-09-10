const { addUserToDb, subtractCredits, isSubscribed, checkBalance } = require('../utils.db');

function dbFunc(){
    async function addToDb(msg){
        const text = await addUserToDb(msg.author);
        return msg.channel.send(text);
    }

    async function subtract(msg, howMuch){
        const text = await subtractCredits(msg.author, howMuch);
        return msg.channel.send(text);
    }
    async function daily(msg, howMuch){
        await subtractCredits(msg.author, -howMuch);
        return msg.channel.send(`Your daily has been added to your account, amount: ${howMuch}`);
    }
    async function balance(msg){
        const text = await checkBalance(msg.author);
        return msg.channel.send(text);
    }

    return { 
        addToDb, 
        subtract, 
        balance,
        isSubscribed,
        daily
    };
}

module.exports = dbFunc(); 